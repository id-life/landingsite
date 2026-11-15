#!/usr/bin/env node
// Performance budget check (PERF-09). Measures a production build and fails when a number grows past the value
// recorded in perf-budget.json (plus its tolerance). Two measurements:
//
//   js       Initial JavaScript per route: every /_next/static script the server-rendered HTML references, gzipped
//            from the build output. Deterministic, no browser. Bundler-independent (Next 16 no longer prints
//            First Load JS, and Turbopack writes different manifests than webpack).
//   visit    First visit per device (phone 390x844, tablet 820x1180, laptop 1440x900) in Chrome with a cold cache:
//            bytes transferred, JavaScript transferred and request count until the page settles (the experience's
//            nav is visible and the network has been quiet for 3 s, capped at 60 s). CMS content (cdn.id.life media,
//            YouTube thumbnails, id-platform API responses, also through /_next/image) changes without a code change,
//            so it is reported as contentKB and not budgeted; everything else the page fetches is.
//
// Usage (after `npm run build`):
//   node scripts/perf-budget.mjs                 # both checks; starts `next start` on a free port itself
//   node scripts/perf-budget.mjs --only js       # no browser
//   node scripts/perf-budget.mjs --site http://127.0.0.1:3000   # measure a server that is already running
//   node scripts/perf-budget.mjs --record        # write today's numbers to perf-budget.json (ratchet after a fix)
//   node scripts/perf-budget.mjs --out report.json
//
// Chrome: CHROME_PATH, else the usual install locations. Without a GPU (CI runners), WebGL needs SwiftShader:
// PERF_GPU=swiftshader (the default on Linux). The visit check fails if the experience gets no WebGL context,
// because the no-WebGL path downloads less and would pass for the wrong reason.
// Read-only: GET requests only; analytics beacons are blocked; no form is touched.
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BUDGET_FILE = join(ROOT, 'perf-budget.json');
const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const opt = (name) => (args.includes(`--${name}`) ? args[args.indexOf(`--${name}`) + 1] : undefined);
const only = opt('only');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const kB = (bytes) => Math.round(bytes / 102.4) / 10;

const DEVICES = {
  phone: {
    width: 390,
    height: 844,
    dpr: 3,
    mobile: true,
    touch: true,
    platform: 'iPhone',
    ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1',
  },
  // iPadOS Safari asks for the desktop site: a Macintosh UA with touch points.
  tablet: {
    width: 820,
    height: 1180,
    dpr: 2,
    mobile: true,
    touch: true,
    platform: 'MacIntel',
    ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15',
  },
  laptop: { width: 1440, height: 900, dpr: 1, mobile: false, touch: false },
};
// Analytics endpoints: never sent from a measurement (local builds compile analytics out; this is a backstop).
const BLOCKED = [
  '*/g/collect*',
  '*google-analytics.com/*',
  '*analytics.google.com/*',
  '*googletagmanager.com/*',
  '*.clarity.ms/*',
  '*.ingest.sentry.io/*',
  '*.ingest.us.sentry.io/*',
  '*/_vercel/insights/*',
  '*/_vercel/speed-insights/*',
];

// CMS-owned content: it changes when an editor publishes, not when code changes.
const CONTENT =
  /^https?:\/\/(cdn\.id\.life|id-platform\.id\.life|img\.youtube\.com|i\.ytimg\.com)\/|[?&]url=https?:\/\/(cdn\.id\.life|img\.youtube\.com|i\.ytimg\.com)\//;
const safeDecode = (u) => {
  try {
    return decodeURIComponent(u);
  } catch {
    return u;
  }
};

const budget = JSON.parse(readFileSync(BUDGET_FILE, 'utf8'));
const failures = [];
const warnings = [];
const report = { at: new Date().toISOString(), js: {}, visit: {} };

