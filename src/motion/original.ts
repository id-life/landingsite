/**
 * The original site's own timings and eases, named for where it plays them (MOT-08's one token source holds his values
 * as he set them: the codemod that moved every value onto the short scale in tokens.ts bent them, by 50 ms to 500 ms
 * and from one curve family to another, without anything of his asking for it). Seconds; eases by GSAP's own names
 * (core eases, no plugin). Read from his source; a value his library played differently from what his source says is
 * read from his site by frames before it is written here.
 * Every number here reads 0 while motion is reduced, as the tokens do (reducible).
 */
import { reducible } from './tokens';

/** The phone's sections. */
export const PHONE = reducible({
  /** The hero's dragon entering (position, rotation, then scale 0.1 s later) and leaving. */
  heroIn: {
    position: 1.2,
    positionEase: 'power3.out',
    rotation: 1.2,
    rotationEase: 'power2.out',
    scale: 1,
    scaleEase: 'power2.out',
  },
  heroOut: { duration: 1, ease: 'power2.in' },
  /** A tap on the hero wordmark: the shown lockup fades out over 0.5 s; the other fades in over 0.5 s from 0.3 s. */
  wordmarkSwap: { duration: 0.5, inDelay: 0.3 },
  /** Portfolio: the panel rises, then its title, fund and contact each start 0.6 s before the one before them ends. */
  portfolioIn: { duration: 1.2, ease: 'power2.out' },
  portfolioItem: { duration: 0.8, ease: 'power2.out', overlap: 0.6 },
  portfolioOut: { duration: 0.8, ease: 'power2.inOut' },
  /** Insights: the content waits for the exit before it, then fades up. */
  insightsIn: { delay: 0.5, duration: 0.5, ease: 'power2.out' },
  /** The background theme turning to the next section's. */
  themeTurn: { duration: 0.5 },
  /** Presence: the points come in one after another. */
  presencePointsEase: 'power2.out',
  /** Connect: the model rises, and the red words turn into Chinese letter by letter. */
  connectModel: { duration: 0.8, ease: 'power3.out' },
  connectContent: { duration: 0.5 },
  connectTurnEase: 'power2.out',
  /** The dragon's return to its swing after a drag. */
  dragonRecovery: 1.5,
} as const);

/** The laptop's sections (and what both decks share). */
export const SECTIONS = reducible({
  /** Connect: the camera's long glide in, on the scroll. */
  connectCameraEase: 'power1.out',
  /** Connect: the contact footer rising and the scroll title fading as the visitor arrives, and back. */
  connectFooter: { duration: 0.5, ease: 'power2.out' },
  /** Connect: each glyph's fade when the Chinese turns back into English. */
  connectGlyph: 0.05,
  /** Insights: the content rises in and leaves, on the scroll. */
  insightsInEase: 'power2.out',
  insightsOutEase: 'power2.in',
  /** Presence: the map's points come in and go, on the scroll. */
  presencePointsEase: 'power2.out',
  /** Presence: the map following the pointer. */
  presenceParallax: { duration: 1.5, ease: 'power2.out' },
  /** Presence: each ring of a map point's pulse. */
  mapPulse: 1.5,
  /** Portfolio: a fund's hover. */
  portfolioHover: { duration: 0.3, ease: 'power2.out' },
  /** The hero's rolling words. */
  carouselEase: 'power2.inOut',
  /** motion's named eases where his components use them: Spectrum's links, the map's dots and cards. */
  spectrumLinksEase: 'easeOut',
  mapDotEase: 'easeInOut',
} as const);

/** Entrance tilts in degrees (not durations: unchanged under reduced motion). */
export const TILT = {
  /** Portfolio's and Spectrum's lines tilt in from 45 degrees about X and 15 about Y, each rising its own height. */
  entrance: { x: 45, y: 15 },
  /** Connect's first page tilts in from 30 degrees. */
  connectPage: 30,
} as const;
