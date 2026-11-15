#!/usr/bin/env node
// Convert TTF/OTF font files to WOFF2 (Google's woff2 compression: lossless, typically 40-60 % of the
// TTF size), writing <name>.woff2 next to each input. Used for the Source Han Sans CN subsets that
// next/font serves and for their full-font sources in src/styles/fonts/font-min/.
//   node scripts/build-fonts.mjs src/styles/fonts/SourceHanSansCN-Bold-min.ttf [...more files]
// The converter (ttf2woff2, pinned) runs through npx, so the site gets no new dependency.
//
// Re-subsetting the Chinese face (when the strings in font-min/index.md change) needs a subsetter that
// reads WOFF2 and writes WOFF2, e.g. `pyftsubset <font-min source>.woff2 --text-file=index.md
// --flavor=woff2 --output-file=<name>-min.woff2` (fonttools with brotli) or the subset-font package.
//
// Xirod, Migrena and TT Lakes are deliberately not converted here: whether those faces stay is the
// owner's decision (Oxanium + Poppins palette, see the master plan's ENG-repo-exposure / VIS-font-palette).
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const CONVERTER = 'ttf2woff2@8.0.1';
const inputs = process.argv.slice(2);
if (!inputs.length) throw new Error('usage: build-fonts.mjs <font.ttf|font.otf> [...]');
for (const input of inputs) {
  if (!/\.(ttf|otf)$/i.test(input)) throw new Error(`not a TTF/OTF file: ${input}`);
  const output = input.replace(/\.(ttf|otf)$/i, '.woff2');
  const woff2 = execFileSync('npx', ['--yes', CONVERTER], { input: readFileSync(input), maxBuffer: 64 * 1024 * 1024 });
  writeFileSync(output, woff2);
  console.log(`${input} (${readFileSync(input).length} B) -> ${output} (${woff2.length} B)`);
}
