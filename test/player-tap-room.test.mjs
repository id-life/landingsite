// RWD-06: the music player's touch areas reach only into space that is nobody's (src/components/audio/tapRoom.ts).
import { describe, expect, test } from 'vitest';
import { tapReach } from '@/components/audio/tapRoom';

const vp = { width: 820, height: 1180 };
// The phone deck's pill at 820x1180 (measured): play 680..745 x 1106..1134, playlist 763..790, the pill around them.
const pill = { left: 672, top: 1103, right: 798, bottom: 1137 };
const play = { left: 680, top: 1106, right: 745, bottom: 1134 };
const list = { left: 763, top: 1106, right: 790, bottom: 1134 };

describe('the player buttons reach no other control', () => {
  test('nothing near: 44 px tall, centred', () => {
    const r = tapReach(play, pill, [list], [], vp);
    expect(r.top + r.bottom + (play.bottom - play.top)).toBe(44);
    expect(r.top).toBe(8);
  });
  test('a field touching the pill from above (Connect): nothing above the pill, the rest below', () => {
    const field = { left: 668, top: 1047, right: 791, bottom: 1107 };
    const r = tapReach(play, pill, [list], [field], vp);
    expect(play.top - r.top).toBeGreaterThanOrEqual(pill.top);
    expect(r.top + r.bottom + 28).toBe(44);
  });
  test('a control 20 px above the pill: the area reaches at most 10 px past the pill', () => {
    const other = { left: 660, top: 1050, right: 800, bottom: 1083 };
    const r = tapReach(play, pill, [list], [other], vp);
    expect(play.top - r.top).toBeGreaterThanOrEqual(pill.top - 10);
  });
  test('the two buttons share the gap between them', () => {
    const a = tapReach(play, pill, [list], [], vp);
    const b = tapReach(list, pill, [play], [], vp);
    expect(play.right + a.right).toBeLessThanOrEqual(list.left - b.left);
  });
  test('a control under the pill (a card it lies over): the area stays inside the pill', () => {
    const card = { left: 418, top: 1033, right: 792, bottom: 1137 };
    const r = tapReach(play, pill, [list], [card], vp);
    expect(play.top - r.top).toBeGreaterThanOrEqual(pill.top);
    expect(play.left - r.left).toBeGreaterThanOrEqual(pill.left);
  });
});
