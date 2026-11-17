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
const PAPERS_PAGE = [3];
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
