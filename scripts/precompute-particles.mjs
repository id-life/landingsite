#!/usr/bin/env node
// Precompute the particle logos' points (PERF-05), so no stencil image is downloaded at run time.
//
// The Portfolio and Spectrum sketches used to download every stencil image (49 files, 1.9 MiB on laptops, 106 requests
// on phones) and sample its pixels in the browser. This script runs the same sampling at build time, with the same
// parameters, read from the site's own configuration (portfolioGetSourceImgInfos, spectrumGetSourceImgInfos, bundled
// with esbuild), and writes:
//   public/particles/<set>.<hash>.bin   packed points, renderer-agnostic (MOT-particles-gpu can read the same files)
//   src/components/gl/particle/particle-points.json   key -> { file, index }; the sketches look their points up here
// Sampling (the sketches' own rules, src/components/gl/particle/*ParticleGL.tsx):
//   - the image is resized to resize x scaleNum (sharp, linear; p5 resized through a canvas);
//   - dynamic sketches keep a pixel with alpha >= 128 at odds loadPercentage x resolution (seeded, so before/after
//     screenshots can be compared); colour = forceColor or the pixel's RGB;
//   - static sketches keep every `spacing`-th pixel on both axes with alpha > 128, spacing = ceil(1 / (loadPercentage x
//     resolution)); colour = the pixel's RGBA.
// Binary layout, little-endian (src/components/gl/particle/particle-points.ts reads it):
//   uint32 imageCount, then per image: uint16 width, uint16 height, uint32 pointCount,
//   then per point: uint16 x, uint16 y, uint8 r, g, b, a  (8 bytes; pixel coordinates in the resized image).
//
// Re-run after changing a particle image or its parameters: node scripts/precompute-particles.mjs
// test/particle-points.test.mjs fails when a configured logo has no precomputed points.
import { createHash } from 'node:crypto';
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';
import sharp from 'sharp';
import { PARTICLE_DEFAULTS, particleKey } from '../src/components/gl/particle/particle-key.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public/particles');
const manifestPath = join(root, 'src/components/gl/particle/particle-points.json');

// 1. Read the configuration from the site's own modules.
const tmp = join(root, '.next/cache/precompute-particles');
mkdirSync(tmp, { recursive: true });
writeFileSync(
  join(tmp, 'entry.ts'),
  `export { portfolioGetSourceImgInfos } from '@/app/portfolio/_components/portfolioData';\nexport { spectrumGetSourceImgInfos } from '@/hooks/spectrum/useSpectrumData';\n`,
);
const bundle = join(tmp, 'configs.mjs');
await esbuild.build({
  entryPoints: [join(tmp, 'entry.ts')],
  bundle: true,
  platform: 'node',
  format: 'esm',
  outfile: bundle,
  jsx: 'automatic',
  alias: { '@': join(root, 'src') },
  packages: 'external',
  loader: { '.png': 'empty', '.css': 'empty', '.glsl': 'text', '.vert': 'text', '.frag': 'text' },
  logLevel: 'error',
  plugins: [
    {
      name: 'svg-components',
      setup(build) {
        build.onResolve({ filter: /\.svg(\?component)?$/ }, (args) => ({ path: args.path, namespace: 'stub' }));
        build.onLoad({ filter: /.*/, namespace: 'stub' }, () => ({ contents: 'export default () => null', loader: 'js' }));
      },
    },
  ],
});
// esbuild resolves bare imports (react, gsap, ...) from the bundle's location: keep it inside the repo.
const configs = await import(`${bundle}?t=${Date.now()}`);

const SETS = [
  { set: 'portfolio-desktop', kind: 'dynamic', mobile: false, list: configs.portfolioGetSourceImgInfos(false) },
  { set: 'portfolio-mobile', kind: 'dynamic', mobile: true, list: configs.portfolioGetSourceImgInfos(true) },
  { set: 'spectrum-desktop', kind: 'static', mobile: false, list: configs.spectrumGetSourceImgInfos(false) },
  { set: 'spectrum-mobile', kind: 'static', mobile: true, list: configs.spectrumGetSourceImgInfos(true) },
];

/** mulberry32: a small seeded generator, one stream per image. */
function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

async function pixels(url, width, height) {
  const input = readFileSync(join(root, 'public', url));
  const { data, info } = await sharp(input, { density: 144 })
    .resize(width, height, { fit: 'fill', kernel: 'linear' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

async function sample(kind, mobile, config, index) {
  const d = PARTICLE_DEFAULTS[kind](mobile);
  const scaleNum = config.scaleNum ?? d.scaleNum;
  const loadPercentage = config.loadPercentage ?? d.loadPercentage;
  const resolution = config.resolution ?? d.resolution;
  const [rw, rh] = config.resize ?? [0, 0];
  if (!rw || !rh) throw new Error(`${config.url}: every particle logo needs resize (the sketches' rule)`);
  const img = await pixels(config.url, Math.round(rw * scaleNum), Math.round(rh * scaleNum));
  const out = [];
  if (kind === 'dynamic') {
    const random = seeded(0x1d11fe + index * 7919);
    const threshold = loadPercentage * resolution;
    for (let y = 0; y < img.height; y += 1) {
      for (let x = 0; x < img.width; x += 1) {
        const i = (y * img.width + x) * 4;
        if (img.data[i + 3] < 128) continue;
        if (random() > threshold) continue;
        const [r, g, b] = config.forceColor ?? [img.data[i], img.data[i + 1], img.data[i + 2]];
        out.push(x, y, r, g, b, 255);
      }
    }
  } else {
    const spacing = Math.ceil(1 / (loadPercentage * resolution));
    for (let y = 0; y < img.height; y += spacing) {
      for (let x = 0; x < img.width; x += spacing) {
        const i = (y * img.width + x) * 4;
        if (img.data[i + 3] > 128) out.push(x, y, img.data[i], img.data[i + 1], img.data[i + 2], img.data[i + 3]);
      }
    }
  }
  return { width: img.width, height: img.height, points: out };
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
const manifest = {};
for (const { set, kind, mobile, list } of SETS) {
  const images = [];
  for (let i = 0; i < list.length; i += 1) images.push(await sample(kind, mobile, list[i], i));
  const size = 4 + images.reduce((n, img) => n + 8 + (img.points.length / 6) * 8, 0);
  const buffer = Buffer.alloc(size);
  let o = buffer.writeUInt32LE(images.length, 0);
  for (const img of images) {
    o = buffer.writeUInt16LE(img.width, o);
    o = buffer.writeUInt16LE(img.height, o);
    o = buffer.writeUInt32LE(img.points.length / 6, o);
    for (let i = 0; i < img.points.length; i += 6) {
      o = buffer.writeUInt16LE(img.points[i], o);
      o = buffer.writeUInt16LE(img.points[i + 1], o);
      for (let k = 2; k < 6; k += 1) o = buffer.writeUInt8(Math.round(img.points[i + k]), o);
    }
  }
  const hash = createHash('sha256').update(buffer).digest('hex').slice(0, 10);
  const file = `/particles/${set}.${hash}.bin`;
  writeFileSync(join(root, 'public', file), buffer);
  list.forEach((config, index) => {
    manifest[particleKey(kind, mobile, config)] = { file, index };
  });
  const counts = images.map((img) => img.points.length / 6);
  console.log(`${file}: ${buffer.length} B, ${images.length} images, points ${counts.join(' ')}`);
}
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`${manifestPath}: ${Object.keys(manifest).length} keys; public/particles: ${readdirSync(outDir).length} files`);
rmSync(tmp, { recursive: true, force: true });
