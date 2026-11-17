// The desktop Spectrum composition is scaled against its OPEN height so that "more" never rescales it, is exactly 1
// wherever it fits, and stops at a floor below which it scrolls inside its band.
import { describe, expect, test } from 'vitest';
import { FIT_SCALE_FLOOR, fitScale } from '@/components/spectrum/fitScale';

describe('fitScale', () => {
  test('is exactly 1 when the open composition fits, or when nothing is measured yet', () => {
    expect(fitScale(800, 760)).toEqual({ scale: 1, scrolls: false });
    expect(fitScale(800, 800)).toEqual({ scale: 1, scrolls: false });
    expect(fitScale(0, 760)).toEqual({ scale: 1, scrolls: false });
    expect(fitScale(800, 0)).toEqual({ scale: 1, scrolls: false });
  });

  test('scales down to the room, never above it (rounded down)', () => {
    const { scale, scrolls } = fitScale(560, 600);
    expect(scrolls).toBe(false);
    expect(scale).toBeLessThanOrEqual(560 / 600);
    expect(scale * 600).toBeLessThanOrEqual(560);
    expect(scale).toBeGreaterThan(560 / 600 - 0.002);
  });

  test('stops at the floor and scrolls below it', () => {
    expect(fitScale(400, 600)).toEqual({ scale: FIT_SCALE_FLOOR, scrolls: true });
    expect(fitScale(480, 600)).toEqual({ scale: FIT_SCALE_FLOOR, scrolls: false });
  });
});
