// The Twin's avatar may never be uncovered empty (lead's ruling, 2026-11-21): its models start loading at the first
// real input, and a far jump's cover waits for the avatar's first drawn frame, within a limit.
import { describe, expect, test, vi } from 'vitest';
import { onFirstInput, setTwinAvatarDrawn, isTwinAvatarDrawn, whenTwinAvatarDrawn } from '@/components/twin/twinReady';
import { coverHoldFor, registerCoverHold } from '@/motion/coverHold';

describe('first real input (twinReady)', () => {
  test('runs once, on a press, a key, a wheel step or a touch, and never on a pointer move', () => {
    for (const type of ['pointerdown', 'keydown', 'wheel', 'touchstart']) {
      const target = new EventTarget();
      const run = vi.fn();
      onFirstInput(target, run);
      target.dispatchEvent(new Event('pointermove'));
      target.dispatchEvent(new Event('mousemove'));
      expect(run, type).not.toHaveBeenCalled();
      target.dispatchEvent(new Event(type));
      target.dispatchEvent(new Event(type));
      expect(run, type).toHaveBeenCalledTimes(1);
    }
  });
  test('a cleanup before any input runs nothing', () => {
    const target = new EventTarget();
    const run = vi.fn();
    onFirstInput(target, run)();
    target.dispatchEvent(new Event('keydown'));
    expect(run).not.toHaveBeenCalled();
  });
});

describe('avatar drawn signal (twinReady)', () => {
  test('resolves at once when drawn, on the draw when it comes, or at the limit', async () => {
    vi.useFakeTimers();
    setTwinAvatarDrawn(true);
    await expect(whenTwinAvatarDrawn(1000)).resolves.toBe('drawn');
    setTwinAvatarDrawn(false);
    expect(isTwinAvatarDrawn()).toBe(false);
    const late = whenTwinAvatarDrawn(1000);
    vi.advanceTimersByTime(400);
    setTwinAvatarDrawn(true);
    await expect(late).resolves.toBe('drawn');
    setTwinAvatarDrawn(false);
    const never = whenTwinAvatarDrawn(1000);
    vi.advanceTimersByTime(1000);
    await expect(never).resolves.toBe('timeout');
    vi.useRealTimers();
  });
});

describe('readiness without a limit (twinReady)', () => {
  test('Infinity never times out: it waits for the draw', async () => {
    vi.useFakeTimers();
    setTwinAvatarDrawn(false);
    let settled = null;
    whenTwinAvatarDrawn(Infinity).then((v) => (settled = v));
    vi.advanceTimersByTime(60_000);
    await Promise.resolve();
    expect(settled).toBeNull();
    setTwinAvatarDrawn(true);
    await Promise.resolve();
    expect(settled).toBe('drawn');
    setTwinAvatarDrawn(false);
    vi.useRealTimers();
  });
});

describe('cover holds (coverHold)', () => {
  test('the cover asks with its limit, the landing without', () => {
    const asked = [];
    const off = registerCoverHold(5, (limited) => (asked.push(limited), null));
    coverHoldFor(5);
    expect(asked).toEqual([true]);
    off();
  });
  test('a section with a hold returns its promise; others none; unregistering removes it', async () => {
    const off = registerCoverHold(5, () => Promise.resolve('drawn'));
    expect(coverHoldFor(4)).toBeNull();
    await expect(coverHoldFor(5)).resolves.toBe('drawn');
    off();
    expect(coverHoldFor(5)).toBeNull();
  });
  test('a hold that answers null holds nothing', () => {
    const off = registerCoverHold(5, () => null);
    expect(coverHoldFor(5)).toBeNull();
    off();
  });
});
