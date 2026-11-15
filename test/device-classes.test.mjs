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
  PHONE_TREE_MAX_WIDTH,
  PHONE_TREE_QUERY,
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
  query.split(/,\s*/).some((part) =>
    [...part.matchAll(/\((min|max)-(width|height):\s*([\d.]+)px\)/g)].every(([, kind, dim, value]) => {
      const v = dim === 'width' ? width : height;
      return kind === 'min' ? v >= Number(value) : v <= Number(value);
    }),
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

  test('phones get the phone tree in both orientations; tablets and laptops the desktop tree', () => {
    for (const vp of [
      { width: 390, height: 844 },
      { width: 844, height: 390 },
      { width: 932, height: 430 },
      { width: 720, height: 450 }, // 1440x900 at 200 % zoom
    ])
      expect(matches(PHONE_TREE_QUERY, vp), `${vp.width}x${vp.height}`).toBe(true);
    for (const vp of [
      { width: 744, height: 1133 },
      { width: 768, height: 1024 },
      { width: 820, height: 1180 },
      { width: 1180, height: 820 },
      { width: 1366, height: 641 },
      { width: 1440, height: 900 },
    ])
      expect(matches(PHONE_TREE_QUERY, vp), `${vp.width}x${vp.height}`).toBe(false);
    expect(PHONE_TREE_QUERY).toContain(COMPACT_HEIGHT_QUERY);
  });

  test('no source file hard-codes the old 768 px tree breakpoint', () => {
    const offenders = [];
    for (const file of walk(join(ROOT, 'src'))) {
      if (!/\.(tsx?|css|mjs)$/.test(file) || file.endsWith('device-classes.ts')) continue;
      const text = readFileSync(file, 'utf8');
      // A media query on the tree width must carry the compact-height clause (the phone tree query).
      for (const m of text.matchAll(/max-width:\s*(768|599\.98)px\)([^{`'"]*)/g)) {
        if (m[1] === '768' || !m[2].includes('max-height: 479.98px')) offenders.push(`${relative(ROOT, file)}: ${m[0].trim()}`);
      }
      if (/maxWidth:\s*768\b|innerWidth\s*<=\s*768/.test(text)) offenders.push(`${relative(ROOT, file)}: JS width test`);
    }
    // Responsive image hints (`sizes`) describe image widths, not the tree: allowed.
    expect(offenders.filter((o) => !/sizes|YouTubeThumbnail|Topic|NewsCard|CoverImage/.test(o))).toEqual([]);
    expect(PHONE_TREE_MAX_WIDTH).toBeGreaterThanOrEqual(599.98);
  });
});
