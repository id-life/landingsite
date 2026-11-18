import { ALPHA_CLIPS_BASE } from '@/constants/media';

/**
 * The transparent clips the site plays (all VP9 with an alpha channel at their original addresses), by their path
 * under resources.id.life. With ALPHA_CLIPS_BASE set, each must exist at `<base>/<path>.vp9a.webm` and
 * `<base>/<path>.hevca.mp4`; test/alpha-clips.test.mjs checks that every clip address in the source is listed here.
 */
export const ALPHA_CLIP_PATHS = [
  'twin/M0-1',
  'twin/M1-1',
  'twin/M2-1',
  'twin/M3-1',
  'engagement/book-01',
  'engagement/book-03',
  'engagement/sponsor/sponsor-03',
  'engagement/sponsor/sponsor-05',
  'engagement/sponsor/sponsor-05-2',
  'engagement/sponsor/sponsor-08',
  'engagement/sponsor/sponsor-09',
  'engagement/sponsor/sponsor-aging-brain',
  'engagement/sponsor/sponsor-brain-resilience-1',
  'engagement/sponsor/sponsor-brain-resilience-2',
  'engagement/sponsor/sponsor-heart-aging',
] as const;

/** How this browser plays the clips: VP9 with alpha, HEVC with alpha, or not at all (the still image stands in). */
export type AlphaClipFormat = 'vp9a' | 'hevca' | null;

const ORIGIN = 'https://resources.id.life/';

/** The address to play `original` from in `format` (the original address while ALPHA_CLIPS_BASE is unset). */
export function alphaClipUrl(original: string, format: AlphaClipFormat, base: string | null = ALPHA_CLIPS_BASE): string {
  if (!base || !format || !original.startsWith(ORIGIN) || !original.endsWith('.webm')) return original;
  const path = original.slice(ORIGIN.length, -'.webm'.length);
  if (!(ALPHA_CLIP_PATHS as readonly string[]).includes(path)) return original;
  return `${base.replace(/\/$/, '')}/${path}.${format === 'vp9a' ? 'vp9a.webm' : 'hevca.mp4'}`;
}

/**
 * Whether this browser draws the transparent pixels of a tiny clip as transparent. A clip whose left half is
 * transparent and right half opaque red is decoded and drawn into a canvas; the left pixel must come out transparent
 * and the right one opaque. This is the capability itself: a browser that plays the codec but drops its alpha layer
 * (HEVC in Chrome, VP9 in some Safari versions) draws an opaque left half and fails.
 */
function drawsAlpha(src: string, type: string, timeoutMs = 3000): Promise<boolean> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    if (!video.canPlayType(type)) {
      resolve(false);
      return;
    }
    let done = false;
    const finish = (ok: boolean) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      video.removeAttribute('src');
      video.load();
      resolve(ok);
    };
    const timer = setTimeout(() => finish(false), timeoutMs);
    const check = () => {
      try {
        const w = video.videoWidth;
        const h = video.videoHeight;
        if (!w || !h) return;
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return finish(false);
        ctx.drawImage(video, 0, 0, w, h);
        const y = Math.floor(h / 2);
        const left = ctx.getImageData(Math.floor(w / 8), y, 1, 1).data[3];
        const right = ctx.getImageData(Math.floor((w * 7) / 8), y, 1, 1).data[3];
        finish(left < 64 && right > 192);
      } catch {
        finish(false);
      }
    };
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.addEventListener('loadeddata', check);
    video.addEventListener('playing', check);
    video.addEventListener('error', () => finish(false));
    video.src = src;
    // iOS loads no media data before play(); a muted inline clip may play without a gesture.
    video.play().catch(() => {});
  });
}

let detected: Promise<AlphaClipFormat> | null = null;

/** Detects (once per page) which re-encoded format this browser draws with its transparency. */
export function detectAlphaClipFormat(): Promise<AlphaClipFormat> {
  detected ??= (async () => {
    if (await drawsAlpha('/media/alpha-probe.webm', 'video/webm; codecs="vp9"')) return 'vp9a';
    if (await drawsAlpha('/media/alpha-probe.mp4', 'video/mp4; codecs="hvc1"')) return 'hevca';
    return null;
  })();
  return detected;
}
