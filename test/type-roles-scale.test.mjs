// RWD-02 (two versions only, 2026-11-18): the experience's decks restate each type role as its size at the deck's
// reference width times the deck's unit (Style.tsx), so text follows the deck's scale. roleSizePx() reads a role's
// definition; these are its values worked out by hand from tokens.ts (16 px root).
import { describe, expect, test } from 'vitest';
import { roleSizePx, typeRoles } from '@/styles/tokens';

describe('roleSizePx', () => {
  test('the reading size and the roles built on it, at 1440 px', () => {
    expect(roleSizePx('body', 1440)).toBeCloseTo(0.44 * 14.4 + 10, 6); // 16.336
    expect(roleSizePx('caption', 1440)).toBeCloseTo((0.44 * 14.4 + 10) * 0.75, 6);
    expect(roleSizePx('lead', 1440)).toBeCloseTo((0.44 * 14.4 + 10) * 1.25, 6);
  });
  test('clamped roles at 1440 px and at 600 px (the phone deck joins its scale there)', () => {
    expect(roleSizePx('label', 1440)).toBeCloseTo(13 + 0.125 * 14.4, 6); // 14.8
    expect(roleSizePx('title-sm', 1440)).toBeCloseTo(16 + 0.5 * 14.4, 6); // 23.2
    expect(roleSizePx('title', 1440)).toBeCloseTo(20 + 1.25 * 14.4, 6); // 38
    expect(roleSizePx('headline', 1440)).toBeCloseTo(20 + 2.75 * 14.4, 6); // 59.6
    expect(roleSizePx('display', 1440)).toBeCloseTo(6 * 14.4, 6); // 86.4
    expect(roleSizePx('body', 600)).toBe(16); // floor
    expect(roleSizePx('label', 600)).toBe(14); // floor
    expect(roleSizePx('title', 600)).toBe(28); // floor (27.5)
    expect(roleSizePx('headline', 600)).toBeCloseTo(36.5, 6);
    expect(roleSizePx('display', 600)).toBe(44); // floor (36)
  });
  test('every role can be read', () => {
    for (const role of Object.keys(typeRoles))
      for (const w of [390, 600, 1440, 1920]) expect(Number.isFinite(roleSizePx(role, w))).toBe(true);
  });
});
