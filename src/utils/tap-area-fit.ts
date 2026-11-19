/**
 * The touch area of a small control (RWD-06) reaches only into space that is nobody's: it grows towards 44 px around
 * the control's own box, and towards a neighbouring control at most to the middle of the gap between them, so where two
 * controls stand closer than 44 px each takes half of what lies between and neither reaches into the other.
 */

export type Box = { left: number; top: number; right: number; bottom: number };
export type Growth = { left: number; top: number; right: number; bottom: number };

export const TAP_GOAL = 44;

/**
 * How far the touch area of `box` reaches past each of its edges, given the boxes of the controls around it. A
 * neighbour closer than twice the growth on a side (so that its own area, growing the same way, could meet this one)
 * limits that side to half the gap; the side is the axis with the widest gap between the two boxes (a neighbour
 * diagonally off a corner limits the side it is further along). A neighbour that overlaps the box itself limits nothing.
 */
export function fitTapArea(box: Box, others: Box[], goal = TAP_GOAL): Growth {
  const growX = Math.max(0, (goal - (box.right - box.left)) / 2);
  const growY = Math.max(0, (goal - (box.bottom - box.top)) / 2);
  const grow: Growth = { left: growX, top: growY, right: growX, bottom: growY };
  // A cut on one side narrows the area, which can free a neighbour on another side: repeat until nothing changes.
  for (let pass = 0; pass < 4; pass++) {
    let changed = false;
    for (const other of others) {
      // Twice the growth: the neighbour's area grows towards this one by as much.
      const area = {
        left: box.left - 2 * grow.left,
        top: box.top - 2 * grow.top,
        right: box.right + 2 * grow.right,
        bottom: box.bottom + 2 * grow.bottom,
      };
      const touches = other.left < area.right && other.right > area.left && other.top < area.bottom && other.bottom > area.top;
      if (!touches) continue;
      const gaps: [keyof Growth, number][] = [
        ['right', other.left - box.right],
        ['left', box.left - other.right],
        ['bottom', other.top - box.bottom],
        ['top', box.top - other.bottom],
      ];
      const [side, gap] = gaps.reduce((a, b) => (b[1] > a[1] ? b : a));
      if (gap < 0) continue;
      const limit = gap / 2;
      if (grow[side] > limit) {
        grow[side] = limit;
        changed = true;
      }
    }
    if (!changed) break;
  }
  return grow;
}
