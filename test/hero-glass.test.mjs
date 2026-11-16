// The hero glass: one of the six looks per page load, as in the original design. Drawn once, on first use, so React
// Strict Mode's second mount (and a deck change between the phone and desktop dragons) reuses the same look.
import { afterEach, describe, expect, test, vi } from 'vitest';

afterEach(() => vi.restoreAllMocks());

async function load() {
  vi.resetModules();
  return import('@/components/gl/config/visionGLConfig');
}

describe('heroGlass', () => {
  test('draws once per page load, then returns the same look', async () => {
    const random = vi.spyOn(Math, 'random').mockReturnValue(0.7);
    const { heroGlass } = await load();
    expect(random).not.toHaveBeenCalled(); // importing the module (as the server does) draws nothing
    const first = heroGlass();
    const second = heroGlass();
    expect(second).toBe(first);
    expect(random).toHaveBeenCalledTimes(1);
  });

  test('every one of the six looks can come up', async () => {
    const seen = new Set();
    for (let i = 0; i < 6; i += 1) {
      vi.spyOn(Math, 'random').mockReturnValue((i + 0.5) / 6);
      const { heroGlass } = await load();
      seen.add(heroGlass());
      vi.restoreAllMocks();
    }
    expect(seen.size).toBe(6);
  });
});
