import { DURATION, EASE_POINTS, PAGE_STEP } from './tokens';

/**
 * motion (framer) transitions from the motion tokens (MOT-08): the same durations and the same bezier points GSAP
 * and CSS use.
 */
const bezier = (name: keyof typeof EASE_POINTS) => [...EASE_POINTS[name]] as [number, number, number, number];

export const MOTION = {
  instant: { duration: DURATION.instant },
  fast: { duration: DURATION.fast, ease: bezier('out') },
  base: { duration: DURATION.base, ease: bezier('out') },
  baseInOut: { duration: DURATION.base, ease: bezier('inOut') },
  moderate: { duration: DURATION.moderate, ease: bezier('out') },
  /** The phone inner-page step, also used by the CSS and Swiper versions of it. */
  pageStep: { duration: PAGE_STEP.duration, ease: bezier(PAGE_STEP.ease) },
} as const;
