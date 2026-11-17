// RWD-06: a map point's 44 px tap square is cut at the half-way line to every neighbour whose square overlaps it, so a
// tap between two points goes to the nearer one (cutTapSquare). Positions are made up, not the map's.
import { describe, expect, test } from 'vitest';
import { cutTapSquare, polygonClipPath } from '@/components/engagement/tapCut';

/** Is a point (in the square's own px) inside the polygon? Ray casting. */
const inside = (poly, [x, y]) => {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i, i += 1) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
};
/** A map position as the square's own px, for the square of the point at c. */
const local = (c, [x, y]) => [x - c[0] + 22, y - c[1] + 22];

describe('cutTapSquare', () => {
  test('no neighbour within reach: the whole square stays', () => {
    expect(
      cutTapSquare(
        [100, 100],
        [
          [200, 100],
          [100, 145],
          [150, 150],
        ],
      ),
    ).toBeNull();
  });

  test('a neighbour 20 px to the right: the square ends at the half-way line, 10 px right of the centre', () => {
    const poly = cutTapSquare([100, 100], [[120, 100]]);
    const xs = poly.map(([x]) => x);
    expect(Math.max(...xs)).toBeCloseTo(32, 6);
    expect(Math.min(...xs)).toBeCloseTo(0, 6);
  });

  test('two neighbours cut both sides; each point keeps its own half of every gap', () => {
    const a = [200, 100];
    const b = [214, 113];
    const c = [186, 120];
    const pa = cutTapSquare(a, [b, c]);
    const pb = cutTapSquare(b, [a, c]);
    // Points on the segment a-b: nearer a is in a's area and not b's, nearer b the other way round.
    for (const t of [0.1, 0.3, 0.45]) {
      const p = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
      expect(inside(pa, local(a, p))).toBe(true);
      expect(inside(pb, local(b, p))).toBe(false);
    }
    for (const t of [0.55, 0.7, 0.9]) {
      const p = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
      expect(inside(pa, local(a, p))).toBe(false);
      expect(inside(pb, local(b, p))).toBe(true);
    }
    // Each point's own centre stays in its own area.
    expect(inside(pa, [22, 22])).toBe(true);
    expect(inside(pb, [22, 22])).toBe(true);
  });

  test('the cut areas of overlapping neighbours never share a point', () => {
    const pts = [
      [300, 300],
      [313, 303],
      [324, 328],
      [290, 320],
    ];
    const polys = pts.map((c, i) =>
      cutTapSquare(
        c,
        pts.filter((_, j) => j !== i),
      ),
    );
    for (let x = 270; x <= 350; x += 2) {
      for (let y = 270; y <= 350; y += 2) {
        const owners = pts.filter((c, i) =>
          polys[i] ? inside(polys[i], local(c, [x, y])) : Math.abs(x - c[0]) < 22 && Math.abs(y - c[1]) < 22,
        );
        expect(owners.length).toBeLessThanOrEqual(1);
      }
    }
  });

  test('as a clip-path: a polygon in px', () => {
    expect(
      polygonClipPath([
        [0, 0],
        [32, 0],
        [32, 44],
        [0, 44],
      ]),
    ).toBe('polygon(0px 0px, 32px 0px, 32px 44px, 0px 44px)');
  });
});
