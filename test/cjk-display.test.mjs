// VIS-07: every Chinese character of the display strings is in the Source Han Sans CN subset the site serves, so a
// nav label or section title is drawn by one Chinese face (a missing character fell back to the system face mid-word:
// 孪生 was split between the two). The display strings are the closed list in src/constants/display-strings.ts.
//
// After changing a display string: UPDATE_CJK_SUBSET=1 npx vitest run test/cjk-display.test.mjs
// (downloads the pinned source fonts once, writes src/styles/fonts/cjk-display-{500,700}.woff2 and the manifest).
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { DISPLAY_STRINGS } from '@/constants/display-strings';
import { buildCjkSubset, displayCharacters, readSubset } from '../scripts/build-cjk-subset.mjs';

const required = displayCharacters(DISPLAY_STRINGS);

describe('the Chinese display subset covers the display strings', () => {
  test.runIf(process.env.UPDATE_CJK_SUBSET === '1')(
    'regenerate the subset',
    async () => {
      const manifest = await buildCjkSubset(DISPLAY_STRINGS);
      expect(manifest.characters).toBe(required);
    },
    120_000,
  );

  test('every display character is in the subset', () => {
    const { manifest } = readSubset();
    const missing = [...required].filter((ch) => !manifest.characters.includes(ch));
    expect(missing.join(''), 'run UPDATE_CJK_SUBSET=1 npx vitest run test/cjk-display.test.mjs').toBe('');
  });

  test('the committed WOFF2 files are the ones the manifest describes', () => {
    expect(readSubset().drift).toEqual([]);
  });

  test('both weights together stay under the 128 KB the previous subsets were allowed', () => {
    const total = Object.values(readSubset().manifest.files).reduce((a, f) => a + f.bytes, 0);
    expect(total).toBeLessThanOrEqual(128 * 1024);
  });

  test('fonts.ts serves the generated files with the system CJK faces as fallback', () => {
    const src = readFileSync(new URL('../src/styles/fonts.ts', import.meta.url), 'utf8');
    const block = src.slice(src.indexOf('const sourceHanSansCN'), src.indexOf('});', src.indexOf('const sourceHanSansCN')));
    expect(block).toContain('cjk-display-500.woff2');
    expect(block).toContain('cjk-display-700.woff2');
    expect(block).toMatch(/fallback:\s*\[[^\]]*PingFang SC/);
  });
});
