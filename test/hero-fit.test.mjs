// RWD-01: the desktop hero keeps the ring and the dragon clear of the home statement (heroFit.ts, fitHeroToReserve).
import { describe, expect, test } from 'vitest';
import {
  fitHeroScale,
  fitHeroToReserve,
  HERO_BOTTOM_RESERVE,
  HERO_INK,
  LOGO_PLANE_HEIGHT,
} from '../src/components/gl/model/vision/heroFit';

const PLANE_W = LOGO_PLANE_HEIGHT * (277 / 58);
const tan = Math.tan((20 * Math.PI) / 180);
const wordmarkPx = (s, h) => (s * PLANE_W * h) / (2 * tan * (10 + 5 * s));
const centrePx = (fit, h) => h / 2 - fit.offsetY / ((2 * tan * (10 + 5 * fit.scale)) / h);

describe('fitHeroToReserve', () => {
  test('without a measured statement it is the plain frustum fit', () => {
    expect(fitHeroToReserve(1440, 900, PLANE_W, LOGO_PLANE_HEIGHT, null)).toEqual({
      scale: fitHeroScale(1.6, PLANE_W, LOGO_PLANE_HEIGHT),
      offsetY: 0,
    });
  });
  test('a statement far above the ring changes nothing', () => {
    const fit = fitHeroToReserve(1920, 1080, PLANE_W, LOGO_PLANE_HEIGHT, { bottom: 120, right: 400 });
    expect(fit.offsetY).toBe(0);
    expect(fit.scale).toBe(fitHeroScale(1920 / 1080, PLANE_W, LOGO_PLANE_HEIGHT));
  });
  for (const [w, h, stmt] of [
    [1440, 900, { bottom: 268, right: 590 }],
    [1180, 820, { bottom: 302, right: 585 }],
    [1920, 1080, { bottom: 307, right: 712 }],
  ]) {
    test(`${w}x${h}: the ring's top is below the statement and the tagline above the bottom controls`, () => {
      const fit = fitHeroToReserve(w, h, PLANE_W, LOGO_PLANE_HEIGHT, stmt);
      const W = wordmarkPx(fit.scale, h);
      const c = centrePx(fit, h);
      const reach = stmt.right > w / 2 - HERO_INK.dragonLeft * W ? HERO_INK.dragonTop : HERO_INK.ringTop;
      expect(c - reach * W).toBeGreaterThanOrEqual(stmt.bottom + 15.5);
      expect(c + HERO_INK.bottom * W).toBeLessThanOrEqual(h - HERO_BOTTOM_RESERVE + 0.5);
      expect(fit.scale).toBeLessThanOrEqual(fitHeroScale(w / h, PLANE_W, LOGO_PLANE_HEIGHT));
    });
  }
});
