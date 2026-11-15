/**
 * Section transitions are the section controller's (src/motion/sectionController.ts) and take their timing from
 * the motion tokens (DURATION.section, EASE.inOut in src/motion/tokens.ts). They were 2000 / 3000 ms with input
 * locked on main, then 900 / 1200 ms after wave 0.
 */

/** True when the visitor asked the OS for less motion. */
export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
}
