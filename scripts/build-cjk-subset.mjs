#!/usr/bin/env node
// VIS-07: cut the Chinese display face (Source Han Sans CN, weights 500 and 700) down to the characters of the
// display strings (src/constants/display-strings.ts), as WOFF2, and record what it holds in a manifest.
//
// Run it through the coverage test, which collects the strings with the app's own module resolution:
//   UPDATE_CJK_SUBSET=1 npx vitest run test/cjk-display.test.mjs
// Without the variable the test only checks that every display character is in the committed subset.
//
// Sources: Adobe's Source Han Sans CN OTFs (SIL Open Font License 1.1,
// https://github.com/adobe-fonts/source-han-sans/blob/release/LICENSE.txt), downloaded from a pinned commit and
// checked against their SHA-256 before use, so the full 8 MB fonts are not kept in the repository. The subsetter is
// subset-font (HarfBuzz compiled to WebAssembly), installed at a pinned version into node_modules/.cache, so the
// site gets no new dependency.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CACHE = join(ROOT, 'node_modules/.cache/build-cjk-subset');
const SUBSETTER = 'subset-font@2.9.0';
const COMMIT = '6c709ca72d3d7c46ab42ebecc1a26e7d69595a37';
export const SOURCES = {
  500: {
    url: `https://raw.githubusercontent.com/adobe-fonts/source-han-sans/${COMMIT}/SubsetOTF/CN/SourceHanSansCN-Medium.otf`,
    sha256: 'a94e558a2fe972bee4f46bce0843abff37063fd68c33f1e7d9058f6f09432b01',
  },
  700: {
    url: `https://raw.githubusercontent.com/adobe-fonts/source-han-sans/${COMMIT}/SubsetOTF/CN/SourceHanSansCN-Bold.otf`,
    sha256: '62383707c086a32f3afd5e293f34c7eff64c7fea31f579fdc6cbe34d920519a6',
  },
};
export const OUT_DIR = join(ROOT, 'src/styles/fonts');
export const MANIFEST = join(OUT_DIR, 'cjk-display.json');
export const fileFor = (weight) => join(OUT_DIR, `cjk-display-${weight}.woff2`);

const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');

/** The characters the subset must hold: CJK ideographs and CJK/full-width punctuation, sorted, deduplicated. */
export function displayCharacters(strings) {
  const chars = new Set();
  for (const s of strings) for (const ch of s) if (/[　-〿㐀-鿿豈-﫿＀-￯]/u.test(ch)) chars.add(ch);
  return [...chars].sort().join('');
}

async function source(weight) {
  const { url, sha256: want } = SOURCES[weight];
  const file = join(CACHE, url.split('/').pop());
  if (!existsSync(file) || sha256(readFileSync(file)) !== want) {
    mkdirSync(CACHE, { recursive: true });
    const res = await fetch(url);
    if (!res.ok) throw new Error(`download failed: ${res.status} ${url}`);
    writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  const buf = readFileSync(file);
  if (sha256(buf) !== want) throw new Error(`checksum mismatch for ${url}: got ${sha256(buf)}, want ${want}`);
  return buf;
}

function subsetter() {
  const dir = join(CACHE, 'tool');
  if (!existsSync(join(dir, 'node_modules/subset-font'))) {
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'package.json'), '{"private":true}');
    execFileSync('npm', ['install', '--no-audit', '--no-fund', '--prefix', dir, SUBSETTER], { stdio: 'inherit' });
  }
  return createRequire(join(dir, 'package.json'))('subset-font');
}

/** Write the two WOFF2 subsets and the manifest for these display strings. */
export async function buildCjkSubset(strings) {
  const text = displayCharacters(strings);
  const subsetFont = subsetter();
  const files = {};
  for (const weight of Object.keys(SOURCES)) {
    const woff2 = await subsetFont(await source(weight), text, { targetFormat: 'woff2' });
    writeFileSync(fileFor(weight), woff2);
    files[weight] = { bytes: woff2.length, sha256: sha256(woff2) };
  }
  const manifest = { generatedBy: 'scripts/build-cjk-subset.mjs', sources: SOURCES, characters: text, files };
  writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);
  return manifest;
}

/** What the committed subset holds, and whether its files are the ones the manifest describes. */
export function readSubset() {
  const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'));
  const drift = Object.entries(manifest.files)
    .filter(([weight, f]) => !existsSync(fileFor(weight)) || sha256(readFileSync(fileFor(weight))) !== f.sha256)
    .map(([weight]) => weight);
  return { manifest, drift };
}
