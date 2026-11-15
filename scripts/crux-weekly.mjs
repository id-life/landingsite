#!/usr/bin/env node
// PERF-08: weekly Chrome UX Report snapshot for the origin and /, /news, /podcast, phone and desktop. Writes
// perf/crux/<date>.json. The origin has had too little Chrome traffic for CrUX since June 2026, so "insufficient
// data" (HTTP 404 from the API) is recorded explicitly instead of failing; alerts come from the RUM stream, not here.
// Needs CRUX_API_KEY (a Google Cloud API key with the Chrome UX Report API enabled; an owner step).
import { mkdirSync, writeFileSync } from 'node:fs';

const KEY = process.env.CRUX_API_KEY;
if (!KEY) {
  console.error('CRUX_API_KEY is not set');
  process.exit(2);
}
const ORIGIN = 'https://www.id.life';
const queries = [{ origin: ORIGIN }, ...['/', '/news', '/podcast'].map((p) => ({ url: `${ORIGIN}${p}` }))];
const METRICS = [
  'largest_contentful_paint',
  'interaction_to_next_paint',
  'cumulative_layout_shift',
  'first_contentful_paint',
  'experimental_time_to_first_byte',
];

const rows = [];
for (const q of queries) {
  for (const formFactor of ['PHONE', 'DESKTOP']) {
    const res = await fetch(`https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${KEY}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...q, formFactor, metrics: METRICS }),
    });
    const target = q.origin ?? q.url;
    if (res.status === 404) {
      rows.push({ target, formFactor, status: 'insufficient data' });
      continue;
    }
    if (!res.ok) {
      rows.push({ target, formFactor, status: `error ${res.status}` });
      continue;
    }
    const json = await res.json();
    const p75 = Object.fromEntries(Object.entries(json.record?.metrics ?? {}).map(([m, v]) => [m, v.percentiles?.p75 ?? null]));
    rows.push({ target, formFactor, status: 'ok', collectionPeriod: json.record?.collectionPeriod, p75 });
  }
}
const date = new Date().toISOString().slice(0, 10);
mkdirSync('perf/crux', { recursive: true });
writeFileSync(`perf/crux/${date}.json`, `${JSON.stringify({ date, rows }, null, 2)}\n`);
for (const r of rows) console.log(`${r.formFactor.padEnd(8)} ${r.status.padEnd(18)} ${r.target}`);
