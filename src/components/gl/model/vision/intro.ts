/**
 * The hero intro (the dragon flies in while the loader fades out). It runs once per browser: repeat
 * visits, and visitors who ask for reduced motion, get the settled hero after a short fade instead
 * (people should not wait for an animation they see every time).
 */
export const INTRO = {
  /** Dragon fly-in; it starts as the loader begins to fade, so the two overlap. */
  flyInSeconds: 1.2,
  flyInEase: 'expo.out',
  /** Wordmark fade-in on a first visit, and on a skipped intro. */
  wordmarkFadeSeconds: 0.84,
  skippedFadeSeconds: 0.3,
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
  return seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Called when the fly-in has played to the end. */
export function markIntroSeen() {
  try {
    window.localStorage.setItem(SEEN_KEY, '1');
  } catch {
    // Storage blocked: the intro simply plays again next time.
  }
}
