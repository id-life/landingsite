import { useEffect, type RefObject } from 'react';
import { COMPACT_HEIGHT_QUERY } from '@/styles/device-classes';

/** Gap between a label moved to the left of its dot and the dot (px). */
const GAP = 2;
/** After a change the rule runs every frame for this long, while a card and its badges animate in (DURATION.base). */
const FOLLOW_MS = 600;

type Box = { left: number; top: number; right: number; bottom: number };
const box = (e: Element): Box => {
  const r = e.getBoundingClientRect();
  return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
};
const hits = (a: Box, b: Box) => a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1;
const shown = (e: Element) => {
  const r = e.getBoundingClientRect();
  return r.width > 1 && r.height > 1;
};

const POINTS = '.world-map-dot, .world-map-dot-book, .world-map-dot-sponsor';
/** An open card's text, photos, logos and clips (event, book or sponsor), which the labels must not run into. */
const CARD_TEXT = ['h3', 'h4', 'p', 'img', 'video'].map((t) => `[class*="dot-content-"] ${t}`).join(', ');

/**
 * The phone map's label rule at compact heights (a phone in landscape, a 720x450 window: RWD-02 A3). The strip is
 * then 190-250 px tall, the whole world about 400-530 px wide, and the European cities sit a few pixels apart, so
 * labels at their 12 px floor ran into each other. Instead of shrinking text, each label takes a side:
 * 1. the open dot (its label, badges and Talk link) and the open card (its text, photos and logos) are placed first
 *    and never move;
 * 2. every other label, in data order (meetings, books, sponsors), takes the first free place among: right of its dot
 *    (the original), left of it, a line above or below on the right, then on the left; with none free it is hidden
 *    until its dot is tapped (an open dot always shows its label).
 * The dots themselves always show and stay tappable. Taller windows are left exactly as they were.
 *
 * mode 'desktop' (the scrolled deck's full map): nothing is hidden or moved, except a label that would run past the
 * window's edge, which takes the other side of its dot. 'pan' (the sideways-panning strip of portrait tablets): the
 * same against the strip's visible edges, again as the visitor pans, so no label is cut at rest where the strip ends.
 */
export function useCompactLabelRule(
  rootRef: RefObject<HTMLElement | null>,
  deps: readonly unknown[],
  mode: 'phone' | 'desktop' | 'pan' = 'phone',
  /** 'pan': the scroller whose visible box the labels must stay inside. */
  boundsRef?: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mq = window.matchMedia(COMPACT_HEIGHT_QUERY);

    const reset = (label: HTMLElement) => {
      label.style.removeProperty('position');
      label.style.removeProperty('left');
      label.style.removeProperty('top');
      label.style.removeProperty('align-items');
      label.style.removeProperty('visibility');
    };

    const run = () => {
      const points = [...root.querySelectorAll<HTMLElement>(POINTS)];
      const labels = points.map((p) => p.querySelector<HTMLElement>('.map-label'));
      labels.forEach((l) => l && reset(l));
      // Phone deck at compact heights: no two labels collide. Desktop deck (not the panning strip): a label that
      // would run past the window's right edge takes the left of its dot instead (it was cut at 1180 px, where the
      // label's type role is larger than the original's scaled 10 px). Otherwise labels stay exactly as designed.
      const collide = mode === 'phone' && mq.matches;
      const edge = mode === 'desktop' || mode === 'pan';
      const frame0 = mode === 'pan' && boundsRef?.current ? box(boundsRef.current) : null;
      const minX = frame0 ? frame0.left : 0;
      const maxX = frame0 ? frame0.right : innerWidth;
      if (!collide && !edge) return;

      const placed: Box[] = [...root.querySelectorAll(CARD_TEXT)].filter(shown).map(box);
      const active = points.filter((p) => p.dataset.active === 'true');
      for (const p of active) {
        const label = p.querySelector<HTMLElement>('.map-label');
        if (!label) continue;
        placed.push(box(label), ...[...label.querySelectorAll('*')].filter(shown).map(box));
      }
      points.forEach((p, i) => {
        const label = labels[i];
        const dot = p.querySelector('.pulse-dot');
        if (!label || !dot || p.dataset.active === 'true' || !shown(label)) return;
        const right = box(label);
        const d = box(dot);
        const pr = box(p);
        const w = right.right - right.left;
        const h = right.bottom - right.top;
        const leftX = d.left - GAP - w;
        // Candidate places, in order: right of the dot (the original), left of it, then a line above or below on
        // either side.
        const candidates: [number, number][] = [
          [right.left, right.top],
          [leftX, right.top],
          [right.left, right.top - h],
          [right.left, right.top + h],
          [leftX, right.top - h],
          [leftX, right.top + h],
        ];
        const inView = (b: Box) => !edge || (b.left >= minX + 2 && b.right <= maxX - 2);
        for (const [x, y] of candidates) {
          const b: Box = { left: x, top: y, right: x + w, bottom: y + h };
          if ((collide && placed.some((o) => hits(o, b))) || !inView(b)) continue;
          if (x !== right.left || y !== right.top) {
            label.style.position = 'absolute';
            label.style.left = `${x - pr.left}px`;
            label.style.top = `${y - pr.top}px`;
            if (x === leftX) label.style.alignItems = 'flex-end';
          }
          placed.push(b);
          return;
        }
        // Compact mode hides a label with no free place until its dot is tapped. Edge mode hides only a label that fits
        // on neither side yet reaches into view: on the panning strip, the label of a dot just past the visible edge.
        if (collide || (right.right > minX && right.left < maxX)) label.style.visibility = 'hidden';
      });
    };

    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      const until = performance.now() + FOLLOW_MS;
      const step = () => {
        run();
        if (performance.now() < until) frame = requestAnimationFrame(step);
      };
      step();
    };
    schedule();
    mq.addEventListener('change', schedule);
    window.addEventListener('resize', schedule);
    // The panning strip: labels take their side again for the part of the map in view.
    const scroller = mode === 'pan' ? boundsRef?.current : null;
    let scrollFrame = 0;
    const onScroll = () => {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(run);
    };
    scroller?.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(scrollFrame);
      scroller?.removeEventListener('scroll', onScroll);
      mq.removeEventListener('change', schedule);
      window.removeEventListener('resize', schedule);
      root
        .querySelectorAll<HTMLElement>(
          `${POINTS.split(', ')
            .map((s) => `${s} .map-label`)
            .join(', ')}`,
        )
        .forEach(reset);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
