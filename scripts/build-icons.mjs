// The home-screen icons (question 9: "from your existing logo", ENG-17): the owner's symbol, public/svgs/logo.svg,
// unchanged, centred on the site's background (#f0f0f0, tone-100) and opaque (iOS fills transparency with black), at
// the proportion of public/apple-icon.png (the symbol 132 px wide on 180). Nothing drawn, no wording.
//   node scripts/build-icons.mjs            writes public/icons/icon-192.png and icon-512.png
//   node scripts/build-icons.mjs --check 180   renders 180 px to stdout's report only, to compare with apple-icon.png
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const SVG = readFileSync(new URL('../public/svgs/logo.svg', import.meta.url));
const BACKGROUND = { r: 240, g: 240, b: 240 };
const SYMBOL_SHARE = 132 / 180;

export async function icon(size) {
  const symbol = await sharp(SVG, { density: 72 * Math.ceil((size * SYMBOL_SHARE) / 106) * 2 })
    .resize({ width: Math.round(size * SYMBOL_SHARE) })
    .png()
    .toBuffer();
  const { width, height } = await sharp(symbol).metadata();
  const composed = await sharp({ create: { width: size, height: size, channels: 3, background: BACKGROUND } })
    .composite([{ input: symbol, left: Math.round((size - width) / 2), top: Math.round((size - height) / 2) }])
    .png()
    .toBuffer();
  // Opaque: the composite keeps an alpha channel, all of it 255; drop it.
  return sharp(composed).removeAlpha().png({ compressionLevel: 9 }).toBuffer();
}

const check = process.argv.indexOf('--check');
if (check > 0) {
  const size = Number(process.argv[check + 1]);
  const mine = await sharp(await icon(size))
    .removeAlpha()
    .raw()
    .toBuffer();
  const theirs = await sharp(new URL('../public/apple-icon.png', import.meta.url).pathname)
    .removeAlpha()
    .raw()
    .toBuffer();
  let diff = 0;
  let max = 0;
  for (let i = 0; i < mine.length; i += 1) {
    const d = Math.abs(mine[i] - theirs[i]);
    if (d > 8) diff += 1;
    max = Math.max(max, d);
  }
  console.log(`${size}px against apple-icon.png: ${diff} channel values differ by more than 8 of ${mine.length}; max ${max}`);
} else {
  const dir = new URL('../public/icons/', import.meta.url);
  mkdirSync(dir, { recursive: true });
  for (const size of [192, 512]) writeFileSync(new URL(`icon-${size}.png`, dir), await icon(size));
  console.log('public/icons/icon-192.png, public/icons/icon-512.png');
}
