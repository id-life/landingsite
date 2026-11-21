// RWD-03: the compact-height windows split at the original's phone width, and the phone Presence map's offset there.
// At most 768 px wide (and under 480 px tall) the original drew its phone version, the reference; wider it drew its
// laptop version. One height threshold (480 px) and the tree's own width edge; no breakpoint of their own.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { COMPACT_HEIGHT_QUERY, PHONE_TREE_QUERY, SHORT_NARROW_QUERY, SHORT_WIDE_QUERY } from '@/styles/device-classes';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (p) => readFileSync(`${ROOT}/${p}`, 'utf8');
/** One media query (no list) for a viewport: the min/max width/height subset the module uses. */
const matches = (query, { width, height }) =>
  query.split(/,\s*/).some((part) =>
    [...part.matchAll(/\((min|max)-(width|height):\s*([\d.]+)px\)/g)].every(([, kind, dim, value]) => {
      const v = dim === 'width' ? width : height;
      return kind === 'min' ? v >= Number(value) : v <= Number(value);
    }),
  );

describe('short windows by the original phone width', () => {
  test('narrow and wide split every compact-height window exactly once, at the original 768 px edge', () => {
    for (let width = 280; width <= 2000; width += 1)
      for (const height of [300, 320, 360, 375, 390, 414, 430, 450, 479]) {
        const vp = { width, height };
        const n = matches(SHORT_NARROW_QUERY, vp),
          w = matches(SHORT_WIDE_QUERY, vp);
        expect(n !== w, `${width}x${height}`).toBe(true);
        expect(n, `${width}x${height}`).toBe(width <= 768);
        expect(matches(PHONE_TREE_QUERY, vp), `${width}x${height}`).toBe(true);
      }
    for (const vp of [
      { width: 640, height: 480 },
      { width: 844, height: 480 },
      { width: 390, height: 844 },
    ])
      expect(matches(SHORT_NARROW_QUERY, vp) || matches(SHORT_WIDE_QUERY, vp), `${vp.width}x${vp.height}`).toBe(false);
    expect(SHORT_NARROW_QUERY).toContain(COMPACT_HEIGHT_QUERY);
    expect(SHORT_WIDE_QUERY).toContain(COMPACT_HEIGHT_QUERY);
  });
  test('the Tailwind screens are these queries', () => {
    const config = read('tailwind.config.ts');
    expect(config).toMatch(/shortNarrow: \{ raw: SHORT_NARROW_QUERY \}/);
    expect(config).toMatch(/shortWide: \{ raw: SHORT_WIDE_QUERY \}/);
  });
});
