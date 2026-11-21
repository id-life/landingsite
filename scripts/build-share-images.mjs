// The link-preview pictures of the two podcast shows, for an episode without a picture of its own (SEO-07; the lead's
// ruling of 2026-11-21 under question 9, "A"): each show's own square cover as his site declares it, scaled to 630 px
// tall (Lanczos) and extended left and right by its own edge columns to 1200x630, as public/og-cover.jpg was made from
// his cover. Nothing drawn, nothing cropped, no wording.
//   node scripts/build-share-images.mjs     writes public/og/podcast-id.jpg and podcast-lt.jpg
import { mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';

const SHOWS = {
  id: 'https://resources.id.life/audio/idfm_logo@small.webp',
  lt: 'https://resources.id.life/audio/longtalk_logo@small.webp',
};
const WIDTH = 1200;
const HEIGHT = 630;

const dir = new URL('../public/og/', import.meta.url);
mkdirSync(dir, { recursive: true });
for (const [show, url] of Object.entries(SHOWS)) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  const cover = await sharp(Buffer.from(await res.arrayBuffer()))
    .removeAlpha()
    .resize({ height: HEIGHT, kernel: 'lanczos3' })
    .toBuffer();
  const { width } = await sharp(cover).metadata();
  const left = Math.floor((WIDTH - width) / 2);
  const image = await sharp(cover)
    .extend({ left, right: WIDTH - width - left, extendWith: 'copy' })
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer();
  writeFileSync(new URL(`podcast-${show}.jpg`, dir), image);
  console.log(`public/og/podcast-${show}.jpg from ${url} (${width}x${HEIGHT} extended to ${WIDTH}x${HEIGHT})`);
}
