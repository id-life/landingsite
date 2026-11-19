/**
 * The player's touch areas (RWD-06) on a touch screen: each of its buttons is pressable over at least 44x44 px where
 * there is room, but a touch area only reaches into space that is nobody's. Inside the player's own pill the space is
 * the player's; beyond it, where another control (a field, a button, a link) is closer than the area would reach, the
 * area grows at most to half the gap, so a tap there still reaches that control. The pill sits over different
 * sections (a form on Connect, cards and arrows on Insights), so the room is measured where it stands.
 */
export type Box = { left: number; top: number; right: number; bottom: number };
export type Reach = { top: number; right: number; bottom: number; left: number };

const TARGET = 44;

/** How far beyond the pill's edge on one side the area may reach: half the gap to the nearest control there. */
function outsideRoom(side: keyof Reach, pill: Box, area: Box, others: Box[], viewport: { width: number; height: number }) {
  let room =
    side === 'top'
      ? pill.top
      : side === 'bottom'
        ? viewport.height - pill.bottom
        : side === 'left'
          ? pill.left
          : viewport.width - pill.right;
  for (const o of others) {
    const across =
      side === 'top' || side === 'bottom'
        ? o.left < area.right && o.right > area.left
        : o.top < area.bottom && o.bottom > area.top;
    if (!across) continue;
    // Only a control that reaches past the pill's edge on this side counts (one lying under the pill is covered by it);
    // the gap is from that edge to the control, 0 when the control reaches under the edge.
    const beyond =
      side === 'top'
        ? o.top < pill.top
        : side === 'bottom'
          ? o.bottom > pill.bottom
          : side === 'left'
            ? o.left < pill.left
            : o.right > pill.right;
    if (!beyond) continue;
    const gap =
      side === 'top'
        ? pill.top - o.bottom
        : side === 'bottom'
          ? o.top - pill.bottom
          : side === 'left'
            ? pill.left - o.right
            : o.left - pill.right;
    room = Math.min(room, Math.max(0, gap) / 2);
  }
  return Math.max(0, room);
}

/**
 * How far the touch area of `button` reaches past each of its edges. `pill` is the player's own box; `siblings` are
 * the player's other buttons (they share the pill: each takes half the gap between them); `others` every other
 * control on the page; the viewport is nobody's to its edges.
 */
export function tapReach(
  button: Box,
  pill: Box,
  siblings: Box[],
  others: Box[],
  viewport: { width: number; height: number },
): Reach {
  const needY = Math.max(0, TARGET - (button.bottom - button.top));
  const needX = Math.max(0, TARGET - (button.right - button.left));
  // Within the pill, up to its edge and up to half the way to a sibling button.
  const inPill = (side: keyof Reach) => {
    let room =
      side === 'top'
        ? button.top - pill.top
        : side === 'bottom'
          ? pill.bottom - button.bottom
          : side === 'left'
            ? button.left - pill.left
            : pill.right - button.right;
    for (const s of siblings) {
      const across =
        side === 'top' || side === 'bottom'
          ? s.left < button.right && s.right > button.left
          : s.top < button.bottom && s.bottom > button.top;
      if (!across) continue;
      const gap =
        side === 'top'
          ? button.top - s.bottom
          : side === 'bottom'
            ? s.top - button.bottom
            : side === 'left'
              ? button.left - s.right
              : s.left - button.right;
      if (gap >= 0) room = Math.min(room, gap / 2);
    }
    return Math.max(0, room);
  };
  const want = { top: needY / 2, bottom: needY / 2, left: needX / 2, right: needX / 2 };
  const area: Box = {
    left: button.left - want.left,
    right: button.right + want.right,
    top: button.top - want.top,
    bottom: button.bottom + want.bottom,
  };
  const limit = (side: keyof Reach) => {
    const inside = inPill(side);
    const touchesPillEdge =
      side === 'top'
        ? button.top - inside <= pill.top + 0.5
        : side === 'bottom'
          ? button.bottom + inside >= pill.bottom - 0.5
          : side === 'left'
            ? button.left - inside <= pill.left + 0.5
            : button.right + inside >= pill.right - 0.5;
    return touchesPillEdge ? inside + outsideRoom(side, pill, area, others, viewport) : inside;
  };
  const room = { top: limit('top'), bottom: limit('bottom'), left: limit('left'), right: limit('right') };
  // Share what one side cannot take with the opposite side, where there is room.
  const split = (need: number, a: number, b: number) => {
    const first = Math.min(need / 2, a);
    const second = Math.min(need - first, b);
    return [Math.min(first + Math.max(0, need - first - second), a), second] as const;
  };
  const [top, bottom] = split(needY, room.top, room.bottom);
  const [left, right] = split(needX, room.left, room.right);
  const r = (n: number) => Math.round(n * 10) / 10;
  return { top: r(top), bottom: r(bottom), left: r(left), right: r(right) };
}
