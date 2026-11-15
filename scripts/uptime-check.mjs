#!/usr/bin/env node
// ENG-08: free uptime check for the pages Sentry's single included monitor does not cover. Run by
// .github/workflows/uptime.yml every 10 minutes; exits 1 when a URL is down (the workflow then opens or updates one
// GitHub issue labelled "uptime"). A Vercel firewall challenge (403/429 with x-vercel-mitigated) is reported as
// "challenged", not down: it says nothing about the site. Usage: node scripts/uptime-check.mjs [base URL]
const BASE = (process.argv[2] || process.env.UPTIME_BASE || 'https://www.id.life').replace(/\/$/, '');
const API = process.env.UPTIME_API || 'https://id-platform.id.life';
const TARGETS = [
  { name: 'home', url: `${BASE}/` },
  { name: 'news', url: `${BASE}/news` },
  { name: 'article', url: `${BASE}/news/immortal-dragons-news-and-updates` },
  { name: 'podcast', url: `${BASE}/podcast` },
  { name: 'api', url: `${API}/insights` },
];

async function check({ name, url }) {
  const started = Date.now();
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(15_000),
      headers: { 'user-agent': 'id-life-uptime-check' },
    });
    const ms = Date.now() - started;
    const mitigated = res.headers.get('x-vercel-mitigated');
    if ((res.status === 403 || res.status === 429) && mitigated)
      return { name, url, status: res.status, ms, state: 'challenged' };
    return { name, url, status: res.status, ms, state: res.ok ? 'up' : 'down' };
  } catch (error) {
    return { name, url, status: 0, ms: Date.now() - started, state: 'down', error: String(error?.message ?? error) };
  }
}

const results = await Promise.all(TARGETS.map(check));
for (const r of results)
  console.log(
    `${new Date().toISOString()} ${r.state.padEnd(10)} ${String(r.status).padEnd(4)} ${String(r.ms).padStart(6)} ms  ${r.name}  ${r.url}${r.error ? `  (${r.error})` : ''}`,
  );
const down = results.filter((r) => r.state === 'down');
if (process.env.GITHUB_STEP_SUMMARY) {
  const { appendFileSync } = await import('node:fs');
  appendFileSync(
    process.env.GITHUB_STEP_SUMMARY,
    [
      '| check | state | status | ms |',
      '|---|---|---|---|',
      ...results.map((r) => `| ${r.name} | ${r.state} | ${r.status} | ${r.ms} |`),
      '',
    ].join('\n'),
  );
}
process.exit(down.length ? 1 : 0);
