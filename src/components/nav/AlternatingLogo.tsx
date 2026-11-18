'use client';

import { clsx } from 'clsx';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useReducedMotionPref } from '@/motion/preference';

/** The original's period and cross-fade (the owner's answer 1A: as on his site). */
const SWAP_MS = 8000;

/**
 * The header logo that alternates between the Chinese lockup and the English wordmark, as on the original (the owner's
 * answer 1A, reversing CON-12): the Chinese lockup first, then a swap every 8 s with a 0.5 s cross-fade, and a press
 * swaps at once and starts the 8 s again. With the reduced-motion preference nothing swaps by itself; a press still
 * does.
 *
 * `toggle` (the experience): the logo is a button and a press only swaps, as on the original, where it does not move
 * to the first screen. Otherwise (/news) it stays the same-tab link to / (NAV-04) and alternates by itself.
 *
 * Both marks share one grid cell, so the box always holds the wider of the two and nothing beside it moves when they
 * swap: on the laptop deck the original's 55 x 10 unit box, the wordmark 10 units high and the lockup 8; on the phone
 * deck both 5 units high (the lockup is the wider, 6.6 x 5 units against 4.8 x 5). Where the row is too narrow for
 * the lockup beside SUBSCRIBE and the menu (phones under about 335 px; the original lets them touch there), the box
 * gives way and the mark is drawn smaller inside it rather than over SUBSCRIBE.
 */
export default function AlternatingLogo({
  en,
  cn,
  toggle = false,
  className,
  ...rest
}: {
  /** The two marks, from alternatingMarks() (built by the caller, on the server for the content pages). */
  en: ReactNode;
  cn: ReactNode;
  toggle?: boolean;
  className?: string;
} & { [key: `data-${string}`]: string | undefined }) {
  const [mark, setMark] = useState<'cn' | 'en'>('cn');
  const reduced = useReducedMotionPref();
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const swap = useCallback(() => setMark((m) => (m === 'cn' ? 'en' : 'cn')), []);
  const restart = useCallback(() => {
    clearInterval(timer.current);
    timer.current = reduced ? undefined : setInterval(swap, SWAP_MS);
  }, [reduced, swap]);

  useEffect(() => {
    restart();
    return () => clearInterval(timer.current);
  }, [restart]);

  const onPress = () => {
    swap();
    restart();
  };

  const marks = (
    <>
      {en}
      {cn}
    </>
  );
  const box = clsx(
    'group relative grid h-10 w-55 min-w-0 cursor-pointer grid-cols-[minmax(0,1fr)] items-center justify-items-start tap-area mobile:w-auto',
    className,
  );

  return toggle ? (
    // The name is the two names the original's title gives the site; the marks themselves are pictures.
    <button type="button" aria-label="Immortal Dragons 不朽真龙" onClick={onPress} className={box} data-mark={mark} {...rest}>
      {marks}
    </button>
  ) : (
    <Link prefetch={false} href="/" aria-label="Immortal Dragons home" className={box} data-mark={mark} {...rest}>
      {marks}
    </Link>
  );
}
