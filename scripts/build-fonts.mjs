#!/usr/bin/env node
// Convert TTF/OTF font files to WOFF2 (Google's woff2 compression: lossless, typically 40-60 % of the
// TTF size), writing <name>.woff2 next to each input.
//   node scripts/build-fonts.mjs <font>.ttf [...more files]
// The converter (ttf2woff2, pinned) runs through npx, so the site gets no new dependency.
//
// The Chinese display face is subset by scripts/build-cjk-subset.mjs (VIS-07), not here.
//
// The committed Xirod, Migrena and TT Lakes WOFF2 files were made with Google's reference encoder
// (woff2_compress 1.0.2, https://github.com/google/woff2), which writes about 0.4 to 0.9 KB less than ttf2woff2
// for these three faces; both are lossless.
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
