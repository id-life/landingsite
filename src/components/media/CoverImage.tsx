'use client';

import Image from 'next/image';
import { cn } from '@/utils';

// Hosts configured in next.config.mjs images.remotePatterns. Covers from any other host fall back
// to a plain lazy <img>, because next/image throws for unconfigured hosts.
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
 * A cover image that fills its (positioned) parent: resized, modern format, lazy by default.
 * CMS covers are stored at camera resolution; served raw they cost up to 11 MB each.
 */
export default function CoverImage({ src, alt, sizes, className, priority = false }: CoverImageProps) {
  const classes = cn('size-full object-cover', className);
  if (!src) return null;
  if (!canOptimize(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={cn('absolute inset-0', classes)}
      />
    );
  }
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={classes} />;
}
