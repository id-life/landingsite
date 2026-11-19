/**
 * The phone deck's Spectrum pages, in the order of the desktop deck's bands (the owner's arrangement of 2026-11-17):
 * the initiatives, the supporting institutions, then the papers. A group of links is never split across pages and the
 * two shorter initiatives share one; the institutions' logos take as many pages as they need.
 */
export type SpectrumPhonePage =
  /** Groups of links, as indices into the main items: the three initiatives, then the papers. */
  | { kind: 'groups'; items: number[] }
  /** A run of the supporting institutions: from this one up to, and not including, that one. */
  | { kind: 'sponsors'; from: number; to: number };

const INITIATIVE_PAGES = [[0], [1, 2]];
/** The papers' group, as an index into the main items. */
export const PAPERS_GROUP = 3;
const PAPERS_PAGE = [PAPERS_GROUP];
const SPONSORS_PER_PAGE = 10;

export function spectrumPhonePages(sponsorCount: number): SpectrumPhonePage[] {
  const sponsorPages: SpectrumPhonePage[] = [];
  for (let from = 0; from < sponsorCount; from += SPONSORS_PER_PAGE) {
    sponsorPages.push({ kind: 'sponsors', from, to: Math.min(from + SPONSORS_PER_PAGE, sponsorCount) });
  }
  return [
    ...INITIATIVE_PAGES.map((items): SpectrumPhonePage => ({ kind: 'groups', items })),
    ...sponsorPages,
    { kind: 'groups', items: PAPERS_PAGE },
  ];
}

/** The phone pager's place: the page shown, the way a step travels, and the generation of its page transition. */
export type PagerState = { index: number; direction: 1 | -1; epoch: number };

export const PAGER_START: PagerState = { index: 0, direction: 1, epoch: 0 };

/**
 * A move of the phone pager to page `to`. A step the visitor sees is animated (direction from the pages). A move
 * before the pager has drawn its first frame (the page kept in the history entry, taken as it mounts, as when a turned
 * tablet mounts the phone deck again) is a jump: a new transition generation, so the page is drawn at once instead of
 * animating out of a page that was never shown (an exit started in the mount's own task never completes, and the new
 * page would never be drawn).
 */
export function movePager(state: PagerState, to: number, animate: boolean): PagerState {
  if (to === state.index) return state;
  if (!animate) return { index: to, direction: state.direction, epoch: state.epoch + 1 };
  return { index: to, direction: to > state.index ? 1 : -1, epoch: state.epoch };
}
