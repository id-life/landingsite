import gsap from 'gsap';
import { onReducedMotionChange } from './preference';
import { DISTANCE, DURATION, EASE } from './tokens';

/**
 * GSAP's view of the motion tokens (MOT-08). Imported for its side effect by src/utils/gsap-plugins.ts, so every
 * experience entry point gets the same eases and defaults before any tween is created.
 *
 * - The token eases are registered under their token names ('out', 'inOut', 'in') with gsap.registerEase. They are
 *   the same functions CSS and motion get from the same bezier points (tokens.ts), so one name is one curve.
 *   (CustomEase would do the same from the points; the core registerEase needs no plugin.)
 * - gsap.defaults: a tween without its own duration or ease takes DURATION.base and 'out' (GSAP's own defaults
 *   are 0.5 s power1.out).
 * - Effects for the three recurring moves: fadeUp (enter from below), reveal (fade in), swap (fade out).
 */
for (const [name, fn] of Object.entries(EASE)) {
  if (name !== 'linear') gsap.registerEase(name, fn);
}

gsap.defaults({ duration: DURATION.base, ease: EASE.out });
// Reduced motion (MOT-02): a tween without its own duration lands at once too.
onReducedMotionChange(() => gsap.defaults({ duration: DURATION.base }));

function effect(
  name: string,
  defaults: gsap.TweenVars,
  run: (targets: gsap.TweenTarget, config: gsap.TweenVars) => gsap.core.Animation,
) {
  if (gsap.effects[name]) return;
  gsap.registerEffect({ name, effect: run, defaults, extendTimeline: true });
}

effect('fadeUp', { duration: DURATION.moderate, ease: EASE.out, y: DISTANCE.sm }, (targets, { y, ...config }) =>
  gsap.from(targets, { ...config, y, opacity: 0 }),
);
effect('reveal', { duration: DURATION.base, ease: EASE.out }, (targets, config) =>
  gsap.fromTo(targets, { opacity: 0 }, { ...config, opacity: 1 }),
);
effect('swap', { duration: DURATION.fast, ease: EASE.in }, (targets, config) => gsap.to(targets, { ...config, opacity: 0 }));
