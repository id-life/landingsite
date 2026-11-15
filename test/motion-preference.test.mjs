// MOT-02: one motion preference. The OS setting decides until the on-page Motion switch is used; the switch wins in
// both directions, is remembered, and the motion tokens follow it (every duration reads 0 while reduced).
import { afterEach, describe, expect, test, vi } from 'vitest';

function fakeBrowser({ osReduce = false, stored = null } = {}) {
  const store = new Map(stored ? [['idl_motion', stored]] : []);
  const mqlListeners = [];
  const mql = { matches: osReduce, addEventListener: (_t, fn) => mqlListeners.push(fn) };
  const classes = new Set();
  globalThis.window = {
    matchMedia: () => mql,
    localStorage: { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) },
    addEventListener: () => {},
  };
  globalThis.document = { documentElement: { classList: { toggle: (c, on) => (on ? classes.add(c) : classes.delete(c)) } } };
  return { store, classes, setOs: (v) => ((mql.matches = v), mqlListeners.forEach((fn) => fn())) };
}

async function load(opts) {
  vi.resetModules();
  const env = fakeBrowser(opts);
  const pref = await import('@/motion/preference');
  const tokens = await import('@/motion/tokens');
  return { env, pref, tokens };
}

afterEach(() => {
  delete globalThis.window;
  delete globalThis.document;
});

describe('motion preference', () => {
  test('follows the OS setting without a stored choice, live', async () => {
    const { env, pref, tokens } = await load({ osReduce: false });
    expect(pref.isReducedMotion()).toBe(false);
    expect(tokens.DURATION.section).toBeGreaterThan(0);
    const seen = [];
    pref.onReducedMotionChange((r) => seen.push(r));
    env.setOs(true);
    expect(pref.isReducedMotion()).toBe(true);
    expect(seen).toEqual([true]);
    expect(tokens.DURATION.section).toBe(0);
    expect(env.classes.has('motion-reduced')).toBe(true);
  });

  test('the switch wins over the OS in both directions and is remembered', async () => {
    const { env, pref, tokens } = await load({ osReduce: true });
    expect(pref.isReducedMotion()).toBe(true);
    pref.setMotionEnabled(true);
    expect(pref.isReducedMotion()).toBe(false);
    expect(env.classes.has('motion-full')).toBe(true); // lifts the CSS guard of the OS setting
    expect(env.store.get('idl_motion')).toBe('on');
    expect(tokens.DURATION.base).toBeGreaterThan(0);
    pref.setMotionEnabled(false);
    expect(pref.isReducedMotion()).toBe(true);
    expect(env.store.get('idl_motion')).toBe('off');
  });

  test('a stored "off" reduces motion on a device that asks for nothing', async () => {
    const { pref } = await load({ osReduce: false, stored: 'off' });
    expect(pref.isReducedMotion()).toBe(true);
  });
});
