// The desktop Spectrum composition is scaled against its OPEN height so that "more" never rescales it, is exactly 1
// wherever it fits, and stops at a floor below which it scrolls inside its band.
import { describe, expect, test } from 'vitest';
import { FIT_SCALE_FLOOR, fitScale } from '@/components/spectrum/fitScale';

describe('fitScale', () => {
  test('is exactly 1 when the open composition fits, or when nothing is measured yet', () => {
    expect(fitScale(800, 760)).toEqual({ scale: 1, scrolls: false, gapCut: 0 });
    expect(fitScale(800, 800)).toEqual({ scale: 1, scrolls: false, gapCut: 0 });
    expect(fitScale(0, 760)).toEqual({ scale: 1, scrolls: false, gapCut: 0 });
    expect(fitScale(800, 0)).toEqual({ scale: 1, scrolls: false, gapCut: 0 });
  });

  test('a shortfall under a pixel is rounding and keeps exactly 1', () => {
    expect(fitScale(690, 690.6)).toEqual({ scale: 1, scrolls: false, gapCut: 0 });
    expect(fitScale(690, 691).scale).toBeLessThan(1);
  });

  test('scales down to the room, never above it (rounded down)', () => {
    const { scale, scrolls } = fitScale(560, 600);
    expect(scrolls).toBe(false);
    expect(scale).toBeLessThanOrEqual(560 / 600);
    expect(scale * 600).toBeLessThanOrEqual(560);
    expect(scale).toBeGreaterThan(560 / 600 - 0.002);
  });

  test('stops at the floor and scrolls below it', () => {
    expect(fitScale(400, 600)).toEqual({ scale: FIT_SCALE_FLOOR, scrolls: true, gapCut: 0 });
    expect(fitScale(480, 600)).toEqual({ scale: FIT_SCALE_FLOOR, scrolls: false, gapCut: 0 });
  });

  test('takes a shortfall of up to half the paper gaps out of those gaps, at scale 1', () => {
    // 1920x937: 5 px short, one 16 px gap between the two rows of papers.
    expect(fitScale(729, 734, { count: 1, gap: 16 })).toEqual({ scale: 1, scrolls: false, gapCut: 5 });
    // exactly half the gap still fits; one px more scales with the gaps whole
    expect(fitScale(729, 737, { count: 1, gap: 16 })).toEqual({ scale: 1, scrolls: false, gapCut: 8 });
    const over = fitScale(729, 738, { count: 1, gap: 16 });
    expect(over.gapCut).toBe(0);
    expect(over.scale).toBe(Math.floor((729 / 738) * 1000) / 1000);
    // no rows of papers to give: scales as before
    expect(fitScale(729, 734)).toEqual({ scale: 0.993, scrolls: false, gapCut: 0 });
  });
});
