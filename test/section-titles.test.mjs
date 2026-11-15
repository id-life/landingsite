// DATA-05: the document.title set on a section change equals that route's own metadata title, so a section's
// page_view carries the same title whether the visitor landed on it or navigated to it.
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { SECTION_TOPICS, sectionTitle } from '@/constants/section-titles';
import { brandTitle } from '@/lib/seo/metadata';

const LAYOUTS = {
  vision_page: 'src/app/(home)/layout.tsx',
  portfolio_page: 'src/app/portfolio/layout.tsx',
  insights_page: 'src/app/insights/layout.tsx',
  spectrum_page: 'src/app/(experience)/spectrum/layout.tsx',
  engagement_page: 'src/app/presence/layout.tsx',
  twin_page: 'src/app/digitaltwin/layout.tsx',
  connect_page: 'src/app/connect/layout.tsx',
};

describe('section titles', () => {
  test('every section has a topic', () => {
    expect(Object.keys(SECTION_TOPICS).sort()).toEqual(Object.keys(LAYOUTS).sort());
  });
  for (const [id, file] of Object.entries(LAYOUTS)) {
    test(`${id}: the topic is the one ${file} gives buildMetadata`, () => {
      const source = readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
      const title = source.match(/buildMetadata\(\{[\s\S]*?\btitle:\s*'([^']+)'/)?.[1];
      expect(title).toBeTruthy();
      expect(SECTION_TOPICS[id]).toBe(title);
      expect(sectionTitle({ id })).toBe(brandTitle(title));
    });
  }
});
