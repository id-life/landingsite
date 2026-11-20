import { RefObject, useEffect } from 'react';
import { jotaiStore } from '@/atoms';
import { sectionStateAtom } from '@/motion/sectionController';
import { onInnerPageChange } from '@/motion/innerPages';
import { COARSE_POINTER_QUERY } from '@/styles/device-classes';
import { tapReach, type Box } from './tapRoom';

const CONTROLS = 'a[href], button, input:not([type=hidden]), textarea, select, [role="button"], [role="link"], [role="tab"]';
const box = (r: DOMRect): Box => ({ left: r.left, top: r.top, right: r.right, bottom: r.bottom });
/**
 * The part of a control a finger can actually reach beside the pill, or null: its box cut by every ancestor that clips
 * its overflow (a card of a paged list runs on below its page, unseen), then tested where it is nearest the pill, outside
 * the pill: if something else is on top there (another layer, the page's frame), the control is not reachable there.
 */
function reachablePart(el: Element, r: DOMRect, pill: Box, pillEl: Element): Box | null {
  let part: Box = box(r);
  for (let k = el.parentElement; k && k !== document.documentElement; k = k.parentElement) {
    const cs = getComputedStyle(k);
    if (cs.overflowX === 'visible' && cs.overflowY === 'visible') continue;
    const c = k.getBoundingClientRect();
    part = {
      left: Math.max(part.left, c.left),
      top: Math.max(part.top, c.top),
      right: Math.min(part.right, c.right),
      bottom: Math.min(part.bottom, c.bottom),
    };
    if (part.right - part.left < 1 || part.bottom - part.top < 1) return null;
  }
  // Points of that part just outside each edge of the pill (where a touch area would reach), and its centre.
  const inPart = (x: number, y: number) => x > part.left && x < part.right && y > part.top && y < part.bottom;
  const midX = Math.min(Math.max((pill.left + pill.right) / 2, part.left + 1), part.right - 1);
  const midY = Math.min(Math.max((pill.top + pill.bottom) / 2, part.top + 1), part.bottom - 1);
  const points = [
    [midX, pill.top - 2],
    [midX, pill.bottom + 2],
    [pill.left - 2, midY],
    [pill.right + 2, midY],
    [(part.left + part.right) / 2, (part.top + part.bottom) / 2],
  ].filter(([x, y]) => inPart(x, y) && !(x >= pill.left && x <= pill.right && y >= pill.top && y <= pill.bottom));
  // Nothing of it outside the pill near its edges: the pill covers what there is of it.
  if (!points.length) return null;
  return points.some(([x, y]) => {
    // The topmost thing there other than the player itself (its own touch areas must not hide a neighbour).
    const hit = document.elementsFromPoint(x, y).find((e) => !pillEl.contains(e));
    return !!hit && (hit === el || el.contains(hit));
  })
    ? part
    : null;
}

/**
 * A change has settled when what is around the player (its own box and every reachable neighbour, to the pixel) has
 * not moved for this many frames; a section's or card's entrance can ease out slowly. Never longer than MAX_FRAMES.
 */
const STABLE_FRAMES = 10;
const MAX_FRAMES = 120;

/**
 * Sizes the touch areas of the player's buttons (marked `player-tap`) to the room around the pill (tapRoom.ts), on
 * touch screens only. Measured only when what is around the player can change: once at mount; when a section move
 * ends; when an inner page changes; on a resize or rotation (a change of version mounts the player again); when the
 * playlist opens or closes; when fonts finish loading; and when a control comes into or leaves the strip around the
 * player (an IntersectionObserver on that strip: content that arrives after its section settled, such as Connect's
 * form, or a box that slides in). After each of these the room is measured frame by frame until it has stopped
 * changing, then nothing runs until the next change.
 */
