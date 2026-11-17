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
  /** Px taken out of each gap between the rows of papers instead of scaling (0 when none is taken). */
  gapCut: number;
};

/**
 * The gaps between the rows of opened papers: spare air given up before any scaling (the lead's decision of
 * 2026-11-18). Up to half of each gap may go; beyond that the composition scales as before, with its gaps whole.
 */
export type PaperGaps = { count: number; gap: number };

/**
 * @param room   height of the band the composition may use, in CSS px (from the header's bottom to the top of the
 *               bottom controls, inside the column's own padding)
 * @param needed height the composition needs with every group open, in CSS px at scale 1, with its paper gaps whole
 * @param gaps   the gaps between the rows of opened papers (how many, and each one's full height)
 */
export function fitScale(room: number, needed: number, gaps: PaperGaps = { count: 0, gap: 0 }): FitScale {
  // Under a pixel short is layout rounding, not a shortfall: zooming to 99.9 % for it gave up the owner's exact picture
  // in two common windows (1512x857, 1470x840) for nothing anyone could see.
  if (!(room > 0) || !(needed > 0) || needed - room < FIT_SCALE_TOLERANCE_PX) return { scale: 1, scrolls: false, gapCut: 0 };
  // Short by no more than half the gaps between the rows of papers: take it out of those gaps, keep the scale at 1.
  const shortfall = needed - room;
  if (gaps.count > 0 && shortfall <= (gaps.count * gaps.gap) / 2)
    return { scale: 1, scrolls: false, gapCut: shortfall / gaps.count };
  const raw = room / needed;
  if (raw >= FIT_SCALE_FLOOR) return { scale: Math.floor(raw * 1000) / 1000, scrolls: false, gapCut: 0 };
  return { scale: FIT_SCALE_FLOOR, scrolls: true, gapCut: 0 };
}
