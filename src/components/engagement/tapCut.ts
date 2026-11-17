/**
 * RWD-06: a map point's tap area is a square of 2 * half px centred on the point, cut at the half-way line to every
 * neighbour whose square overlaps it, so between two points the space is split in the middle and a tap goes to the
 * nearer point. A tap area may only reach into space that is nobody's (the rule of the Insights arrows too).
 *
 * Returns the polygon that is left, in px from the square's top left corner (for a clip-path), or null when no
 * neighbour reaches the square (the whole square stays).
 */
export type Point = readonly [number, number];

export function cutTapSquare(centre: Point, neighbours: readonly Point[], half = 22): Point[] | null {
  const [cx, cy] = centre;
  const near = neighbours.filter(
    ([x, y]) => (x !== cx || y !== cy) && Math.abs(x - cx) < 2 * half && Math.abs(y - cy) < 2 * half,
  );
  if (!near.length) return null;
  // The square, in the square's own coordinates (0 .. 2 * half).
  let poly: Point[] = [
    [0, 0],
    [2 * half, 0],
    [2 * half, 2 * half],
    [0, 2 * half],
  ];
  for (const [nx, ny] of near) {
    // Keep the points nearer this centre than the neighbour: (p - m) . d <= 0, with m the midpoint and d = n - c.
    const dx = nx - cx;
    const dy = ny - cy;
    const mx = (nx - cx) / 2 + half;
    const my = (ny - cy) / 2 + half;
    const side = ([x, y]: Point) => (x - mx) * dx + (y - my) * dy;
    const out: Point[] = [];
    for (let i = 0; i < poly.length; i += 1) {
      const a = poly[i];
      const b = poly[(i + 1) % poly.length];
      const sa = side(a);
      const sb = side(b);
      if (sa <= 0) out.push(a);
      if ((sa < 0 && sb > 0) || (sa > 0 && sb < 0)) {
        const t = sa / (sa - sb);
        out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
      }
    }
    poly = out;
    if (!poly.length) break;
  }
  return poly;
}

/** A polygon as a CSS clip-path. */
export const polygonClipPath = (poly: readonly Point[]) =>
  `polygon(${poly.map(([x, y]) => `${Math.round(x * 100) / 100}px ${Math.round(y * 100) / 100}px`).join(', ')})`;
