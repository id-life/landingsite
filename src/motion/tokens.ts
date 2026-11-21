/**
 * The site's motion language (MOT-08): every duration, ease, stagger and distance an animation uses comes from
 * here. GSAP (src/motion/gsap.ts), CSS (custom properties --dur-* / --ease-*, mapped in tailwind.config.ts) and
 * motion (src/motion/presets.ts) read the same values, so the feel can be retuned in one place. A numeric
 * duration or a string ease outside src/motion fails lint.
 *
 * Durations in seconds. The ladder follows Material 3's duration tokens and NN/g's 100-500 ms band for UI motion;
 * only the section transition and camera moves are longer.
 */
const BASE_DURATION = {
  instant: 0,
  /** Per-glyph and per-icon changes. */
  micro: 0.12,
  /** Hover and press feedback, small fades. */
  fast: 0.2,
  /** The default for UI tweens (gsap.defaults). */
  base: 0.3,
  /** Panels, dialogs and the phone menu entering or leaving. */
  moderate: 0.45,
  /** One section of the experience to the next (src/motion/sectionController.ts). */
  section: 0.8,
  /** Camera moves through a 3D scene and first-visit intros. */
  camera: 1,
} as const;

let tokensReduced = false;

/** Set by src/motion/preference.ts: while motion is reduced every duration token reads 0 (changes happen at once). */
export function setTokensReduced(value: boolean) {
  tokensReduced = value;
}

/**
 * Durations in seconds, read when a tween is created. While motion is reduced (MOT-02) each reads 0, so every
 * token-timed change of state lands at once; scrubbed lengths (beats) and the reduced-mode fades below are not
 * durations of this kind and are unaffected.
 */
export const DURATION = Object.defineProperties(
  {} as { readonly [K in keyof typeof BASE_DURATION]: number },
  Object.fromEntries(
    Object.entries(BASE_DURATION).map(([name, seconds]) => [
      name,
      { enumerable: true, get: () => (tokensReduced ? 0 : seconds) },
    ]),
  ),
);

/**
 * Eases as cubic-bezier control points, defined once. GSAP plays them through CustomEase under the same names,
 * CSS as cubic-bezier(), motion as a bezier array, so one token name is one curve everywhere. (GSAP's power3 is
 * the quart family: power3.out would not match (0.22, 1, 0.36, 1), which is easeOutQuint.)
 */
export const EASE_POINTS = {
  /** easeOutQuint: entrances, settles, most UI. */
  out: [0.22, 1, 0.36, 1],
  /** easeInOutCubic: things that move from one place to another (section transitions). */
  inOut: [0.65, 0, 0.35, 1],
  /** easeInQuint, the mirror of out: exits. */
  in: [0.64, 0, 0.78, 0],
} as const;

export type EaseName = keyof typeof EASE_POINTS | 'linear';

/** y(x) of a CSS cubic-bezier(x1, y1, x2, y2) timing function (the UnitBezier solver browsers use). */
function cubicBezier([x1, y1, x2, y2]: readonly [number, number, number, number]) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const slopeX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  const solveT = (x: number) => {
    let t = x;
    for (let i = 0; i < 8; i += 1) {
      const err = sampleX(t) - x;
      if (Math.abs(err) < 1e-6) return t;
      const d = slopeX(t);
      if (Math.abs(d) < 1e-6) break;
      t -= err / d;
    }
    let lo = 0;
    let hi = 1;
    t = x;
    while (lo < hi) {
      const v = sampleX(t);
      if (Math.abs(v - x) < 1e-6) return t;
      if (x > v) lo = t;
      else hi = t;
      if (hi - lo < 1e-7) return t;
      t = (lo + hi) / 2;
    }
    return t;
  };
  return (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : sampleY(solveT(x)));
}

/**
 * The eases as functions of progress (0..1), for GSAP (any GSAP vars accept a function ease) and for code that
 * needs a value. Functions rather than names, so no GSAP plugin has to be registered first: content pages use
 * these too, and must not load GSAP plugins.
 */
export const EASE = {
  out: cubicBezier(EASE_POINTS.out),
  inOut: cubicBezier(EASE_POINTS.inOut),
  in: cubicBezier(EASE_POINTS.in),
  linear: (x: number) => x,
} as const;

/** Stagger between items of one group, in seconds. */
/**
 * GSAP's own defaults, which the original site played for every tween that names no duration or ease (it set no
 * gsap.defaults). Not a choice of this site's: kept so that such tweens play as on the original.
 */
export const GSAP_DEFAULT = { duration: 0.5, ease: 'power1.out' } as const;

export const STAGGER = {
  glyph: 0.02,
  item: 0.04,
  block: 0.1,
} as const;

/** Travel distances in px (entrances rise by these). */
export const DISTANCE = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 48,
} as const;

/** The largest entrance tilt, in degrees. */
export const MAX_TILT = 8;

/** Ambient loops that run on their own (ripples, pulses), in seconds per cycle. */
export const LOOP = {
  ripple: 2,
  pulse: 1.5,
} as const;

/**
 * Lengths inside a scrubbed (scroll-linked) timeline. These are proportions of the section's scroll distance,
 * not seconds: a scrubbed timeline's total length only fixes how the scroll distance is shared between its
 * tweens. beats(2) takes twice the scroll of beats(1).
 */
export const beats = (n: number) => n;

/** The phone inner-page step (Portfolio pages, Spectrum pages, Insights slides): one preset everywhere. */
export const PAGE_STEP = { duration: 0.25, ease: 'out' } as const satisfies { duration: number; ease: EaseName };

/**
 * A jump of more than one section fades a cover in the target's theme colour in, jumps under it and fades it out
 * (src/hooks/anim/useDesktopSections.ts): never a one-frame cut, and no long glide through the sections between.
 */
export const SECTION_COVER = { fade: 0.25 } as const;

/** With reduced motion a section change is a short crossfade through the cover instead of a move (MOT-02). */
export const REDUCED_FADE = 0.1;

/** CSS cubic-bezier() for an ease token. */
const cssEase = (name: EaseName) => (name === 'linear' ? 'linear' : `cubic-bezier(${EASE_POINTS[name].join(', ')})`);

/**
 * The CSS custom properties (--dur-*, --ease-*) for :root, generated from the tokens above. Tailwind adds them to
 * its base layer (tailwind.config.ts), and maps duration-*, ease-* utilities to them.
 */
export function motionCssVariables(): Record<string, string> {
  const vars: Record<string, string> = {};
  for (const [name, seconds] of Object.entries(BASE_DURATION)) vars[`--dur-${name}`] = `${Math.round(seconds * 1000)}ms`;
  vars['--dur-page'] = `${Math.round(PAGE_STEP.duration * 1000)}ms`;
  for (const name of [...(Object.keys(EASE_POINTS) as (keyof typeof EASE_POINTS)[]), 'linear' as const])
    vars[`--ease-${name}`] = cssEase(name);
  return vars;
}
