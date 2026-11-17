/**
 * The stops of a far jump on the desktop deck (MOT-01): every section rest strictly between where the view is and
 * where it goes, in the order of travel, then the destination.
 *
 * Why the jump is not one step: several sections' scrubbed timelines write the same properties (the theme
 * variables on <html>, `.base-background2`, `#vision-canvas`), and each one, taken back to its start, writes the
 * look of the section before it. Going up, they must be taken back in reverse page order, so that the one nearest
 * the destination writes last; ScrollTrigger does that when it sees the scroll going up. But ScrollSmoother's
 * scrollTop() runs that update before it moves the native scroll, which is where ScrollTrigger reads the direction
 * from: the update was taken as going down and rendered the timelines in page order, so one jump up across several
 * sections left the look of the section nearest the origin (from Connect: Mission on black, Insights on black).
 * Stopping at each rest on the way (with the native scroll moved first, see jumpTo) crosses one neighbour
 * range at a time, where no two timelines share a target, exactly as a scroll does.
 */
export function sweepStops(from: number, to: number, rests: readonly number[], tolerance = 1): number[] {
  const dir = Math.sign(to - from);
  if (dir === 0) return [to];
  const between = rests.filter((r) => Number.isFinite(r) && (r - from) * dir > tolerance && (to - r) * dir > tolerance);
  const unique = [...new Set(between)].sort((a, b) => (a - b) * dir);
  return [...unique, to];
}
