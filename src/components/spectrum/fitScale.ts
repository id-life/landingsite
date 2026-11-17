/**
 * The desktop deck's Spectrum composition always fits between the site header and the fixed bottom controls, with its
 * papers open or closed (the owner's arrangement of 2026-11-17 adds an in-page "more"). The scale is taken against
 * the OPEN height and applied at rest too, so opening the papers never rescales anything; it is exactly 1 wherever
 * the open composition fits. Below FIT_SCALE_FLOOR the composition keeps the floor and scrolls inside the band.
 */
export const FIT_SCALE_FLOOR = 0.8;
/** A shortfall smaller than this many CSS px is rounding, and the composition stays at scale 1. */
export const FIT_SCALE_TOLERANCE_PX = 1;

export type FitScale = {
  /** The zoom to apply (1 when the open composition fits). */
  scale: number;
  /** True when even the floor does not fit: the composition scrolls inside its band. */
  scrolls: boolean;
};

/**
 * @param room   height of the band the composition may use, in CSS px (from the header's bottom to the top of the
 *               bottom controls, inside the column's own padding)
 * @param needed height the composition needs with every group open, in CSS px at scale 1
 */
export function fitScale(room: number, needed: number): FitScale {
  // Under a pixel short is layout rounding, not a shortfall: zooming to 99.9 % for it gave up the owner's exact picture
  // in two common windows (1512x857, 1470x840) for nothing anyone could see.
  if (!(room > 0) || !(needed > 0) || needed - room < FIT_SCALE_TOLERANCE_PX) return { scale: 1, scrolls: false };
  const raw = room / needed;
  if (raw >= FIT_SCALE_FLOOR) return { scale: Math.floor(raw * 1000) / 1000, scrolls: false };
  return { scale: FIT_SCALE_FLOOR, scrolls: true };
}
