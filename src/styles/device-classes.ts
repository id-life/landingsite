/**
 * Device classes (RWD-02): one definition shared by CSS (tailwind.config.ts screens) and JavaScript
 * (src/hooks/useDeviceProfile.ts), so the layout the CSS draws and the tree React mounts can never disagree.
 *
 * Width classes follow Android's window size classes (compact < 600, medium 600-839, expanded 840-1199,
 * large >= 1200, px), and a compact-height class covers phones in landscape (< 480 px tall). Media queries use
 * `.98` upper bounds so two classes never overlap.
 */
export const WIDTH_CLASS_QUERY = {
  compact: '(max-width: 599.98px)',
  medium: '(min-width: 600px) and (max-width: 839.98px)',
  expanded: '(min-width: 840px) and (max-width: 1199.98px)',
  large: '(min-width: 1200px)',
} as const;

export const COMPACT_HEIGHT_QUERY = '(max-height: 479.98px)';

/**
 * Two decks, nothing else (RWD-02; the owner's decision of 2026-11-18, question 23: "NO MORE VERSIONS. it's more
 * elegant just mobile and desktop"). The phone deck (the paged deck with no document scroll) is mounted for a window
 * at most 768 px wide, under 480 px tall (a phone on its side), or taller than wide and at most 1024 px wide (a tablet
 * held upright); every other window gets the laptop deck (a tablet on its side is a laptop window of its width). Each
 * deck is one layout that scales with the window ((home) Style.tsx); nothing is specific to tablets.
 */
export const PHONE_TREE_MAX_WIDTH = 768.98;
/** The widest window held upright that still gets the phone deck (a 1024x1366 tablet). */
export const PHONE_TREE_UPRIGHT_MAX_WIDTH = 1024.98;
export const PHONE_TREE_QUERY = `(max-width: ${PHONE_TREE_MAX_WIDTH}px), ${COMPACT_HEIGHT_QUERY}, (orientation: portrait) and (max-width: ${PHONE_TREE_UPRIGHT_MAX_WIDTH}px)`;
/**
 * The complement of PHONE_TREE_QUERY (a media query list cannot be negated as a whole). It is a list of two
 * queries, so a condition added to it must go on each: desktopTreeAnd().
 */
export const DESKTOP_TREE_QUERY =
  '(min-width: 769px) and (min-height: 480px) and (orientation: landscape), (min-width: 1025px) and (min-height: 480px)';
/** DESKTOP_TREE_QUERY narrowed by one more condition on every one of its queries, e.g. '(max-width: 1199.98px)'. */
export const desktopTreeAnd = (condition: string) =>
  DESKTOP_TREE_QUERY.split(', ')
    .map((part) => `${part} and ${condition}`)
    .join(', ');

/**
 * The phone deck's layout unit above phone width (the same deck, proportionally larger on a wider window): 16 px up to
 * 599 px wide, unchanged to the pixel; above, the window's width over 600 px, bounded by its height over 740 px so a
 * page of the deck still fits (360x740 is the shortest phone window the deck is laid out for). A phone on its side
 * (under 480 px tall) stays at 16 px through the height bound.
 */
export const PHONE_SCALE_REFERENCE = { width: 600, height: 740 } as const;
export const PHONE_LAYOUT_UNIT = `max(1rem, min(${(1600 / PHONE_SCALE_REFERENCE.width).toFixed(5)}vw, ${(1600 / PHONE_SCALE_REFERENCE.height).toFixed(5)}svh))`;
/**
 * The part of the phone deck whose unit grows (from 600 px wide, at least 480 px tall): below 600 px, and on a phone on
 * its side, the deck's unit is 16 px and its text exactly as before.
 */
export const PHONE_SCALED_QUERY = `(min-width: 600px) and (min-height: 480px) and (max-width: ${PHONE_TREE_MAX_WIDTH}px), (min-width: 600px) and (min-height: 480px) and (orientation: portrait) and (max-width: ${PHONE_TREE_UPRIGHT_MAX_WIDTH}px)`;
/** The same function in px, for tests and for reasoning: the unit at a window of width x height. */
export const phoneLayoutUnitPx = (width: number, height: number, rem = 16) =>
  Math.max(rem, Math.min((width * 16) / PHONE_SCALE_REFERENCE.width, (height * 16) / PHONE_SCALE_REFERENCE.height));

export const COARSE_POINTER_QUERY = '(pointer: coarse)';
export const HOVER_QUERY = '(hover: hover)';
