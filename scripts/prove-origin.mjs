// CON-10, approval by origin: proves which content records are the owner's own unchanged words and writes
// src/content/origin-proof.json, which src/content/origin.ts reads to stamp exactly those records approved.
//
// A record is proven when every piece of its drawn text (each text field; not links, image paths, slugs or ISO dates,
// which are data) is found, word for word, in the origin: the original's source tree and/or the pages the owner's site
// serves. Whitespace runs, HTML entities and JavaScript string escapes are normalised on both sides; nothing else is.
// A record whose differing words are exactly the ones a ruling of the owner sets (RULINGS below) is proven by that
// ruling instead. A record with any other text not found is not proven, and is listed with the text that differs.
//
//   node scripts/prove-origin.mjs --label "<origin, as it should read in the approval>" \
//     [--source <the original's source tree>] [--served <base URL of the owner's site>] [--report <file.json>]
//
// The label is what the proof names; the paths and URLs given are not written into the repository.
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import jiti from 'jiti';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(
  process.argv
    .slice(2)
    .reduce((pairs, arg, i, all) => (arg.startsWith('--') ? [...pairs, [arg.slice(2), all[i + 1]]] : pairs), []),
);
if (!args.label || (!args.source && !args.served)) {
  console.error('usage: node scripts/prove-origin.mjs --label <origin> [--source <dir>] [--served <url>] [--report <file>]');
  process.exit(2);
}

const decode = (text) =>
  text
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/\\(["'`\\])/g, '$1')
    .replace(/\\n/g, ' ')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
const normalise = (text) => decode(text).replace(/\s+/g, ' ').trim();

// The origin's text.
const corpus = [];
if (args.source) {
  const walk = (dir) =>
    readdirSync(dir).flatMap((name) => {
      if (name === 'node_modules' || name.startsWith('.')) return [];
      const path = join(dir, name);
      return statSync(path).isDirectory() ? walk(path) : /\.(tsx?|jsx?|mjs|json|md|txt|html)$/.test(name) ? [path] : [];
    });
  for (const file of walk(args.source)) corpus.push(normalise(readFileSync(file, 'utf8')));
}
if (args.served) {
  const base = args.served.replace(/\/$/, '');
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => new URL(m[1].replace(/&amp;/g, '&')).pathname + new URL(m[1].replace(/&amp;/g, '&')).search)
    .filter((path) => !/^\/podcast\/\d+/.test(path));
  for (const path of [...new Set([...paths, '/llms.txt'])]) {
    const res = await fetch(base + path);
    if (res.ok) corpus.push(normalise(await res.text()));
  }
}
const text = corpus.join('\n');
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Word-bounded where the text starts or ends with a word character, so a short value is not "found" inside a longer word.
const found = (value) => {
  const s = normalise(value);
  const pattern = `${/^\w/.test(s) ? '(?<![\\w])' : ''}${escape(s)}${/\w$/.test(s) ? '(?![\\w])' : ''}`;
  return new RegExp(pattern).test(text);
};

// The records, through the content layer's own list (src/content/validate.ts), so none is missed.
const load = jiti(import.meta.url, { alias: { '@': join(root, 'src') } });
const { CONTENT_ENTRIES } = load(join(root, 'src/content/validate.ts'));
const { eachRecord, fingerprint } = load(join(root, 'src/content/origin.ts'));

const DATA_KEYS = new Set([
  'slug',
  'id',
  'url',
  'href',
  'logo',
  'image',
  'src',
  'icon',
  'founder',
  'subject',
  'kind',
  'type',
  'doi',
]); // doi: an identifier, linked not drawn
const isData = (key, value) =>
  DATA_KEYS.has(key) || /^(https?:|mailto:|\/)/.test(value) || /^\d{4}-\d{2}(-\d{2})?$/.test(value);
function drawnText(value, path = '', key = '') {
  if (typeof value === 'string') return isData(key, value) ? [] : [[path, value]];
  if (Array.isArray(value)) return value.flatMap((item, i) => drawnText(item, `${path}[${i}]`, key));
  if (!value || typeof value !== 'object') return [];
  return Object.entries(value).flatMap(([k, child]) =>
    k === 'approval' || (child && typeof child === 'object' && 'approval' in child)
      ? []
      : drawnText(child, path ? `${path}.${k}` : k, k),
  );
}

// The owner's rulings that set a record's words himself (a second origin kind). Each names the ruling and its date and
// gives the exact words it sets, field by field; a record is proven by a ruling only when every word of it is either
// found in the origin or is exactly what a ruling of his sets.
const RULINGS = {
  'content/initiatives.ts#groups[papers-reviews]': {
    ruling: 'the owner\'s ruling of 2026-11-17: the heading becomes "Papers & Reviews 论文与综述"',
    rulingAt: '2026-11-17',
    sets: { 'text.en': 'Papers & Reviews', 'text.zh': '论文与综述' },
  },
  'content/connect.ts#criteria': {
    ruling: "the owner's ruling of 2026-11-18 (answer 12j): delete the text that says which stage the fund invests in",
    rulingAt: '2026-11-18',
    sets: { 'items[0].en': 'Partnering with startups under $100m valuations.', 'items[0].zh': '与估值1亿美元以下的企业合作' },
  },
};

const records = {};
const rulings = {};
const unproven = [];
const awaitingRuling = [];
for (const [name, , data] of CONTENT_ENTRIES) {
  eachRecord(name, data, (key, record) => {
    if (record.approval.pendingRuling) {
      awaitingRuling.push({ key, ruling: record.approval.pendingRuling });
      return;
    }
    const texts = drawnText(record);
    const differing = texts.filter(([, value]) => !found(value)).map(([field, value]) => ({ field, text: value }));
    const ruling = RULINGS[key];
    const setByRuling = (d) => ruling && ruling.sets[d.field] === d.text;
    if (texts.length > 0 && differing.length === 0) records[key] = fingerprint(record);
    else if (texts.length > 0 && differing.every(setByRuling))
      rulings[key] = { fingerprint: fingerprint(record), ruling: ruling.ruling, rulingAt: ruling.rulingAt };
    else unproven.push({ key, differing: texts.length ? differing : [{ field: '-', text: '(no drawn text)' }] });
  });
}

const provedAt = new Date().toISOString().slice(0, 10);
const proofPath = join(root, 'src/content/origin-proof.json');
writeFileSync(proofPath, `${JSON.stringify({ origin: args.label, provedAt, records, rulings }, null, 2)}\n`);
const report = { origin: args.label, provedAt, proven: Object.keys(records), byRuling: rulings, unproven, awaitingRuling };
if (args.report) writeFileSync(args.report, `${JSON.stringify(report, null, 1)}\n`);
const proven = Object.keys(records).length + Object.keys(rulings).length;
const total = proven + unproven.length + awaitingRuling.length;
console.log(
  `${proven} of ${total} records proven (${Object.keys(rulings).length} by his ruling); ${unproven.length} not proven; ${awaitingRuling.length} awaiting a ruling`,
);
for (const [key, r] of Object.entries(rulings)) console.log(`  ${key}  by ${r.ruling}`);
for (const item of unproven)
  for (const d of item.differing) console.log(`  ${item.key}  ${d.field}: ${JSON.stringify(d.text)}`);
for (const item of awaitingRuling) console.log(`  ${item.key}  awaiting: ${item.ruling}`);
