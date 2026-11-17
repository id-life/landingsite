// The phone deck changes its background by tweening <html>'s theme variables from whatever the last theme left there,
// so every theme must set every variable any theme sets; one it omits keeps the previous section's value (Spectrum's
// --gradient-rotate stayed on every section after it, unlike a fresh load of that section).
import { describe, expect, test } from 'vitest';
import { BACKGROUND_COLORS } from '@/constants/config';

describe('phone background themes', () => {
  test('every theme sets the same variables', () => {
    const keys = Object.values(BACKGROUND_COLORS).map((theme) => Object.keys(theme).sort().join(','));
    expect(new Set(keys).size).toBe(1);
    expect(keys[0]).toContain('--gradient-rotate');
  });

  test('only Spectrum turns the gradient; the others draw it at the stylesheet angle', () => {
    for (const [name, theme] of Object.entries(BACKGROUND_COLORS)) {
      expect(theme['--gradient-rotate']).toBe(name === 'black-red-2' ? '300deg' : '90deg');
    }
  });
});
