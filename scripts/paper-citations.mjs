#!/usr/bin/env node
// Citation counts for the Spectrum papers (src/content/initiatives.ts, PAPERS).
//
// The Spectrum section shows the three most cited papers at rest and the others behind "more", most cited first. The
// counts are written into the content file by hand, so the site never depends on an outside service at build time or
// in the browser. This script reads each paper's count at Crossref ("is-referenced-by-count", by DOI) and prints the
// recorded and the current number side by side, and the order that results.
//
//   node scripts/paper-citations.mjs           # compare; exit 1 if a recorded count is out of date
//
// To update: edit `citations` in src/content/initiatives.ts to the numbers printed here, and change the date in the
// comment above PAPERS. Crossref asks nothing of an anonymous reader; no key and no personal data are sent.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const FILE = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'content', 'initiatives.ts');
const source = readFileSync(FILE, 'utf8');
const block = source.slice(source.indexOf('export const PAPERS'), source.indexOf('export const PAPERS_BY_CITATIONS'));
const papers = [...block.matchAll(/slug: '([^']+)',[\s\S]*?doi: '([^']+)',\s*citations: (\d+),/g)].map(
  ([, slug, doi, recorded]) => ({
    slug,
    doi,
    recorded: Number(recorded),
  }),
);
if (!papers.length) {
  console.error(`no papers with a doi and a citations count found in ${FILE}`);
  process.exit(2);
}

let stale = 0;
for (const paper of papers) {
  try {
    const response = await fetch(`https://api.crossref.org/works/${encodeURIComponent(paper.doi)}`, {
      headers: { 'User-Agent': 'paper-citations/1.0' },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    paper.current = (await response.json()).message['is-referenced-by-count'];
  } catch (error) {
    paper.current = null;
    paper.error = String(error.message ?? error);
  }
  if (paper.current !== null && paper.current !== paper.recorded) stale += 1;
}

const byCount = (key) => [...papers].sort((a, b) => (b[key] ?? 0) - (a[key] ?? 0)).map((paper) => paper.slug);
for (const paper of papers) {
  const now = paper.current === null ? `? (${paper.error})` : String(paper.current);
  const mark = paper.current !== null && paper.current !== paper.recorded ? '  <- update' : '';
  console.log(
    `${String(paper.recorded).padStart(4)} recorded  ${now.padStart(4)} at Crossref  ${paper.slug}  (${paper.doi})${mark}`,
  );
}
const recordedOrder = byCount('recorded');
const currentOrder = byCount('current');
console.log(`\norder on the site: ${recordedOrder.join(', ')}`);
if (recordedOrder.join() !== currentOrder.join()) console.log(`order by today's counts: ${currentOrder.join(', ')}`);
console.log(stale ? `\n${stale} count(s) out of date: edit src/content/initiatives.ts` : '\nevery recorded count is current');
process.exit(stale ? 1 : 0);
