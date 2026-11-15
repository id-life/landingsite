import manifest from './particle-points.json';
import { particleKey } from './particle-key.mjs';

/**
 * Precomputed particle logos (PERF-05): the points scripts/precompute-particles.mjs sampled from each stencil image at
 * build time, so the sketches download a few packed files instead of every stencil (49 images, 1.9 MiB on laptops).
 * A logo whose parameters changed since the last precompute has no entry: the sketch then samples the image itself,
 * as before (and test/particle-points.test.mjs fails until the script is re-run).
 */
export type ParticlePoints = {
  /** Size of the resized stencil the points were sampled from. */
  width: number;
  height: number;
  count: number;
  /** Per point: x, y (pixels in the resized stencil). */
  xy: Uint16Array;
  /** Per point: r, g, b, a (0-255). */
  rgba: Uint8Array;
};

export type ParticleSource = {
  url: string;
  resize?: number[];
  scaleNum?: number;
  loadPercentage?: number;
  resolution?: number;
  forceColor?: number[];
};

const files = new Map<string, Promise<ParticlePoints[]>>();

function parse(buffer: ArrayBuffer): ParticlePoints[] {
  const view = new DataView(buffer);
  const images: ParticlePoints[] = [];
  let o = 4;
  for (let n = view.getUint32(0, true); n > 0; n -= 1) {
    const width = view.getUint16(o, true);
    const height = view.getUint16(o + 2, true);
    const count = view.getUint32(o + 4, true);
    o += 8;
    const xy = new Uint16Array(count * 2);
    const rgba = new Uint8Array(count * 4);
    for (let i = 0; i < count; i += 1, o += 8) {
      xy[i * 2] = view.getUint16(o, true);
      xy[i * 2 + 1] = view.getUint16(o + 2, true);
      rgba.set(new Uint8Array(buffer, o + 4, 4), i * 4);
    }
    images.push({ width, height, count, xy, rgba });
  }
  return images;
}

function loadFile(file: string) {
  let pending = files.get(file);
  if (!pending) {
    pending = fetch(file).then((res) => {
      if (!res.ok) throw new Error(`${file}: HTTP ${res.status}`);
      return res.arrayBuffer().then(parse);
    });
    // A failed download may be retried by the next sketch.
    pending.catch(() => files.delete(file));
    files.set(file, pending);
  }
  return pending;
}

/** The precomputed points of each source, in order; null where there are none (the sketch samples the image). */
export async function loadParticlePoints(kind: 'dynamic' | 'static', mobile: boolean, sources: ParticleSource[]) {
  const entries = sources.map(
    (source) => (manifest as Record<string, { file: string; index: number }>)[particleKey(kind, mobile, source)],
  );
  return Promise.all(
    entries.map((entry) =>
      entry
        ? loadFile(entry.file).then(
            (images) => images[entry.index] ?? null,
            () => null,
          )
        : null,
    ),
  );
}

/** Sample a loaded stencil's pixels in the browser: the fallback for a logo with no precomputed points. */
export function samplePixels(
  pixels: ArrayLike<number>,
  width: number,
  height: number,
  keep: (x: number, y: number, alpha: number) => boolean,
  step = 1,
): ParticlePoints {
  const xy: number[] = [];
  const rgba: number[] = [];
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const i = (y * width + x) * 4;
      if (!keep(x, y, pixels[i + 3])) continue;
      xy.push(x, y);
      rgba.push(pixels[i], pixels[i + 1], pixels[i + 2], pixels[i + 3]);
    }
  }
  return { width, height, count: xy.length / 2, xy: Uint16Array.from(xy), rgba: Uint8Array.from(rgba) };
}
