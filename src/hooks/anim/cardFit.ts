/**
 * Where the phone map's strip stops for an open card (RWD: six of the thirteen cards reached past the window's edge,
 * on the original too, so half of them was out of sight).
 *
 * The tour and a tap pan the strip to the point (its own offset, MOBILE_DOT_SHOW_ORDER). Once the card is open its own
 * box is read, and the stop is moved only if the card or the point's place name is not whole on the screen there:
 * - everything fits the window: the least move that leaves a margin (8 px, less when the card is nearly as wide as the
 *   window) on both sides;
 * - it does not fit: the place name whole at the window's edge on its side (margin 0), so the card comes as far into
 *   the window as it goes on the other side; a place name is never cut.
 * A card that is already whole where the strip stops today does not move at all.
 */

/** The scale of an open map point (the dots' pointVariants), about its left edge. */
export const ACTIVE_DOT_SCALE = 1.2;

export type Span = readonly [number, number];

export function fitStripStop({
  intended,
  viewport,
  name,
  card,
  maxScroll,
  margin = 8,
}: {
  /** Where the strip stops today (scrollLeft). */
  intended: number;
  /** The strip's visible width. */
  viewport: number;
  /** The place name's letters, in the strip's content coordinates. */
  name: Span;
  /** The card's letters, pictures and videos, in the strip's content coordinates. */
  card: Span;
  maxScroll: number;
  margin?: number;
}): number {
  const left = Math.min(name[0], card[0]);
  const right = Math.max(name[1], card[1]);
  const clamp = (s: number) => Math.max(0, Math.min(maxScroll, s));
  // Whole where it stops today: no move.
  if (left - intended >= 0 && right - intended <= viewport) return intended;
  const width = right - left;
  if (width <= viewport) {
    const m = Math.max(0, Math.min(margin, (viewport - width) / 2));
    let s = intended;
    if (left - s < m) s = left - m;
    if (right - s > viewport - m) s = right - (viewport - m);
    return clamp(s);
  }
  // Too wide: the place name whole at its edge, the card cut on the far side.
  const nameOnRight = (name[0] + name[1]) / 2 > (card[0] + card[1]) / 2;
  // Whole pixels outward, so a fraction of the name's last or first letter is never cut.
  return clamp(nameOnRight ? Math.ceil(name[1]) - viewport : Math.floor(name[0]));
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

/** Every letter, picture and video drawn inside an element, as viewport rects. */
function drawn(el: Element): DOMRect[] {
  const out: DOMRect[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (!n.textContent?.trim()) continue;
    const range = document.createRange();
    range.selectNodeContents(n);
    for (const r of range.getClientRects()) if (r.width > 0.5) out.push(r);
  }
  for (const m of el.querySelectorAll('img, video')) {
    const r = m.getBoundingClientRect();
    if (r.width > 2) out.push(r);
  }
  return out;
}

const span = (rects: DOMRect[]): Span | null =>
  rects.length ? [Math.min(...rects.map((r) => r.left)), Math.max(...rects.map((r) => r.right))] : null;

/**
 * The open card's place name and card, in the strip's content coordinates, as they will be at rest: the card's
 * horizontal layout is final once it is mounted (it opens by height and opacity); the point scales up about its left
 * edge while it opens, so its name is read at its present scale and taken to ACTIVE_DOT_SCALE.
 */
export function measureOpenCard(dot: HTMLElement, card: HTMLElement): { name: Span; card: Span } | null {
  const cardSpan = span(drawn(card));
  const label = dot.querySelector('.map-label');
  const nameRects = label ? ownLetters(label) : [];
  const nameSpan = span(nameRects);
  if (!cardSpan || !nameSpan) return null;
  // The card layer is translated by the strip's scroll as React last saw it; its own box gives the content origin.
  const layer = card.closest<HTMLElement>('[data-card-layer]');
  if (!layer) return null;
  const origin = layer.getBoundingClientRect().left;
  const cardContent: Span = [cardSpan[0] - origin, cardSpan[1] - origin];
  // The point: its content x is its style left; its present scale from its transform.
  const dotBox = dot.getBoundingClientRect();
  const now = dot.offsetWidth ? dotBox.width / dot.offsetWidth : 1;
  const dotLeft = parseFloat(dot.style.left) || 0;
  const toRest = (x: number) => dotLeft + ((x - dotBox.left) / now) * ACTIVE_DOT_SCALE;
  return { name: [toRest(nameSpan[0]), toRest(nameSpan[1])], card: cardContent };
}
