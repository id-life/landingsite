// DATA-05: the document.title set on a section change equals that route's own metadata title, so a section's
// page_view carries the same title whether the visitor landed on it or navigated to it. The route titles come from
// the content layer (src/content/pages.ts, fed to buildMetadata by each layout); the client keeps its own short
// list of topics (the content layer is not shipped to the browser), and this test keeps the two equal.
import { describe, expect, test } from 'vitest';
import { NAV_LIST } from '@/components/nav/nav';
import { SECTION_TITLES, sectionTitle } from '@/constants/section-titles';
import { PAGES } from '@/content/pages';

describe('section titles', () => {
  test('every section has a tab title', () => {
    expect(Object.keys(SECTION_TITLES).sort()).toEqual(NAV_LIST.map((item) => item.id).sort());
  });
  for (const item of NAV_LIST) {
    test(`${item.id}: the tab title is the one src/content/pages.ts gives ${item.href}`, () => {
      const page = PAGES.find((p) => p.path === item.href);
      expect(page, `a PAGES entry for ${item.href}`).toBeTruthy();
      expect(SECTION_TITLES[item.id]).toBe(page.tabTitle);
      expect(sectionTitle(item)).toBe(page.tabTitle);
    });
  }
});
