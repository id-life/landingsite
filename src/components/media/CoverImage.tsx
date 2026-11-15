'use client';

import Image from 'next/image';
// clsx, not cn: no caller passes a conflicting class, and tailwind-merge would cost every news page 6.7 kB (PERF-10).
import { clsx } from 'clsx';

// Hosts configured in next.config.mjs images.remotePatterns. Covers from any other host are served
// unoptimized, because the next/image loader throws for unconfigured hosts.
const OPTIMIZED_HOSTS = new Set(['cdn.id.life', 'resources.id.life', 'img.youtube.com', 'i.ytimg.com']);

function canOptimize(src: string) {
  if (src.startsWith('/') && !src.startsWith('//')) return !src.endsWith('.svg');
  try {
    return OPTIMIZED_HOSTS.has(new URL(src).hostname);
  } catch {
    return false;
  }
}

type CoverImageProps = {
  src: string;
  alt: string;
  /** Rendered width hint for the browser, e.g. "(max-width: 768px) 45vw, 22vw". */
  sizes: string;
  className?: string;
  /** Only for the one image that is the largest element of its page on first paint. */
  priority?: boolean;
};

/**
 * A cover image that fills its (positioned) parent: lazy by default, with sizes for the browser. Who resizes it is
 * NEXT_PUBLIC_IMAGE_OPTIMIZER (next.config.mjs, PERF-01): the Next optimizer on self-hosted builds, nothing on Vercel
 * until the owner approves Vercel Image Optimization or a CMS derivative URL (the cdn loader, src/lib/image-loader.ts).
 * CMS covers are stored at full upload resolution; served raw they cost up to 11 MB each.
 */
export default function CoverImage({ src, alt, sizes, className, priority = false }: CoverImageProps) {
  const classes = clsx('size-full object-cover', className);
  if (!src) return null;
  // Unconfigured hosts are served as-is (`unoptimized` skips the loader and its host check) but still
  // get next/image's lazy loading, async decoding and fill layout.
  return (
    <Image src={src} alt={alt} fill sizes={sizes} priority={priority} unoptimized={!canOptimize(src)} className={classes} />
  );
}
