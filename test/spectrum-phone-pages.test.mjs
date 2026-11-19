// The phone deck's Spectrum pages follow the desktop deck's bands (the owner's arrangement of 2026-11-17): the
// initiatives, the supporting institutions, then the papers. The plan indexes the groups of the content layer, so the
// test reads the groups it names from there.
import { describe, expect, test } from 'vitest';
import { movePager, PAGER_START, spectrumPhonePages } from '@/components/spectrum/phonePages';
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

// The pager's moves: a step the visitor sees is animated; a move before the pager's first frame (the kept page taken as
// the phone deck mounts again, after a tablet is turned on its side and back) is a jump, a new transition generation,
// so the kept page is drawn at once instead of waiting forever on the exit of a page that was never shown.
describe('movePager', () => {
  test('a step after the first frame animates, its direction from the pages, in the same generation', () => {
    expect(movePager(PAGER_START, 2, true)).toEqual({ index: 2, direction: 1, epoch: 0 });
    expect(movePager({ index: 4, direction: 1, epoch: 3 }, 1, true)).toEqual({ index: 1, direction: -1, epoch: 3 });
  });

  test('a move before the first frame is a jump: a new generation, the direction unchanged', () => {
    expect(movePager(PAGER_START, 4, false)).toEqual({ index: 4, direction: 1, epoch: 1 });
    expect(movePager({ index: 2, direction: -1, epoch: 1 }, 0, false)).toEqual({ index: 0, direction: -1, epoch: 2 });
  });

  test('a move to the page already shown changes nothing, so it starts no transition', () => {
    const state = { index: 3, direction: -1, epoch: 2 };
    expect(movePager(state, 3, true)).toBe(state);
    expect(movePager(state, 3, false)).toBe(state);
  });
});
