// The original site's own timings (src/motion/original.ts) play as he set them, not bent onto the token scale, and
// still land at once while motion is reduced (MOT-02), as the tokens do.
import { afterEach, describe, expect, test } from 'vitest';
import { CHROME, MENU_ITEMS, PHONE, SECTIONS, TILT } from '@/motion/original';
import { setTokensReduced } from '@/motion/tokens';

describe("the original's values", () => {
  afterEach(() => setTokensReduced(false));

  test('read as his source sets them', () => {
    expect(PHONE.heroIn.position).toBe(1.2);
    expect(PHONE.heroIn.positionEase).toBe('power3.out');
    expect(PHONE.portfolioItem.overlap).toBe(0.6);
    expect(PHONE.insightsIn.delay).toBe(0.5);
    expect(PHONE.themeTurn.duration).toBe(0.5);
    expect(PHONE.wordmarkSwap.duration).toBe(0.5);
    expect(SECTIONS.connectFooter.duration).toBe(0.5);
    expect(TILT.entrance).toEqual({ x: 45, y: 15 });
    expect([CHROME.menuOpen.duration, CHROME.menuOpen.ease, CHROME.menuOpen.delay]).toEqual([0.6, 'power4.out', -0.06]);
  });

  test('read 0 while motion is reduced, and come back after; eases are unchanged', () => {
    setTokensReduced(true);
    expect(PHONE.heroIn.position).toBe(0);
    expect(PHONE.portfolioItem.overlap).toBe(0);
    expect(PHONE.dragonRecovery).toBe(0);
    expect(PHONE.heroIn.positionEase).toBe('power3.out');
    expect(CHROME.menuOpen.delay).toBe(0);
    // Travel, stagger and tilt are not durations: reduced motion leaves them as they were.
    expect(MENU_ITEMS.stagger).toBe(0.1);
    expect(TILT.entrance.x).toBe(45);
    setTokensReduced(false);
    expect(PHONE.heroIn.position).toBe(1.2);
  });
});

describe("the loader bar's steps (his rate rule)", () => {
  test('0.5 s with no rate, 0.8 / (rate x 150) between 0.3 s and 1.5 s otherwise', async () => {
    const { loaderStepSeconds } = await import('@/motion/original');
    expect(loaderStepSeconds(0, 100)).toBe(0.5);
    expect(loaderStepSeconds(10, 0)).toBe(0.5);
    // 10 points in 200 ms: 0.05 per ms, 0.8 / 7.5 = 0.107 s, held at 0.3 s.
    expect(loaderStepSeconds(10, 200)).toBe(0.3);
    // 10 points in 1500 ms: 0.8 / 1 = 0.8 s.
    expect(loaderStepSeconds(10, 1500)).toBeCloseTo(0.8, 6);
    // 1 point in 5 s: held at 1.5 s.
    expect(loaderStepSeconds(1, 5000)).toBe(1.5);
  });
});
