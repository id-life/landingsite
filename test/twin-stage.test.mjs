// MOT-09: the Digital Twin's canvas exists only while the visitor is at or next to the Twin, or on the way there.
import { describe, expect, test } from 'vitest';
import { twinStageNear, TWIN_STAGE_RELEASE_MS } from '@/components/twin/twinStage';
import { NAV_LIST } from '@/components/nav/nav';

const twin = NAV_LIST.findIndex((item) => item.id === 'twin_page');

describe('twin stage mount rule (MOT-09)', () => {
  test('the Twin and its two neighbours want the canvas', () => {
    for (const index of [twin - 1, twin, twin + 1])
      expect(twinStageNear({ index, target: index }, twin), String(index)).toBe(true);
  });
  test('two or more sections away it is not wanted', () => {
    const far = NAV_LIST.map((_, i) => i).filter((i) => Math.abs(i - twin) >= 2);
    expect(far.length).toBeGreaterThan(0);
    for (const index of far) expect(twinStageNear({ index, target: index }, twin), String(index)).toBe(false);
  });
  test('a far jump to the Twin wants it from its start (the target), and a jump away keeps it until it lands', () => {
    expect(twinStageNear({ index: 0, target: twin }, twin)).toBe(true);
    expect(twinStageNear({ index: twin, target: 0 }, twin)).toBe(true);
    expect(twinStageNear({ index: 0, target: 1 }, twin)).toBe(false);
  });
  test('release waits long enough that a quick step back does not remount', () => {
    expect(TWIN_STAGE_RELEASE_MS).toBeGreaterThanOrEqual(1000);
  });
});
