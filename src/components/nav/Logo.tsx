import { clsx } from 'clsx';
import Link from 'next/link';
import type { MouseEvent } from 'react';
import LogoSVGen from '@/components/svg/LogoSVGen';

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
 * No hooks, so content pages render it (and its wordmark) on the server.
 *
 * One static wordmark. The Chinese lockup (LogoSVGcn) was deleted as unreachable (ENG-16); for the /zh locale and
 * the bilingual lockup system (VIS-11) restore it with `git show 2e2c2cd:src/components/svg/LogoSVGcn.tsx`.
 */
export default function Logo({
  className,
  markClassName,
  onClick,
  ...rest
}: {
  className?: string;
  /** Classes for the wordmark itself (the podcast pages' original header set it by width: 12.5 units, 124 px on phones). */
  markClassName?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
} & { [key: `data-${string}`]: string | undefined }) {
  return (
    <Link
      prefetch={false}
      href="/"
      aria-label="Immortal Dragons home"
      onClick={onClick}
      {...rest}
      // The original's 55 x 10 unit box and wordmark height (in the tablet tiers its 1440 px size, 165 x 30, as the
      // header's text there); a 44 px hit area on touch screens (tap-area).
      className={clsx(
        'relative flex h-10 w-55 items-start tap-area mobile:w-auto mobile:items-center [@media(min-width:600px)_and_(max-width:1199.98px)_and_(min-height:480px)]:h-[30px] [@media(min-width:600px)_and_(max-width:1199.98px)_and_(min-height:480px)]:w-[165px]',
        className,
      )}
    >
      {/* In flow (not absolute), so the link box holds the wordmark on phones too. */}
      <LogoSVGen
        className={clsx(
          markClassName ??
            'h-10 w-auto mobile:h-5 [@media(min-width:600px)_and_(max-width:1199.98px)_and_(min-height:480px)]:h-[30px]',
        )}
      />
    </Link>
  );
}
