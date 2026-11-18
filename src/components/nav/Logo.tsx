import { clsx } from 'clsx';
import Link from 'next/link';
import type { MouseEvent } from 'react';
import LogoSVGcn from '@/components/svg/LogoSVGcn';
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
 * One still mark: the English wordmark (the podcast pages) or the Chinese lockup (the Spectrum tool pages), as the
 * original draws them there. The experience and /news alternate the two (AlternatingLogo).
 */
export default function Logo({
  className,
  markClassName,
  mark = 'en',
  onClick,
  ...rest
}: {
  mark?: 'en' | 'cn';
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
      // The original's 55 x 10 unit box and wordmark height, scaled with the deck (two versions only, RWD-02); a 44 px
      // hit area on touch screens (tap-area).
      className={clsx('relative flex h-10 w-55 items-start tap-area mobile:w-auto mobile:items-center', className)}
    >
      {/* In flow (not absolute), so the link box holds the wordmark on phones too. */}
      {mark === 'cn' ? (
        // The original's lockup box: 8 units high in the 10-unit row, centred; 5 units on phones.
        <LogoSVGcn className={clsx(markClassName ?? 'h-8 w-auto self-center mobile:h-5')} />
      ) : (
        <LogoSVGen className={clsx(markClassName ?? 'h-10 w-auto mobile:h-5')} />
      )}
    </Link>
  );
}
