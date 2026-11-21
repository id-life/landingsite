// PERF-03 A1 / SEO-01 A1: the text a route shows without JavaScript (src/components/seo/RouteNoScript.tsx) is text its
// section draws with JavaScript. The headings written in a section's markup are repeated there word for word: each
// must still be in the file the component names, or the noscript copy has drifted from what the section shows.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(import.meta.dirname, '..');
const SRC = readFileSync(join(ROOT, 'src/components/seo/RouteNoScript.tsx'), 'utf8');
const block = SRC.slice(SRC.indexOf('export const SECTION_HEADINGS'), SRC.indexOf('} as const;'));
const entries = [...block.matchAll(/^\s+(\w+): '([^']+)', \/\/ (\S+)$/gm)].map(([, key, text, file]) => ({ key, text, file }));
const unescape = (s) => s.replace(/&amp;/g, '&');

describe('route text without JavaScript', () => {
  test('every heading is listed with the file that draws it', () => {
    expect(entries.length).toBe(7);
  });
  test.each(entries)('$key is drawn by $file, word for word', ({ text, file }) => {
    const source = unescape(readFileSync(join(ROOT, file), 'utf8'));
    expect(source.includes(text)).toBe(true);
  });
  test('every experience route renders it', () => {
    for (const dir of ['(home)', 'portfolio', 'insights', '(experience)/spectrum', 'presence', 'digitaltwin', 'connect']) {
      expect(readFileSync(join(ROOT, 'src/app', dir, 'page.tsx'), 'utf8')).toMatch(/<RouteNoScript route="\w+" \/>/);
    }
  });
});
