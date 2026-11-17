// The phone deck's Spectrum pages follow the desktop deck's bands (the owner's arrangement of 2026-11-17): the
// initiatives, the supporting institutions, then the papers. The plan indexes the groups of the content layer, so the
// test reads the groups it names from there.
import { describe, expect, test } from 'vitest';
import { spectrumPhonePages } from '@/components/spectrum/phonePages';
import { SPECTRUM_GRANTS } from '@/content/grants';
import { SPECTRUM_GROUPS } from '@/content/initiatives';

/** A page as the names a visitor reads on it: group ids, or the run of institutions it shows. */
const named = (page) =>
  page.kind === 'sponsors' ? `logos ${page.from}-${page.to}` : page.items.map((i) => SPECTRUM_GROUPS[i].id).join(' + ');

describe("the phone deck's Spectrum pages", () => {
  test('run in the order of the desktop bands: initiatives, institutions, papers', () => {
    expect(spectrumPhonePages(SPECTRUM_GRANTS.length).map(named)).toEqual([
      'translation-publishing',
      'evangelism + digital-twin',
      'logos 0-10',
      'logos 10-20',
      'papers-reviews',
    ]);
  });

  test('show every group of links once and the institutions on their own pages', () => {
    const groups = spectrumPhonePages(SPECTRUM_GRANTS.length).flatMap((page) => (page.kind === 'groups' ? page.items : []));
    const withLinks = SPECTRUM_GROUPS.map((group, index) => ({ group, index })).filter(
      ({ group }) => group.id !== 'proudly-supporting',
    );
    expect([...groups].sort()).toEqual(withLinks.map(({ index }) => index));
  });

  test.each([0, 1, 9, 10, 11, 20, 23])('show each of %i institutions once, at most ten to a page', (count) => {
    const pages = spectrumPhonePages(count);
    const runs = pages.filter((page) => page.kind === 'sponsors');
    expect(runs.flatMap(({ from, to }) => Array.from({ length: to - from }, (_, i) => from + i))).toEqual(
      Array.from({ length: count }, (_, i) => i),
    );
    expect(runs.every(({ from, to }) => to - from >= 1 && to - from <= 10)).toBe(true);
    // The papers close the section however many pages the logos take.
    expect(named(pages.at(-1))).toBe('papers-reviews');
    expect(pages).toHaveLength(2 + Math.ceil(count / 10) + 1);
  });
});
