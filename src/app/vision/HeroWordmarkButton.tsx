'use client';

import { clsx } from 'clsx';
import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { globalLoadedAtom } from '@/atoms/geo';
import { NAV, NAV_LIST } from '@/components/nav/nav';
import {
  getHeroWordmarkLang,
  HERO_WORDMARK_TOGGLE,
  measureHeroWordmark,
  subscribeHeroWordmarkLang,
} from '@/components/gl/model/vision/heroWordmarkControl';
import { useExperienceMode } from '@/hooks/useExperienceMode';
import { sectionStateAtom } from '@/motion/sectionController';

/**
 * The accessible name is the lockup the canvas draws, wordmark and tagline, letter for letter as drawn (the tagline
 * assets are set in capitals): it differs from the header logo's name, and it changes with each swap, so a
 * screen-reader user hears what the press did.
 */
const NAME = {
  en: 'Immortal Dragons, A PURPOSE-DRIVEN LONGEVITY FUND',
  cn: '不朽真龙, 长寿使命驱动基金',
} as const;

const VISION_INDEX = NAV_LIST.findIndex((item) => item.id === NAV.vision_page.id);

/**
 * The keyboard's way to the hero wordmark's language swap, which the original site offers to the pointer only (a
 * click on the canvas). A button with no visible box of its own: transparent, no pointer events (a click or a tap goes
 * through to the canvas, as before, and never focuses it), so nothing is drawn at rest. Its accessible name is the
 * lockup drawn (NAME). `fixed` on the phone deck, whose panel is a zero-height box that clips its children, stacked
 * just above that deck's fixed canvas (z-index 1) so the ring is drawn over the wordmark; absolute inside the desktop
 * deck's scrolled first section. On keyboard focus it takes the drawn wordmark's box, so the site's focus ring
 * (:focus-visible) goes around the wordmark, and follows it while focused. Enter and Space swap through the wordmark's
 * own click handler (same 800 ms rule). A Tab stop only while the first screen is the section in view, so reaching it
 * never moves the deck; only with the 3D experience (without WebGL the poster has no swap).
 */
export default function HeroWordmarkButton({ fixed = false }: { fixed?: boolean }) {
  const loaded = useAtomValue(globalLoadedAtom);
  const full = useExperienceMode() === 'full';
  const { index } = useAtomValue(sectionStateAtom);
  const ref = useRef<HTMLButtonElement>(null);
  const [focused, setFocused] = useState(false);
  const lang = useSyncExternalStore(subscribeHeroWordmarkLang, getHeroWordmarkLang, () => 'en' as const);

  const place = useCallback(() => {
    const button = ref.current;
    const box = measureHeroWordmark();
    if (!button || !box) return;
    const parent = fixed ? { left: 0, top: 0 } : (button.offsetParent ?? document.body).getBoundingClientRect();
    button.style.left = `${box.left - parent.left}px`;
    button.style.top = `${box.top - parent.top}px`;
    button.style.width = `${box.width}px`;
    button.style.height = `${box.height}px`;
  }, [fixed]);

  useEffect(() => {
    if (!focused) return;
    let frame = 0;
    const follow = () => {
      place();
      frame = requestAnimationFrame(follow);
    };
    follow();
    return () => cancelAnimationFrame(frame);
  }, [focused, place]);

  if (!loaded || !full) return null;
  return (
    <button
      ref={ref}
      type="button"
      aria-label={NAME[lang]}
      tabIndex={index === VISION_INDEX ? 0 : -1}
      onFocus={() => {
        place();
        setFocused(true);
      }}
      onBlur={() => setFocused(false)}
      onClick={() => window.dispatchEvent(new Event(HERO_WORDMARK_TOGGLE))}
      className={clsx(
        'pointer-events-none left-0 top-0 z-[2] size-0 border-0 bg-transparent p-0',
        fixed ? 'fixed' : 'absolute',
      )}
    />
  );
}
