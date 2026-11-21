// NAV-05: only what cannot be shown takes inert (the sections a move passes and everything under an open modal); a
// section at rest off screen stays reachable. A section change asked for from the keyboard focuses the section reached.
import { afterEach, describe, expect, test, vi } from 'vitest';
import { NAV_LIST } from '@/components/nav/nav';
import { inertSections, takeKeyboardActivation, listenForKeyboardActivation } from '@/motion/sectionFocus';

const ids = NAV_LIST.map((item) => item.id);

describe('inert sections', () => {
  test('at rest nothing is inert: an off-screen section stays reachable by Tab', () => {
    expect(inertSections({ index: 2, target: 2, phase: 'idle' }, false)).toEqual([]);
  });

  test('during a move only the sections it passes are inert, not where it starts nor where it goes', () => {
    const inert = inertSections({ index: 1, target: 5, phase: 'moving' }, false);
    expect(inert).not.toContain(ids[1]);
    expect(inert).not.toContain(ids[5]);
    expect(inert).toHaveLength(ids.length - 2);
  });

  test('a move to the next section leaves both of them reachable', () => {
    expect(inertSections({ index: 3, target: 4, phase: 'moving' }, false)).not.toEqual(expect.arrayContaining([ids[3]]));
  });

  test('under an open modal every section is inert', () => {
    expect(inertSections({ index: 0, target: 0, phase: 'idle' }, true)).toEqual(ids);
  });
});

describe('a change asked for from the keyboard', () => {
  const listeners = {};
  afterEach(() => {
    delete globalThis.window;
    vi.useRealTimers();
  });

  test('Enter shortly before counts once; a pointer press clears it; too late does not count', () => {
    globalThis.window = { addEventListener: (type, fn) => (listeners[type] = fn) };
    listenForKeyboardActivation();
    listeners.keydown({ key: 'Enter' });
    const at = performance.now();
    expect(takeKeyboardActivation(at + 100)).toBe(true);
    expect(takeKeyboardActivation(at + 200)).toBe(false);
    listeners.keydown({ key: 'Enter' });
    listeners.pointerdown();
    expect(takeKeyboardActivation(performance.now())).toBe(false);
    listeners.keydown({ key: ' ' });
    expect(takeKeyboardActivation(performance.now() + 5000)).toBe(false);
  });
});
