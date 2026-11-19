// Where the phone map's strip stops for an open card (fitStripStop). Positions are made up, not the map's.
import { describe, expect, test } from 'vitest';
import { fitStripStop } from '@/hooks/anim/cardFit';

const base = { viewport: 390, maxScroll: 2000 };

describe('fitStripStop', () => {
  test('a card already whole where the strip stops today does not move', () => {
    expect(fitStripStop({ ...base, intended: 500, name: [700, 760], card: [520, 880] })).toBe(500);
    // Whole even with no margin left: still no move.
    expect(fitStripStop({ ...base, intended: 500, name: [500, 560], card: [600, 890] })).toBe(500);
  });

  test('a card that fits but reaches past the right edge: the least move that leaves 8 px', () => {
    // card right at 1000 - 500 = 500 > 390: move until it ends at 382.
    expect(fitStripStop({ ...base, intended: 500, name: [650, 700], card: [700, 1000] })).toBe(1000 - 382);
  });

  test('a card that fits but reaches past the left edge: the least move that leaves 8 px', () => {
    expect(fitStripStop({ ...base, intended: 500, name: [700, 750], card: [450, 760] })).toBe(450 - 8);
  });

  test('nearly as wide as the window: the margin shrinks to what is left, split on both sides', () => {
    // 384 px of content in 390: 3 px each side.
    expect(fitStripStop({ ...base, intended: 0, name: [500, 560], card: [600, 884] })).toBe(500 - 3);
  });

  test('too wide, the name left of the card: the name at the left edge, the card cut on the right', () => {
    // 400 px (Berkeley-like): the name's first letter at 0.
    expect(fitStripStop({ ...base, intended: 300, name: [402, 465], card: [498, 802] })).toBe(402);
  });

  test('too wide, the name right of the card: the name at the right edge, the card cut on the left', () => {
    // 448 px (Shanghai-like): the name's last letter at 390.
    expect(fitStripStop({ ...base, intended: 900, name: [1150, 1222], card: [774, 1111] })).toBe(1222 - 390);
  });

  test('too wide, the point left of its name: the point at the left edge, the name whole, the card cut on the right', () => {
    // Berkeley-like: the drawn circle 14 px left of the name's first letter.
    expect(fitStripStop({ ...base, intended: 300, point: [388, 396], name: [402, 465], card: [498, 802] })).toBe(388);
  });

  test('the point is part of what fits: a card that fits with its name but not with its point moves for the point', () => {
    expect(fitStripStop({ ...base, intended: 400, point: [396, 404], name: [410, 470], card: [480, 760] })).toBe(396 - 8);
  });

  test('the stop stays inside the strip', () => {
    expect(fitStripStop({ ...base, intended: 10, name: [20, 60], card: [-40, 300] })).toBe(0);
    expect(fitStripStop({ ...base, maxScroll: 600, intended: 600, name: [700, 760], card: [800, 1100] })).toBe(600);
  });
});
