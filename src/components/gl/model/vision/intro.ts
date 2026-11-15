import { isReducedMotion } from '@/motion/preference';

import { DURATION, EASE } from '@/motion/tokens';

/**
 * The hero intro (the dragon flies in while the loader fades out). It runs once per browser: repeat
 * visits, and visitors who ask for reduced motion, get the settled hero after a short fade instead
 * (people should not wait for an animation they see every time).
 */
/**
 * From the motion tokens (MOT-08): the fly-in is a camera-length move (was 1.2 s with expo.out, now 1 s with the
 * site's entrance ease); the wordmark fades over the same length on a first visit (was 0.84 s) and over the base UI
 * duration on a skipped intro (0.3 s, unchanged).
 */
export const INTRO = {
  /** Dragon fly-in; it starts as the loader begins to fade, so the two overlap. */
  flyInSeconds: DURATION.camera,
  flyInEase: EASE.out,
  /** Wordmark fade-in on a first visit, and on a skipped intro. */
  wordmarkFadeSeconds: DURATION.camera,
  skippedFadeSeconds: DURATION.base,
} as const;

const SEEN_KEY = 'intro_seen_v1';

/** True on a repeat visit in this browser or with prefers-reduced-motion: no fly-in. */
export function shouldSkipIntro(): boolean {
  let seen = false;
  try {
    seen = window.localStorage.getItem(SEEN_KEY) === '1';
  } catch {
    // Storage blocked (private mode, disabled cookies): treat as a first visit.
  }
  return seen || isReducedMotion();
}

/** Called when the fly-in has played to the end. */
export function markIntroSeen() {
  try {
    window.localStorage.setItem(SEEN_KEY, '1');
  } catch {
    // Storage blocked: the intro simply plays again next time.
  }
}

/**
 * Run `callback` once `selector` is in the DOM (checked every frame, at most ~2 s, then run anyway).
 * The phone nav mounts in the same update that ends the loader, possibly after the scene's effect.
 */
export function whenElementMounted(selector: string, callback: () => void, framesLeft = 120) {
  if (document.querySelector(selector) || framesLeft <= 0) callback();
  else requestAnimationFrame(() => whenElementMounted(selector, callback, framesLeft - 1));
}
