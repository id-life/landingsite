// RWD-01: the home statement finds the room the hero's art leaves from the scene's own fit (heroFit.ts). The art's
// box must match the canvas: measured on masks of the 3D at rest, the wordmark spans these widths.
import { describe, expect, test } from 'vitest';
import { heroArtBox, heroInkTop, HERO_DRAGON } from '../src/components/gl/model/vision/heroFit';

describe('heroArtBox', () => {
  for (const [w, h, measured] of [
    [1180, 820, 1013],
    [1366, 768, 1041],
    [1440, 900, 1219],
    [1920, 1080, 1463],
    [2560, 1440, 1951],
  ]) {
    test(`${w}x${h}: the wordmark is within 2 % of the ${measured} px measured on the canvas`, () => {
      expect(Math.abs(heroArtBox(w, h).W - measured) / measured).toBeLessThan(0.02);
    });
  }
  test('the dragon is the highest ink, and the wordmark alone the lowest', () => {
    const art = heroArtBox(1440, 900);
    expect(heroInkTop(art.cx, art)).toBeCloseTo(art.cy - HERO_DRAGON.top * art.W);
    expect(heroInkTop(20, art)).toBeGreaterThan(heroInkTop(art.cx - 0.3 * art.W, art));
  });
});