// ---------- server ----------
async function freePort() {
  return new Promise((resolve, reject) => {
    const srv = createServer();
    srv.once('error', reject);
    srv.listen(0, '127.0.0.1', () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
  });
}
async function startServer() {
  const port = await freePort();
  const child = spawn(
    process.execPath,
    [join(ROOT, 'node_modules/next/dist/bin/next'), 'start', '-H', '127.0.0.1', '-p', String(port)],
    {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
    },
  );
  child.stdout.resume();
  child.stderr.on('data', (d) => process.stderr.write(`[next start] ${d}`));
  const site = `http://127.0.0.1:${port}`;
  for (let i = 0; i < 120; i += 1) {
    try {
      if ((await fetch(`${site}/robots.txt`)).ok) return { site, stop: () => child.kill('SIGTERM') };
    } catch {
      /* not up yet */
    }
    await sleep(500);
  }
  child.kill('SIGKILL');
  throw new Error('next start did not answer within 60 s (run `npm run build` first)');
}

// ---------- js: initial scripts per route ----------
const gzCache = new Map();
function gzipSize(urlPath) {
  if (gzCache.has(urlPath)) return gzCache.get(urlPath);
  const file = join(ROOT, '.next', decodeURIComponent(urlPath.replace(/^\/_next\//, '').split('?')[0]));
  const size = existsSync(file) ? gzipSync(readFileSync(file), { level: 9 }).length : null;
  gzCache.set(urlPath, size);
  return size;
}
async function measureJs(site) {
  for (const route of Object.keys(budget.routes)) {
    const res = await fetch(`${site}${route}`, { headers: { 'user-agent': 'Mozilla/5.0 perf-budget' } });
    if (!res.ok) {
      failures.push(`js ${route}: HTTP ${res.status}`);
      continue;
    }
    const html = await res.text();
    const srcs = new Set();
    // nomodule scripts (the legacy polyfills) are skipped by every browser the site supports.
    for (const m of html.matchAll(/<script\b[^>]*>/g)) {
      const src = m[0].match(/\bsrc="([^"]+)"/)?.[1];
      if (src && !/\bnomodule\b/i.test(m[0])) srcs.add(src);
    }
    for (const m of html.matchAll(
      /<link\b[^>]*\brel="(?:preload|modulepreload)"[^>]*\bas="script"[^>]*\bhref="([^"]+)"|<link\b[^>]*\bhref="([^"]+)"[^>]*\bas="script"/g,
    ))
      srcs.add(m[1] ?? m[2]);
    const files = [...srcs]
      .map((s) => s.replace(/&amp;/g, '&'))
      .filter((s) => s.startsWith('/_next/static/') && /\.js(\?|$)/.test(s));
    let total = 0;
    const missing = [];
    for (const f of files) {
      const s = gzipSize(f);
      if (s == null) missing.push(f);
      else total += s;
    }
    if (missing.length) failures.push(`js ${route}: ${missing.length} referenced chunk(s) not found in .next (${missing[0]})`);
    report.js[route] = { files: files.length, gzipKB: kB(total) };
    check(`js ${route} initial JS (gzip)`, kB(total), budget.routes[route].jsInitialGzipKB, budget.tolerance.js, 'kB');
  }
}

// ---------- visit: Chrome over the DevTools protocol (no dependency) ----------
function chromePath() {
  return [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ]
    .filter(Boolean)
    .find((p) => existsSync(p));
}
async function launchChrome() {
  const exe = chromePath();
  if (!exe) throw new Error('no Chrome found: set CHROME_PATH');
  const gpu = process.env.PERF_GPU ?? (process.platform === 'linux' ? 'swiftshader' : 'hardware');
  const profile = mkdtempSync(join(tmpdir(), 'perf-budget-'));
  const child = spawn(
    exe,
    [
      '--headless=new',
      '--remote-debugging-port=0',
      `--user-data-dir=${profile}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--hide-scrollbars',
      '--mute-audio',
      '--disable-background-timer-throttling',
      '--disable-renderer-backgrounding',
      '--disable-backgrounding-occluded-windows',
      ...(gpu === 'swiftshader'
        ? ['--use-angle=swiftshader', '--enable-unsafe-swiftshader']
        : ['--enable-gpu', '--ignore-gpu-blocklist']),
      ...(process.platform === 'linux' ? ['--no-sandbox'] : []),
      'about:blank',
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] },
  );
  const port = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Chrome printed no DevTools port')), 30000);
    let buf = '';
    const onData = (d) => {
      buf += d;
      const m = buf.match(/ws:\/\/127\.0\.0\.1:(\d+)\//);
      if (m) {
        clearTimeout(timer);
        child.stderr.off('data', onData);
        child.stderr.resume();
        resolve(Number(m[1]));
      }
    };
    child.stderr.on('data', onData);
    child.once('error', reject);
  });
  return {
    port,
    async close() {
      child.kill('SIGKILL');
      await sleep(300);
      rmSync(profile, { recursive: true, force: true });
    },
  };
}
async function openTarget(port) {
  const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });
  let id = 0;
  const pending = new Map();
  const listeners = new Map();
  ws.addEventListener('message', (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id === undefined) {
      for (const fn of listeners.get(msg.method) ?? []) fn(msg.params);
      return;
    }
    const p = pending.get(msg.id);
    if (!p) return;
    pending.delete(msg.id);
    if (msg.error) p.reject(new Error(`${p.method}: ${msg.error.message}`));
    else p.resolve(msg.result);
  });
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const n = ++id;
      const timer = setTimeout(() => {
        if (pending.delete(n)) reject(new Error(`${method}: no reply`));
      }, 30000);
      pending.set(n, {
        method,
        resolve: (v) => {
          clearTimeout(timer);
          resolve(v);
        },
        reject: (err) => {
          clearTimeout(timer);
          reject(err);
        },
      });
      ws.send(JSON.stringify({ id: n, method, params }));
    });
  const on = (method, fn) => {
    if (!listeners.has(method)) listeners.set(method, new Set());
    listeners.get(method).add(fn);
  };
  const evaluate = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true })).result?.value;
  return {
    send,
    on,
    evaluate,
    close: async () => {
      await send('Target.closeTarget', { targetId: target.id }).catch(() => {});
      ws.close();
    },
  };
}

async function measureVisit(site, deviceName, route, kind) {
  const device = DEVICES[deviceName];
  const chrome = await launchChrome();
  try {
    const page = await openTarget(chrome.port);
    const reqs = new Map();
    let lastActivity = Date.now();
    page.on('Network.requestWillBeSent', (p) => {
      if (!reqs.has(p.requestId)) reqs.set(p.requestId, { url: p.request.url, type: p.type, bytes: 0 });
      lastActivity = Date.now();
    });
    page.on('Network.responseReceived', (p) => {
      const r = reqs.get(p.requestId);
      if (r) r.type = p.type;
    });
    page.on('Network.loadingFinished', (p) => {
      const r = reqs.get(p.requestId);
      if (r) {
        r.bytes = p.encodedDataLength;
        r.done = true;
      }
      lastActivity = Date.now();
    });
    page.on('Network.loadingFailed', (p) => {
      const r = reqs.get(p.requestId);
      if (r) {
        r.failed = p.blockedReason ?? p.errorText;
        r.done = true;
      }
      lastActivity = Date.now();
    });
    await page.send('Page.enable');
    await page.send('Runtime.enable');
    await page.send('Network.enable');
    await page.send('Network.setCacheDisabled', { cacheDisabled: true });
    await page.send('Network.setBlockedURLs', { urls: BLOCKED });
    await page.send('Emulation.setDeviceMetricsOverride', {
      width: device.width,
      height: device.height,
      deviceScaleFactor: device.dpr,
      mobile: device.mobile,
      screenWidth: device.width,
      screenHeight: device.height,
    });
    if (device.touch) await page.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
    if (device.ua)
      await page.send('Emulation.setUserAgentOverride', {
        userAgent: device.ua,
        platform: device.platform,
        acceptLanguage: 'en-US,en;q=0.9',
      });
    const webgl = await page.evaluate(
      `(() => { try { return !!document.createElement('canvas').getContext('webgl2'); } catch { return false; } })()`,
    );
    const start = Date.now();
    await page.send('Page.navigate', { url: `${site}${route}` });
    let uiMs = null;
    for (;;) {
      await sleep(250);
      const elapsed = Date.now() - start;
      if (uiMs == null) {
        const ready =
          kind === 'experience'
            ? await page
                .evaluate(
                  `(() => { const n = document.querySelector('#nav') ?? document.querySelector('#mobile-nav'); return !!n && +getComputedStyle(n).opacity >= 0.99; })()`,
                )
                .catch(() => false)
            : await page.evaluate(`document.readyState === 'complete'`).catch(() => false);
        if (ready) uiMs = elapsed;
      }
      const inflight = [...reqs.values()].filter((r) => !r.done).length;
      if (uiMs != null && Date.now() - lastActivity >= 3000 && inflight <= 1) break;
      if (elapsed > 60000) break;
    }
    await page.close();
    const all = [...reqs.values()].filter((r) => !r.failed && !r.url.startsWith('data:'));
    const isContent = (r) => CONTENT.test(safeDecode(r.url));
    const code = all.filter((r) => !isContent(r));
    const sum = (list) => list.reduce((s, r) => s + (r.bytes ?? 0), 0);
    return {
      webgl,
      uiMs,
      kB: kB(sum(code)),
      jsKB: kB(sum(code.filter((r) => r.type === 'Script'))),
      requests: code.length,
      contentKB: kB(sum(all.filter(isContent))),
      contentRequests: all.length - code.length,
    };
  } finally {
    await chrome.close();
  }
}

async function measureVisits(site) {
  for (const [deviceName, routes] of Object.entries(budget.firstVisit)) {
    for (const [route, rec] of Object.entries(routes)) {
      const kind = budget.routes[route]?.kind ?? 'content';
      const m = await measureVisit(site, deviceName, route, kind);
      report.visit[`${deviceName} ${route}`] = m;
      console.log(
        `visit ${deviceName.padEnd(6)} ${route.padEnd(12)} ${String(m.kB).padStart(8)} kB  js ${String(m.jsKB).padStart(7)} kB  ${String(m.requests).padStart(3)} req  (+ content ${m.contentKB} kB, ${m.contentRequests} req)  ui ${m.uiMs ?? '-'} ms  webgl ${m.webgl}`,
      );
      if (kind === 'experience' && !m.webgl)
        failures.push(`visit ${deviceName} ${route}: no WebGL context (run Chrome with a GPU or PERF_GPU=swiftshader)`);
      if (kind === 'experience' && m.uiMs == null)
        failures.push(`visit ${deviceName} ${route}: the nav never became visible within 60 s`);
      check(`visit ${deviceName} ${route} bytes`, m.kB, rec.kB, budget.tolerance.visit, 'kB');
      check(`visit ${deviceName} ${route} JS`, m.jsKB, rec.jsKB, budget.tolerance.visit, 'kB');
      check(`visit ${deviceName} ${route} requests`, m.requests, rec.requests, budget.tolerance.requests, 'req');
      const target = budget.targets?.[kind]?.[deviceName === 'phone' ? 'phone' : 'laptopTablet'];
      const total = Math.round((m.kB + m.contentKB) * 10) / 10;
      if (target?.firstVisitKB && total > target.firstVisitKB)
        warnings.push(
          `visit ${deviceName} ${route}: ${total} kB with content is over the target budget of ${target.firstVisitKB} kB (docs/performance-budget.md)`,
        );
    }
  }
}

// ---------- compare ----------
function check(label, measured, recorded, tolerance, unit) {
  if (recorded == null) {
    warnings.push(`${label}: no recorded value (run with --record)`);
    return;
  }
  const limit = Math.round(recorded * (1 + tolerance) * 10) / 10;
  const line = `${label}: ${measured} ${unit} (recorded ${recorded}, limit ${limit})`;
  if (measured > limit) failures.push(line);
  else if (only !== 'visit' || !label.startsWith('js')) console.log(`ok   ${line}`);
}

function record() {
  for (const [route, r] of Object.entries(report.js)) budget.routes[route].jsInitialGzipKB = r.gzipKB;
  for (const [key, m] of Object.entries(report.visit)) {
    const [deviceName, route] = key.split(' ');
    budget.firstVisit[deviceName][route] = { kB: m.kB, jsKB: m.jsKB, requests: m.requests };
  }
  budget.recordedAt = report.at;
  writeFileSync(BUDGET_FILE, `${JSON.stringify(budget, null, 2)}\n`);
  console.log(`recorded today's numbers in ${BUDGET_FILE}`);
}

let server = null;
try {
  const site = opt('site')?.replace(/\/$/, '') ?? (server = await startServer()).site;
  if (only !== 'visit') await measureJs(site);
  if (only !== 'js') await measureVisits(site);
} catch (err) {
  failures.push(`error: ${err.message}`);
} finally {
  server?.stop();
}
if (opt('out')) writeFileSync(opt('out'), `${JSON.stringify({ ...report, failures, warnings }, null, 2)}\n`);
for (const w of warnings) console.log(`warn ${w}`);
if (flag('record') && !failures.some((f) => f.startsWith('error') || f.includes('WebGL') || f.includes('never'))) {
  record();
  process.exit(0);
}
for (const f of failures) console.log(`FAIL ${f}`);
console.log(
  failures.length
    ? `\n${failures.length} budget failure(s). If the growth is intended, say why in the PR and re-record with --record.`
    : '\nAll numbers within budget.',
);
process.exit(failures.length ? 1 : 0);
