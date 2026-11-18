'use client';

import { useWindowSize } from './useWindowSize';
import { layoutUnitPx } from '@/utils/layout-unit';

/**
 * A gap in JS pixels (Swiper's spaceBetween) given as the phone's px at its 16 px unit, drawn in the deck's unit: the same
 * px on every phone up to 599 px wide, and the phone's gap times the deck's factor on an upright tablet. Only for
 * components drawn by the phone deck, whose unit is never below 16 px. Re-read on every window resize.
 */
export function usePhoneDeckGap(px: number): number {
  const { width } = useWindowSize();
  // Before the window is known (the server, the first render), the phone's own px.
  return width ? (px * layoutUnitPx()) / 16 : px;
}
