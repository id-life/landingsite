import { isReducedMotion } from '@/motion/preference';

/**
 * The hero intro, as on the original site (the owner's answer 7A: "keep your full-screen loader and intro"). Every value
 * is the original's own (its DragonModel, MobileDragonModel, CenterLogo and ProgressLoader); they are not motion tokens,
 * because the intro is his and stays his whatever the tokens become. It plays on every visit; only a visitor whose
 * system asks for reduced motion gets the settled hero (the skip below).
 *
 * Sequence after the hero's assets are in: the loader's bar fills to the end (loaderFillSeconds, linear), the loader
 * fades out (loaderFadeSeconds), and only then does the intro start: the wordmark fades in (wordmarkFadeSeconds), and
 * after flyInDelaySeconds the dragon flies in from the camera (flyInSeconds); the navigation and the fixed controls
 * fade in when the fly-in is half way (laptop: one after the other, each uiFadeSeconds.laptop) or 85 % of the way
 * (phone: together, each uiFadeSeconds.phone).
 */
export const INTRO = {
  loaderFillSeconds: 0.5,
  loaderFadeSeconds: 0.3,
  flyInSeconds: 2.1,
  flyInDelaySeconds: 0.21,
  flyInEase: 'power3.out',
  wordmarkFadeSeconds: 0.84,
  wordmarkFadeEase: 'power2.out',
  uiFadeSeconds: { laptop: 0.5, phone: 0.21 },
  /**
   * Where the laptop's bar fade begins inside its timeline. The original created that timeline with { duration: 0.21 }
   * among the timeline's own vars: GSAP takes it as the timeline's initial length, and a child added without a position
   * goes to the timeline's end, so the bar's fade began 0.21 s after the trigger, the fixed controls' after it. Measured
   * on the original: the timeline is created 1.25 s after the loader goes, the bar's fade begins 0.24 s later.
   */
  laptopUiOffsetSeconds: 0.21,
  /** GSAP's own default ease, which the original's fades used (this site sets other defaults). */
  defaultEase: 'power1.out',
  /** The settled hero's fade for a reduced-motion visitor (the tokens read 0 then; this is the original's 0.3 s). */
  skippedFadeSeconds: 0.3,
} as const;

/** True for a visitor whose system asks for reduced motion: no fly-in, the settled hero. Every other visit plays it. */
export function shouldSkipIntro(): boolean {
  return isReducedMotion();
}

/**
 * Run `callback` once `selector` is in the DOM (checked every frame, at most ~2 s, then run anyway).
 * The phone nav mounts in the same update that ends the loader, possibly after the scene's effect.
 */
export function whenElementMounted(selector: string, callback: () => void, framesLeft = 120) {
  if (document.querySelector(selector) || framesLeft <= 0) callback();
  else requestAnimationFrame(() => whenElementMounted(selector, callback, framesLeft - 1));
}

/** Where the dragon starts its fly-in (the original's gsap.from values): at the camera, turned over. */
export const FLY_IN_FROM = {
  position: { x: 0, y: 0, z: 10 },
  rotation: { x: Math.PI, y: (Math.PI * 3) / 2, z: Math.PI },
} as const;

/**
 * The dragon's pose props: while the loader is on screen (the intro still to come) it waits, not drawn, at the start
 * of its fly-in. On the original nothing of the scene shows behind the fading loader, and the intro begins only once
 * the loader has gone, from that start pose; drawn at rest instead, the dragon showed through the fading loader and
 * then jumped to the start of the fly-in.
 */
export function flyInHoldPose(
  waiting: boolean,
  position: [number, number, number],
  rotation: [number, number, number],
): { position: [number, number, number]; rotation: [number, number, number]; visible: boolean } {
  if (!waiting) return { position, rotation, visible: true };
  if (shouldSkipIntro()) return { position, rotation, visible: false };
  const { position: p, rotation: r } = FLY_IN_FROM;
  return { position: [p.x, p.y, p.z], rotation: [r.x, r.y, r.z], visible: false };
}
