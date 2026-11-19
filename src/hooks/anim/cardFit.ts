/**
 * Where the phone map's strip stops for an open card (RWD: six of the thirteen cards reached past the window's edge,
 * on the original too, so half of them was out of sight).
 *
 * One pan: every card's own width is measured when the section is entered (copies drawn invisibly, without their
 * pictures, see the map's measure layer), so the pan that brings a point into view already ends where its card is
 * whole. The stop moves from where the strip would stop today only if the card or the point's place name is not whole
 * on the screen there:
 * - everything fits the window: the least move that leaves a margin (8 px, less when the card is nearly as wide as the
 *   window) on both sides;
 * - it does not fit: the point's drawn circle and its place name whole at the window's edge on their side (margin 0),
 *   so the card comes as far into the window as it goes on the other side; a point or its name is never cut (Berkeley's
 *   point had been 11 px off the screen with its name at the edge).
 * A card that is already whole where the strip stops today does not move at all.
 */

import { createContext } from 'react';

/** True inside the map's measure layer: pictures are drawn as empty boxes of their size, so nothing is fetched. */
export const CardMeasureContext = createContext(false);

/** The scale of an open map point (the dots' pointVariants), about its left edge. */
export const ACTIVE_DOT_SCALE = 1.2;

export type Span = readonly [number, number];
export type CardKind = 'meeting' | 'book' | 'sponsor';

export function fitStripStop({
  intended,
  viewport,
  name,
  card,
  maxScroll,
  margin = 8,
  point,
}: {
  /** Where the strip stops today (scrollLeft). */
  intended: number;
  /** The strip's visible width. */
  viewport: number;
  /** The place name's letters, in the strip's content coordinates. */
  name: Span;
  /** The point's drawn circle, in the strip's content coordinates (whole first, before the name and the card). */
  point?: Span;
  /** The card's letters, pictures and videos, in the strip's content coordinates. */
  card: Span;
  maxScroll: number;
  margin?: number;
}): number {
  // What must be whole, in order: the drawn point, then the place name; the card as far as it goes.
  const must: Span = point ? [Math.min(point[0], name[0]), Math.max(point[1], name[1])] : name;
  const left = Math.min(must[0], card[0]);
  const right = Math.max(must[1], card[1]);
  const clamp = (s: number) => Math.max(0, Math.min(maxScroll, s));
  // Whole where it stops today: no move.
  if (left - intended >= 0 && right - intended <= viewport) return clamp(intended);
  const width = right - left;
  if (width <= viewport) {
    const m = Math.max(0, Math.min(margin, (viewport - width) / 2));
    let s = intended;
    if (left - s < m) s = left - m;
    if (right - s > viewport - m) s = right - (viewport - m);
    return clamp(s);
  }
  // Too wide: the point and its place name whole at their edge, the card cut on the far side.
  const nameOnRight = (must[0] + must[1]) / 2 > (card[0] + card[1]) / 2;
  // Whole pixels outward, so a fraction of the point or of the name's last or first letter is never cut.
  return clamp(nameOnRight ? Math.ceil(must[1]) - viewport : Math.floor(must[0]));
}

/** The letters of an element's own text nodes (not its children's), as viewport rects. */
function ownLetters(el: Element): DOMRect[] {
  const out: DOMRect[] = [];
  for (const node of el.childNodes) {
    if (node.nodeType !== Node.TEXT_NODE || !node.textContent?.trim()) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    for (const r of range.getClientRects()) if (r.width > 0.5) out.push(r);
  }
  return out;
}

/** Every letter and picture box drawn inside an element, as viewport rects (a measure copy's pictures are boxes). */
function drawn(el: Element): DOMRect[] {
  const out: DOMRect[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.textContent?.trim()) continue;
    const range = document.createRange();
    range.selectNodeContents(n);
    for (const r of range.getClientRects()) if (r.width > 0.5) out.push(r);
  }
  for (const m of el.querySelectorAll('img, video, [data-card-picture]')) {
    const r = m.getBoundingClientRect();
    if (r.width > 2) out.push(r);
  }
  return out;
}

const span = (rects: DOMRect[]): Span | null =>
  rects.length ? [Math.min(...rects.map((r) => r.left)), Math.max(...rects.map((r) => r.right))] : null;

// ------------------------------------------------------------------ the cards, measured at section entry
const cardSpans = new Map<string, Span>();
/** Each card's boxes that take a tap (pointer-events not none), grown in: [left, top, right, bottom], card layer px. */
const cardHits = new Map<string, (readonly [number, number, number, number])[]>();
let measuresVersion = 0;
let measureRequested = false;
let waiting: (() => void)[] = [];
const requestListeners = new Set<() => void>();

