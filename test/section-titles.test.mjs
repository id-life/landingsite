// DATA-05: the document.title set on a section change equals that route's own metadata title, so a section's
// page_view carries the same title whether the visitor landed on it or navigated to it. The route titles come from
// the content layer (src/content/pages.ts, fed to buildMetadata by each layout); the client keeps its own short
// list of topics (the content layer is not shipped to the browser), and this test keeps the two equal.
import { describe, expect, test } from 'vitest';
import { NAV_LIST } from '@/components/nav/nav';
import { SECTION_TOPICS, sectionTitle } from '@/constants/section-titles';
import { PAGES } from '@/content/pages';
import { brandTitle } from '@/lib/seo/metadata';

describe('section titles', () => {
  test('every section has a topic', () => {
    expect(Object.keys(SECTION_TOPICS).sort()).toEqual(NAV_LIST.map((item) => item.id).sort());
  });
  for (const item of NAV_LIST) {
    test(`${item.id}: the topic is the one src/content/pages.ts gives ${item.href}`, () => {
      const page = PAGES.find((p) => p.path === item.href);
      expect(page, `a PAGES entry for ${item.href}`).toBeTruthy();
      expect(SECTION_TOPICS[item.id]).toBe(page.title);
      expect(sectionTitle(item)).toBe(brandTitle(page.title));
    });
  }
});
