'use client';

/**
 * next/image loader used when NEXT_PUBLIC_IMAGE_OPTIMIZER=cdn (next.config.mjs, PERF-01): resizing by a service other
 * than Vercel Image Optimization, which is metered. CMS covers (cdn.id.life, resources.id.life) go through
 * NEXT_PUBLIC_COVER_LOADER_TEMPLATE, a URL with {src} (URL-encoded source), {path} (its path, unencoded), {width} and
 * {quality}; for example derivatives the CMS writes at upload, "https://cdn.id.life{path}?w={width}" once id-platform
 * serves them, or a public resizer. Every other image (and every image when no template is set) is served as stored.
 */
const CMS_HOSTS = new Set(['cdn.id.life', 'resources.id.life']);

export function coverUrl(template: string, src: string, width: number, quality?: number): string | null {
  if (!template) return null;
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' || !CMS_HOSTS.has(url.hostname)) return null;
  return template
    .replace('{src}', encodeURIComponent(src))
    .replace('{path}', url.pathname)
    .replace('{width}', String(width))
    .replace('{quality}', String(quality ?? 75));
}

export default function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  return coverUrl(process.env.NEXT_PUBLIC_COVER_LOADER_TEMPLATE ?? '', src, width, quality) ?? src;
}