export const cardKey = (kind: CardKind, index: number) => `${kind}-${index}`;

/** Asks the map to measure every card (its measure layer); resolves once the widths are in. */
export function measureCards(): Promise<void> {
  return new Promise((resolve) => {
    waiting.push(resolve);
    if (measureRequested) return;
    measureRequested = true;
    requestListeners.forEach((listener) => listener());
  });
}
/** The map's view of the request (useSyncExternalStore). */
export const onMeasureRequest = (listener: () => void) => {
  requestListeners.add(listener);
  return () => void requestListeners.delete(listener);
};
export const measureIsRequested = () => measureRequested;
/** Changes whenever the cards have been measured again (useSyncExternalStore with onMeasureRequest). */
export const cardMeasuresVersion = () => measuresVersion;
/** The boxes of a card that take a tap, as the card stands when grown in, in the card layer's own coordinates. */
export const cardHitBoxes = (kind: CardKind, index: number) => cardHits.get(cardKey(kind, index));

/**
 * Called by the map with its measure layer drawn (the copies stand grown in: their grow-in does not run): each copy's
 * letters and picture boxes, and the boxes that take a tap, in the strip's content coordinates (the layer is not moved
 * by the strip's scroll, so its own corner is the content's origin).
 */
export function takeCardMeasures(layer: HTMLElement) {
  const box = layer.getBoundingClientRect();
  cardSpans.clear();
  cardHits.clear();
  for (const copy of layer.querySelectorAll<HTMLElement>('[data-card-key]')) {
    const key = copy.dataset.cardKey ?? '';
    const s = span(drawn(copy));
    if (s) cardSpans.set(key, [s[0] - box.left, s[1] - box.left]);
    const hits: (readonly [number, number, number, number])[] = [];
    for (const e of [copy, ...copy.querySelectorAll('*')]) {
      const r = e.getBoundingClientRect();
      if (r.width === 0 || r.height === 0 || getComputedStyle(e).pointerEvents === 'none') continue;
      // Cut by every box above it in the card that clips (the meetings' scrolling photo list).
      let [l, t, rr, b] = [r.left, r.top, r.right, r.bottom];
      for (let q = e.parentElement; q && copy.contains(q); q = q.parentElement) {
        const cs = getComputedStyle(q);
        if (cs.overflowX === 'visible' && cs.overflowY === 'visible') continue;
        const c = q.getBoundingClientRect();
        [l, t, rr, b] = [Math.max(l, c.left), Math.max(t, c.top), Math.min(rr, c.right), Math.min(b, c.bottom)];
      }
      if (rr > l && b > t) hits.push([l - box.left, t - box.top, rr - box.left, b - box.top]);
    }
    cardHits.set(key, hits);
  }
  measuresVersion += 1;
  measureRequested = false;
  requestListeners.forEach((listener) => listener());
  const done = waiting;
  waiting = [];
  done.forEach((resolve) => resolve());
}

/**
 * The stop for a point's card: where the strip would stop today (`intended`), moved only as far as the card and the
 * point and its place name need to be whole. The point's circle and its place name are read from the point as it is
 * (at its present scale, taken to the open scale about its left edge); the card from the entry's measures. Without a
 * measure, `intended`.
 */
export function fittedStop(kind: CardKind, index: number, dot: HTMLElement, scroller: HTMLElement, intended: number) {
  const maxScroll = scroller.scrollWidth - scroller.clientWidth;
  const card = cardSpans.get(cardKey(kind, index));
  const label = dot.querySelector('.map-label');
  const nameSpan = label ? span(ownLetters(label)) : null;
  if (!card || !nameSpan) return Math.max(0, Math.min(maxScroll, intended));
  const dotBox = dot.getBoundingClientRect();
  const now = dot.offsetWidth && dotBox.width ? dotBox.width / dot.offsetWidth : 1;
  const dotLeft = parseFloat(dot.style.left) || 0;
  const toRest = (x: number) => dotLeft + ((x - dotBox.left) / now) * ACTIVE_DOT_SCALE;
  const name: Span = [toRest(nameSpan[0]), toRest(nameSpan[1])];
  const circle = dot.querySelector('svg circle')?.getBoundingClientRect();
  const point: Span | undefined = circle && circle.width > 0 ? [toRest(circle.left), toRest(circle.right)] : undefined;
  return fitStripStop({ intended, viewport: scroller.clientWidth, name, point, card, maxScroll });
}
