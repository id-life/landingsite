// RWD-02: one definition of the device classes (src/styles/device-classes.ts). The tree React mounts and the CSS
// that lays it out must answer the same question, so no file may ask `max-width: 768px` on its own any more: CSS
// reads the Tailwind screens built from the module, and the few hand-written media queries repeat its query exactly.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import {
  COMPACT_HEIGHT_QUERY,
  DESKTOP_TREE_QUERY,
  desktopTreeAnd,
  PHONE_TREE_MAX_WIDTH,
  PHONE_TREE_QUERY,
  phoneLayoutUnitPx,
  WIDTH_CLASS_QUERY,
} from '@/styles/device-classes';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

/** Evaluate a media query list for a viewport (the subset of the grammar the module uses). */
const matches = (query, { width, height }) =>
  query.split(/,\s*/).some(
    (part) =>
      [...part.matchAll(/\((min|max)-(width|height):\s*([\d.]+)px\)/g)].every(([, kind, dim, value]) => {
        const v = dim === 'width' ? width : height;
        return kind === 'min' ? v >= Number(value) : v <= Number(value);
      }) &&
      // orientation: portrait is height >= width, landscape width > height (CSS Media Queries 4).
      [...part.matchAll(/\(orientation:\s*(portrait|landscape)\)/g)].every(([, o]) =>
        o === 'portrait' ? height >= width : width > height,
      ),
  );

describe('device classes', () => {
  test('the width classes cover every width exactly once', () => {
    for (let width = 200; width <= 4000; width += 0.5) {
      const hits = Object.values(WIDTH_CLASS_QUERY).filter((q) => matches(q, { width, height: 900 }));
      expect(hits.length, `${width} px`).toBe(1);
    }
  });

  test('the phone and desktop tree queries are complements', () => {
    for (const width of [320, 390, 599, 600, 744, 768, 769, 820, 844, 1024, 1180, 1440, 1920]) {
      for (const height of [390, 450, 479, 480, 641, 844, 900, 1180]) {
        const vp = { width, height };
        expect(matches(PHONE_TREE_QUERY, vp) !== matches(DESKTOP_TREE_QUERY, vp), `${width}x${height}`).toBe(true);
      }
    }
  });

  test('two decks (the owner, 2026-11-18): phones either way and tablets held upright get the phone deck; tablets on their side and laptops the laptop deck', () => {
    for (const vp of [
      { width: 390, height: 844 },
      { width: 844, height: 390 },
      { width: 932, height: 430 },
      { width: 720, height: 450 }, // 1440x900 at 200 % zoom
      { width: 768, height: 600 }, // at most 768 px wide
      { width: 744, height: 1133 },
      { width: 768, height: 1024 },
      { width: 820, height: 1180 },
      { width: 1024, height: 1366 },
    ])
      expect(matches(PHONE_TREE_QUERY, vp), `${vp.width}x${vp.height}`).toBe(true);
    for (const vp of [
      { width: 769, height: 600 },
      { width: 1024, height: 768 },
      { width: 1180, height: 820 },
      { width: 1194, height: 834 },
      { width: 1366, height: 1024 },
      { width: 1366, height: 641 },
      { width: 1440, height: 900 },
      { width: 1200, height: 1600 }, // upright, but wider than 1024 px
    ])
      expect(matches(PHONE_TREE_QUERY, vp), `${vp.width}x${vp.height}`).toBe(false);
    expect(PHONE_TREE_QUERY).toContain(COMPACT_HEIGHT_QUERY);
  });

  test('desktopTreeAnd narrows every query of the list, not only the last', () => {
    const q = desktopTreeAnd('(max-width: 1199.98px)');
    expect(q.split(', ').every((part) => part.endsWith('and (max-width: 1199.98px)'))).toBe(true);
    expect(matches(q, { width: 1440, height: 900 })).toBe(false);
    expect(matches(q, { width: 1024, height: 768 })).toBe(true);
  });

  test('the phone deck unit: 16 px at phone widths, proportionally larger above, bounded by the height', () => {
    for (const [w, h] of [
      [320, 568],
      [360, 740],
      [375, 667],
      [390, 844],
      [430, 932],
      [599, 900],
      [844, 390],
      [932, 430],
    ])
      expect(phoneLayoutUnitPx(w, h), `${w}x${h}`).toBe(16);
    expect(phoneLayoutUnitPx(600, 1000)).toBe(16); // continuous at 600 px
    expect(phoneLayoutUnitPx(744, 1133)).toBeCloseTo((744 * 16) / 600, 5); // width-bound
    expect(phoneLayoutUnitPx(768, 1024)).toBeCloseTo((768 * 16) / 600, 5);
    expect(phoneLayoutUnitPx(768, 900)).toBeCloseTo((900 * 16) / 740, 5); // height-bound: a page of the deck still fits
    expect(phoneLayoutUnitPx(820, 1180)).toBeCloseTo((820 * 16) / 600, 5);
    expect(phoneLayoutUnitPx(1024, 1366)).toBeCloseTo((1024 * 16) / 600, 5);
    // Monotonic in the width and never below 16 px.
    let last = 0;
    for (let w = 320; w <= 1024; w += 1) {
      const v = phoneLayoutUnitPx(w, 1366);
      expect(v).toBeGreaterThanOrEqual(last);
      expect(v).toBeGreaterThanOrEqual(16);
      last = v;
    }
  });

  test('no source file hard-codes the old 768 px tree breakpoint', () => {
    const offenders = [];
    for (const file of walk(join(ROOT, 'src'))) {
      if (!/\.(tsx?|css|mjs)$/.test(file) || file.endsWith('device-classes.ts')) continue;
      const text = readFileSync(file, 'utf8');
      // A media query on the tree width must carry the compact-height clause (the phone tree query).
      for (const m of text.matchAll(/max-width:\s*(768|768\.98|599\.98)px\)([^{`'"]*)/g)) {
        if (
          m[1] !== '768.98' ||
          !m[2].includes('max-height: 479.98px') ||
          !m[2].includes('(orientation: portrait) and (max-width: 1024.98px)')
        )
          offenders.push(`${relative(ROOT, file)}: ${m[0].trim()}`);
      }
      if (/maxWidth:\s*768\b|innerWidth\s*<=\s*768/.test(text)) offenders.push(`${relative(ROOT, file)}: JS width test`);
    }
    // Responsive image hints (`sizes`) describe image widths, not the tree: allowed.
    expect(offenders.filter((o) => !/sizes|YouTubeThumbnail|Topic|NewsCard|CoverImage/.test(o))).toEqual([]);
    expect(PHONE_TREE_MAX_WIDTH).toBe(768.98);
  });
});
