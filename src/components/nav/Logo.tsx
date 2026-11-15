'use client';

import Link from 'next/link';
import type { MouseEvent } from 'react';
import LogoSVGen from '@/components/svg/LogoSVGen';
import { cn } from '@/utils';

/** Still read by the hero's CenterLogo (src/components/gl, owned by the 3D group). */
export enum LogoType {
  EN = 'EN',
  CN = 'CN',
}

/**
 * The header logo (NAV-04): on every route a same-tab link to /. It used to be five different things (an artwork
 * toggle on the experience, router.replace on /news, a hard reload on /podcast, a new tab on the Spectrum tools).
 * On the experience the header passes onClick, which moves to Mission through the section controller instead of
 * letting Next re-render the route; modifier-clicks stay the browser's (new tab), so the href is always real.
 *
 * One static wordmark. The Chinese lockup (LogoSVGcn) was deleted as unreachable (ENG-16); for the /zh locale and
 * the bilingual lockup system (VIS-11) restore it with `git show 2e2c2cd:src/components/svg/LogoSVGcn.tsx`.
 */
export default function Logo({
  className,
  onClick,
}: {
  className?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <Link
      href="/"
      aria-label="Immortal Dragons home"
      onClick={onClick}
      className={cn('relative flex h-10 w-55 items-start mobile:w-auto mobile:items-center', className)}
    >
      {/* In flow (not absolute), so the link box holds the wordmark on phones too. */}
      <LogoSVGen className="h-full w-auto mobile:h-5" />
    </Link>
  );
}
