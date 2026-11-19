// A small control's touch area reaches only into space that is nobody's: towards 44 px around its box, and towards a
// neighbouring control at most to the middle of the gap, so two close controls never take each other's taps.
import { describe, expect, test } from 'vitest';
import { fitTapArea } from '@/utils/tap-area-fit';

const box = (left, top, w, h) => ({ left, top, right: left + w, bottom: top + h });
const reach = (b, g) => ({ left: b.left - g.left, top: b.top - g.top, right: b.right + g.right, bottom: b.bottom + g.bottom });
const overlaps = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

describe('fitTapArea', () => {
  test('alone, a 24 px control grows 10 px on every side, to 44 px', () => {
    expect(fitTapArea(box(100, 100, 24, 24), [])).toEqual({ left: 10, top: 10, right: 10, bottom: 10 });
  });

  test('a control of 44 px or more does not grow', () => {
    expect(fitTapArea(box(0, 0, 60, 44), [box(70, 0, 20, 20)])).toEqual({ left: 0, top: 0, right: 0, bottom: 0 });
  });

  test('three logos 6 px apart: each takes 3 px towards the next, and no two areas meet', () => {
    const logos = [box(0, 0, 24, 24), box(30, 0, 24, 24), box(60, 0, 24, 24)];
    const grown = logos.map((b, i) =>
      fitTapArea(
        b,
        logos.filter((_, j) => j !== i),
      ),
    );
    expect(grown[0]).toEqual({ left: 10, top: 10, right: 3, bottom: 10 });
    expect(grown[1]).toEqual({ left: 3, top: 10, right: 3, bottom: 10 });
    expect(grown[2]).toEqual({ left: 3, top: 10, right: 10, bottom: 10 });
    const areas = logos.map((b, i) => reach(b, grown[i]));
    expect(overlaps(areas[0], areas[1]) || overlaps(areas[1], areas[2])).toBe(false);
  });

  test('two 30 px logos 8 px apart: each grows 4 px towards the other, not the 7 px that would reach 44', () => {
    const a = box(0, 0, 30, 30);
    const b = box(38, 0, 30, 30);
    const ga = fitTapArea(a, [b]);
    const gb = fitTapArea(b, [a]);
    expect(ga.right).toBe(4);
    expect(gb.left).toBe(4);
    expect(ga.left).toBe(7);
    expect(overlaps(reach(a, ga), reach(b, gb))).toBe(false);
  });

  test('a neighbour further than twice the growth limits nothing', () => {
    expect(fitTapArea(box(0, 0, 30, 30), [box(45, 0, 30, 30)])).toEqual({ left: 7, top: 7, right: 7, bottom: 7 });
  });

  test('a card 8 px below: the area stops 4 px short of it; above, it still grows', () => {
    const logo = box(0, 0, 24, 24);
    const card = box(-50, 32, 300, 120);
    const grown = fitTapArea(logo, [card]);
    expect(grown.bottom).toBe(4);
    expect(grown.top).toBe(10);
    expect(overlaps(reach(logo, grown), card)).toBe(false);
  });

  test('a neighbour off a corner limits the side it is further along', () => {
    const grown = fitTapArea(box(0, 0, 24, 24), [box(30, 28, 20, 20)]);
    expect(grown.right).toBe(3);
    expect(grown.bottom).toBe(10);
  });

  test('a neighbour overlapping the box itself limits nothing', () => {
    expect(fitTapArea(box(0, 0, 24, 24), [box(10, 10, 40, 40)])).toEqual({ left: 10, top: 10, right: 10, bottom: 10 });
  });
});
