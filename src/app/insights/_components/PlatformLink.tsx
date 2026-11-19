'use client';

import { FITTED_TAP_AREA, useFittedTapArea } from '@/hooks/useFittedTapArea';
import type { ReactNode } from 'react';

/**
 * A platform logo beside a row's heading (podcast, weekly): opens the platform in a new tab. On a touch screen its hit
 * area grows towards 44 px (tap-area, RWD-06), only into space that is nobody's, so a logo never takes a tap meant for
 * the logo beside it or the card below; the box keeps the original's size.
 */
export default function PlatformLink({ href, label, children }: { href: string; label?: string; children: ReactNode }) {
  const ref = useFittedTapArea<HTMLAnchorElement>();
  return (
    <a
      ref={ref}
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative flex items-center justify-center opacity-100 transition-opacity tap-area hover:opacity-80 ${FITTED_TAP_AREA}`}
    >
      {children}
    </a>
  );
}
