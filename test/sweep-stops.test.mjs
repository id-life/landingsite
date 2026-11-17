// MOT-01: a far jump on the desktop deck passes through every section rest between the view and the destination,
// in the order of travel, so the scrubbed timelines that share the theme, the dotted background and the hero
// canvas are taken back one neighbour range at a time, as by scrolling (from Connect, MISSION landed on a black
// first screen when they were all taken back in one update).
import { describe, expect, test } from 'vitest';
import { sweepStops } from '@/motion/sweepStops';

// The rests of the seven sections at 1440x900 on the build that showed the defect (Mission .. Connect), as measured.
const RESTS = [0, 3891, 6600, 11850, 14167, 18810, 21240];

describe('sweepStops', () => {
  test('going up from Connect to Mission stops at every rest on the way, nearest first', () => {
    expect(sweepStops(21240, 0, RESTS)).toEqual([18810, 14167, 11850, 6600, 3891, 0]);
  });

  test('going down from Mission to Connect stops at every rest on the way, in page order', () => {
    expect(sweepStops(0, 21240, RESTS)).toEqual([3891, 6600, 11850, 14167, 18810, 21240]);
  });

  test('a neighbour, or a jump to where the view already is, is one step', () => {
    expect(sweepStops(3891, 6600, RESTS)).toEqual([6600]);
    expect(sweepStops(6600, 3891, RESTS)).toEqual([3891]);
    expect(sweepStops(6600, 6600, RESTS)).toEqual([6600]);
  });

  test('from off a rest (the footer below Connect, an interrupted step) the stops start at the next rest', () => {
    expect(sweepStops(22000, 6600, RESTS)).toEqual([21240, 18810, 14167, 11850, 6600]);
    expect(sweepStops(5000, 14167, RESTS)).toEqual([6600, 11850, 14167]);
    expect(sweepStops(5000, 0, RESTS)).toEqual([3891, 0]);
  });

  test('a rest within the tolerance of either end is not a stop of its own', () => {
    expect(sweepStops(21240.4, 11850, RESTS)).toEqual([18810, 14167, 11850]);
    expect(sweepStops(0, 3891.5, RESTS)).toEqual([3891.5]);
  });

  test('order of the rests given does not matter, duplicates and non-finite values are ignored', () => {
    expect(sweepStops(21240, 0, [14167, 0, 3891, NaN, 18810, 3891, 21240, 6600, 11850])).toEqual([
      18810, 14167, 11850, 6600, 3891, 0,
    ]);
  });
});
