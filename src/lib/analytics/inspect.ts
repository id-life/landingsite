import { track } from './track';

/** How long the mouse must rest on an item before it counts as inspected (DATA-11). */
export const DWELL_MS = 600;
let dwellTimer: number | undefined;

/**
 * Start counting a mouse dwell on an item: after 600 ms, one item_inspect per item per page. Touch and pen never
 * count (a tap is not a hover), and a mouse that just passes over the grid sends nothing.
 */
export function inspectOnDwell(event: { pointerType?: string }, itemId: string, sectionId: string) {
  window.clearTimeout(dwellTimer);
  if (event.pointerType !== 'mouse') return;
  dwellTimer = window.setTimeout(() => {
    track('item_inspect', { item_id: itemId, section_id: sectionId }, { once: `inspect:${sectionId}:${itemId}` });
  }, DWELL_MS);
}

export function cancelInspect() {
  window.clearTimeout(dwellTimer);
}
