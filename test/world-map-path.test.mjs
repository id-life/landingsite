// MOT-11: the Presence map's 3,085 dots are drawn as one path, not 3,085 SVG circles (each a DOM node the spotlight
// copied on hover). The path must hold exactly the original's dots: same centres, same radius, same fill.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { circlesOf, dotsPathSvg, subpathCentres } from '../scripts/merge-map-dots.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const original = readFileSync(`${root}/public/svgs/engagement/world-map.svg`, 'utf8');
const merged = readFileSync(`${root}/public/svgs/engagement/world-map-path.svg`, 'utf8');

describe('world map as one path (MOT-11)', () => {
  test('the committed file is what the script makes from the original', () => {
    expect(merged).toBe(dotsPathSvg(original));
  });
  test('one path, no circles, the same viewBox and fill', () => {
    expect(merged.match(/<circle/g)).toBeNull();
    expect(merged.match(/<path/g)).toHaveLength(1);
    expect(merged).toContain('viewBox="0 0 126 60"');
    expect(merged).toContain('fill="#ffffff33"');
  });
  test('every dot of the original, and only those, at its centre and radius', () => {
    const circles = circlesOf(original);
    expect(circles).toHaveLength(3085);
    const key = ({ cx, cy, r }) => `${cx},${cy},${r}`;
    expect(subpathCentres(merged).map(key).sort()).toEqual(circles.map(key).sort());
  });
});
