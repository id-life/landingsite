import { RefObject, useEffect } from 'react';
import { COARSE_POINTER_QUERY } from '@/styles/device-classes';
import { tapReach, type Box } from './tapRoom';

const CONTROLS = 'a[href], button, input:not([type=hidden]), textarea, select, [role="button"], [role="link"], [role="tab"]';
const box = (r: DOMRect): Box => ({ left: r.left, top: r.top, right: r.right, bottom: r.bottom });

/**
 * Sizes the touch areas of the player's buttons (marked `player-tap`) to the room around the pill (tapRoom.ts), on
 * touch screens only. The pill stays where it is while the sections change under it, so the room is measured again
 * twice a second while the page is visible, and on every resize.
 */
export function usePlayerTapAreas(pillRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const coarse = window.matchMedia(COARSE_POINTER_QUERY);
    let timer = 0;
    const measure = () => {
      const pill = pillRef.current;
      if (!pill || !coarse.matches || document.hidden) return;
      const buttons = [...pill.querySelectorAll<HTMLElement>('.player-tap')];
      if (!buttons.length) return;
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
      buttons.forEach((b, i) => {
        const reach = tapReach(
          boxes[i],
          pillBox,
          boxes.filter((_, j) => j !== i),
          others,
          { width: innerWidth, height: innerHeight },
        );
        b.style.setProperty('--tap-t', `${reach.top}px`);
        b.style.setProperty('--tap-r', `${reach.right}px`);
        b.style.setProperty('--tap-b', `${reach.bottom}px`);
        b.style.setProperty('--tap-l', `${reach.left}px`);
      });
    };
    const start = () => {
      window.clearInterval(timer);
      if (!coarse.matches) return;
      measure();
      timer = window.setInterval(measure, 500);
    };
    start();
    window.addEventListener('resize', measure);
    document.addEventListener('visibilitychange', measure);
    coarse.addEventListener('change', start);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('resize', measure);
      document.removeEventListener('visibilitychange', measure);
      coarse.removeEventListener('change', start);
    };
  }, [pillRef]);
}
