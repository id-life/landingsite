// MOT-06: the adaptive pixel ratio's decision (src/components/gl/dprGovernor.ts), fed synthetic frame times.
import { describe, expect, test } from 'vitest';
import { createDprGovernor, GAP_MS, INCLINE_WINDOW_MS } from '@/components/gl/dprGovernor';

/** Runs `ms` of frames `dt` apart from `t0`; returns the steps taken with their times. */
function run(g, t0, ms, dt, room = { down: true, up: true }, stopAtStep = false) {
  const steps = [];
  let t = t0;
  for (; t <= t0 + ms; t += dt) {
    const s = g.frame(t, room.down, room.up);
    if (s) {
      steps.push([s, Math.round(t - t0)]);
      if (stopAtStep) return { steps, t: t + dt };
    }
  }
  return { steps, t };
}

describe('adaptive pixel ratio', () => {
  test('a device holding 60 fps never changes', () => {
    const g = createDprGovernor();
    // At its ceiling (no room up), as a healthy device is from the start.
    expect(run(g, 1000, 60_000, 1000 / 60, { down: true, up: false }).steps).toEqual([]);
  });

  test('40 ms frames step down within 5 s, about every 2 s while they last', () => {
    const g = createDprGovernor();
    const { steps } = run(g, 1000, 7000, 40);
    expect(steps[0][0]).toBe('down');
    expect(steps[0][1]).toBeLessThanOrEqual(5000);
    expect(steps.length).toBeGreaterThanOrEqual(3);
  });

  test('a short hitch does not count: 500 ms of 100 ms frames inside 60 fps', () => {
    const g = createDprGovernor();
    let { t } = run(g, 1000, 3000, 1000 / 60, { down: true, up: false });
    ({ t } = run(g, t, 500, 100, { down: true, up: false }));
    expect(run(g, t, 3000, 1000 / 60, { down: true, up: false }).steps).toEqual([]);
  });

  test('frames recover: the ratio steps back up after the incline window of 50 fps or better', () => {
    const g = createDprGovernor();
    const { t, steps } = run(g, 1000, 5000, 40, undefined, true);
    expect(steps.map((s) => s[0])).toEqual(['down']);
    const up = run(g, t, INCLINE_WINDOW_MS + 500, 1000 / 60).steps;
    expect(up[0][0]).toBe('up');
    expect(up[0][1]).toBeGreaterThanOrEqual(INCLINE_WINDOW_MS - 50);
  });

  test('between 30 and 50 fps nothing moves either way (hysteresis)', () => {
    const g = createDprGovernor();
    expect(run(g, 1000, 20_000, 1000 / 40).steps).toEqual([]);
  });

  test('a step up that is taken back doubles the next step-up window', () => {
    const g = createDprGovernor();
    let t = 1000;
    ({ t } = run(g, t, 5000, 40, undefined, true)); // down
    ({ t } = run(g, t, 2 * INCLINE_WINDOW_MS, 1000 / 60, undefined, true)); // up
    ({ t } = run(g, t, 5000, 40, undefined, true)); // down again: the higher ratio did not hold
    const next = run(g, t, 3 * INCLINE_WINDOW_MS, 1000 / 60).steps;
    expect(next[0][0]).toBe('up');
    expect(next[0][1]).toBeGreaterThanOrEqual(2 * INCLINE_WINDOW_MS - 50);
  });

  test('a pause (hidden canvas, sleeping tab) is not a slow frame', () => {
    const g = createDprGovernor();
    let t = 1000;
    for (let i = 0; i < 20; i += 1) {
      g.frame(t, true, false);
      t += GAP_MS + 1000;
    }
    expect(run(g, t, 3000, 1000 / 60, { down: true, up: false }).steps).toEqual([]);
  });

  test('no room: nothing is asked of a ratio already at its floor or ceiling', () => {
    const g = createDprGovernor();
    expect(run(g, 1000, 6000, 40, { down: false, up: false }).steps).toEqual([]);
  });
});
