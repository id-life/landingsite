import gsap from 'gsap';
import { isReducedMotion, onReducedMotionChange } from './preference';
import { DISTANCE, DURATION, EASE, GSAP_DEFAULT } from './tokens';

/**
 * GSAP's view of the motion tokens (MOT-08). Imported for its side effect by src/utils/gsap-plugins.ts, so every
 * experience entry point gets the same eases and defaults before any tween is created.
 *
 * - The token eases are registered under their token names ('out', 'inOut', 'in') with gsap.registerEase. They are
 *   the same functions CSS and motion get from the same bezier points (tokens.ts), so one name is one curve.
 *   (CustomEase would do the same from the points; the core registerEase needs no plugin.)
 * - GSAP's own defaults stay: a tween without its own duration or ease plays 0.5 s and power1.out, as on the original
 *   site, which set no defaults (a site-wide 0.3 s and quint out here had changed every such tween of his). Only reduced
 *   motion (MOT-02) changes the default duration: such a tween lands at once.
 * - Effects for the three recurring moves: fadeUp (enter from below), reveal (fade in), swap (fade out).
 */
for (const [name, fn] of Object.entries(EASE)) {
  if (name !== 'linear') gsap.registerEase(name, fn);
}

// Reduced motion (MOT-02): a tween without its own duration lands at once too; otherwise GSAP's own 0.5 s.
const applyDefaultDuration = () => gsap.defaults({ duration: isReducedMotion() ? 0 : GSAP_DEFAULT.duration });
applyDefaultDuration();
onReducedMotionChange(applyDefaultDuration);

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
