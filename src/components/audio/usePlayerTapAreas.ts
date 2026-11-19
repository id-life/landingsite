import { RefObject, useEffect } from 'react';
import { jotaiStore } from '@/atoms';
import { sectionStateAtom } from '@/motion/sectionController';
import { onInnerPageChange } from '@/motion/innerPages';
import { COARSE_POINTER_QUERY } from '@/styles/device-classes';
import { tapReach, type Box } from './tapRoom';

const CONTROLS = 'a[href], button, input:not([type=hidden]), textarea, select, [role="button"], [role="link"], [role="tab"]';
const box = (r: DOMRect): Box => ({ left: r.left, top: r.top, right: r.right, bottom: r.bottom });
/** A change settles when the room has been the same for this many frames; never longer than MAX_FRAMES. */
const STABLE_FRAMES = 3;
const MAX_FRAMES = 60;

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

    /** One measurement; returns a key of the result, so a settling change can tell when it has stopped. */
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
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.pointerEvents === 'none') continue;
        others.push(box(r));
      }
      const boxes = buttons.map((b) => box(b.getBoundingClientRect()));
      let key = '';
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
      let first = true;
      strip = new IntersectionObserver(
        () => {
          // The first callback reports every observed control once; the mount's own settle covers it.
          if (first) first = false;
          else settle();
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