export function usePlayerTapAreas(pillRef: RefObject<HTMLElement | null>, playlistOpen: boolean) {
  useEffect(() => {
    const coarse = window.matchMedia(COARSE_POINTER_QUERY);
    let frame = 0;
    let lastKey = '';

    /** One measurement; returns a key of what it saw (the boxes around the player), so a settle can tell when it stops. */
    const measure = () => {
      const pill = pillRef.current;
      if (!pill || !coarse.matches) return '';
      performance.mark('player-tap-measure');
      const buttons = [...pill.querySelectorAll<HTMLElement>('.player-tap')];
      if (!buttons.length) return '';
      const pillBox = box(pill.getBoundingClientRect());
      const others: Box[] = [];
      for (const el of document.querySelectorAll<HTMLElement>(CONTROLS)) {
        if (pill.contains(el)) continue;
        const r = el.getBoundingClientRect();
        if (r.width <= 0 || r.height <= 0 || r.bottom < 0 || r.top > innerHeight) continue;
        // Only controls near enough to matter (a touch area never reaches 44 px past the pill).
        if (
          r.right < pillBox.left - 44 ||
          r.left > pillBox.right + 44 ||
          r.bottom < pillBox.top - 44 ||
          r.top > pillBox.bottom + 44
        )
          continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.pointerEvents === 'none') continue;
        const reachable = reachablePart(el, r, pillBox, pill);
        if (reachable) others.push(reachable);
      }
      const boxes = buttons.map((b) => box(b.getBoundingClientRect()));
      const px = (b: Box) => `${Math.round(b.left)},${Math.round(b.top)},${Math.round(b.right)},${Math.round(b.bottom)}`;
      let key = `${px(pillBox)}|${others.map(px).join('|')}|`;
      buttons.forEach((b, i) => {
        const reach = tapReach(
          boxes[i],
          pillBox,
          boxes.filter((_, j) => j !== i),
          others,
          { width: innerWidth, height: innerHeight },
        );
        key += `${reach.top},${reach.right},${reach.bottom},${reach.left};`;
        b.style.setProperty('--tap-t', `${reach.top}px`);
        b.style.setProperty('--tap-r', `${reach.right}px`);
        b.style.setProperty('--tap-b', `${reach.bottom}px`);
        b.style.setProperty('--tap-l', `${reach.left}px`);
      });
      return key;
    };

    /** Measure now and on each frame after until the room has not changed for STABLE_FRAMES frames. */
    const settle = () => {
      cancelAnimationFrame(frame);
      if (!coarse.matches) return;
      let same = 0;
      let count = 0;
      lastKey = measure();
      const step = () => {
        const key = measure();
        same = key === lastKey ? same + 1 : 0;
        lastKey = key;
        count += 1;
        if (same < STABLE_FRAMES && count < MAX_FRAMES) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    };

    // The strip a touch area could reach: the pill and 44 px around it. Controls entering or leaving it start a settle.
    // A control added to the page later is observed when it arrives (a MutationObserver on added nodes only).
    let strip: IntersectionObserver | null = null;
    const watched = new WeakSet<Element>();
    const watch = (root: ParentNode) => {
      if (!strip) return;
      const pill = pillRef.current;
      for (const el of root.querySelectorAll(CONTROLS)) {
        if (watched.has(el) || pill?.contains(el)) continue;
        watched.add(el);
        strip.observe(el);
      }
    };
    const buildStrip = () => {
      strip?.disconnect();
      strip = null;
      const pill = pillRef.current;
      if (!pill || !coarse.matches || typeof IntersectionObserver === 'undefined') return;
      const r = pill.getBoundingClientRect();
      const margin = [r.top - 44, innerWidth - r.right - 44, innerHeight - r.bottom - 44, r.left - 44]
        .map((n) => `${-Math.max(0, Math.floor(n))}px`)
        .join(' ');
      // A settle only when what is in the strip changes, compared by what a control is and where (its name and box),
      // not by element: a section that re-renders the same control in the same place (one that keeps replacing it at
      // rest) changes nothing, nor does a control added or removed elsewhere on the page.
      const inStrip = new Map<Element, string>();
      let lastSet = '';
      let reported = false;
      strip = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting && e.target.isConnected) {
              const r = e.boundingClientRect;
              const name = e.target.getAttribute('aria-label') ?? e.target.textContent?.slice(0, 40) ?? '';
              inStrip.set(
                e.target,
                `${name}|${Math.round(r.left)},${Math.round(r.top)},${Math.round(r.width)},${Math.round(r.height)}|${Math.round(e.intersectionRatio * 4)}`,
              );
            } else inStrip.delete(e.target);
          }
          for (const el of inStrip.keys()) if (!el.isConnected) inStrip.delete(el);
          const set = [...inStrip.values()].sort().join(';');
          // The first report lists what is already there (the mount's own settle measured it).
          if (!reported) {
            reported = true;
            lastSet = set;
            return;
          }
          if (set === lastSet) return;
          lastSet = set;
          settle();
        },
        { rootMargin: margin, threshold: [0, 0.25, 0.5, 0.75, 1] },
      );
      for (const el of [...document.querySelectorAll(CONTROLS)]) if (!pill.contains(el)) strip.observe(el);
    };
    const added = new MutationObserver((records) => {
      for (const record of records)
        for (const node of record.addedNodes)
          if (node instanceof Element) {
            if (node.matches(CONTROLS) && !watched.has(node)) {
              watched.add(node);
              strip?.observe(node);
            }
            watch(node);
          }
    });
    added.observe(document.body, { childList: true, subtree: true });
    const onResize = () => {
      buildStrip();
      settle();
    };

    buildStrip();
    settle();
    const offSection = jotaiStore.sub(sectionStateAtom, () => {
      if (jotaiStore.get(sectionStateAtom).phase === 'idle') settle();
    });
    const offInner = onInnerPageChange(() => settle());
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    coarse.addEventListener('change', onResize);
    document.fonts?.addEventListener?.('loadingdone', settle);
    void document.fonts?.ready.then(settle);
    return () => {
      cancelAnimationFrame(frame);
      offSection();
      offInner();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      coarse.removeEventListener('change', onResize);
      strip?.disconnect();
      added.disconnect();
      document.fonts?.removeEventListener?.('loadingdone', settle);
    };
  }, [pillRef, playlistOpen]);
}
