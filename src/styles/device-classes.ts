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
 * The phone experience (the paged deck with no document scroll) is mounted for phones in either orientation: a
 * narrow window, or a short one (a phone in landscape gets the phone layout, never the laptop layout at a 7 px
 * root). The width bound is 768 px while the desktop sections have no medium (tablet) layout; it moves to the
 * compact class (599.98 px) once they do. Everything else gets the desktop experience.
 */
export const PHONE_TREE_MAX_WIDTH = 768;
export const PHONE_TREE_QUERY = `(max-width: ${PHONE_TREE_MAX_WIDTH}px), ${COMPACT_HEIGHT_QUERY}`;
/** The complement of PHONE_TREE_QUERY (a media query list cannot be negated as a whole). */
export const DESKTOP_TREE_QUERY = `(min-width: ${PHONE_TREE_MAX_WIDTH + 1}px) and (min-height: 480px)`;

export const COARSE_POINTER_QUERY = '(pointer: coarse)';
export const HOVER_QUERY = '(hover: hover)';
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
