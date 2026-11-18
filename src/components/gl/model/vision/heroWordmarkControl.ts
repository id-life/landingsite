/**
 * The keyboard's way to the hero wordmark's language swap (a click on the canvas is the pointer's). The DOM button
 * (HeroWordmarkButton) asks the 3D wordmark (CenterLogo) to swap through a window event, and asks where the wordmark is
 * drawn through the measure function CenterLogo registers, so the button's focus ring goes around the drawn wordmark.
 */
export const HERO_WORDMARK_TOGGLE = 'idl:hero-wordmark-toggle';

/** The drawn wordmark's box in viewport pixels. */
export type ViewportBox = { left: number; top: number; width: number; height: number };

let measure: (() => ViewportBox | null) | null = null;

/** CenterLogo registers how to measure the wordmark it draws; returns the unregister function. */
export function registerHeroWordmarkMeasure(fn: () => ViewportBox | null) {
  measure = fn;
  return () => {
    if (measure === fn) measure = null;
  };
}

export function measureHeroWordmark(): ViewportBox | null {
  return measure?.() ?? null;
}

/** Which lockup the hero draws: the button's accessible name follows it. */
export type HeroLang = 'en' | 'cn';
let drawnLang: HeroLang = 'en';
const langListeners = new Set<() => void>();

/** CenterLogo reports the lockup it now draws (after a swap, or 'en' when it mounts afresh). */
export function setHeroWordmarkLang(lang: HeroLang) {
  if (drawnLang === lang) return;
  drawnLang = lang;
  langListeners.forEach((listener) => listener());
}

export function getHeroWordmarkLang(): HeroLang {
  return drawnLang;
}

export function subscribeHeroWordmarkLang(listener: () => void) {
  langListeners.add(listener);
  return () => {
    langListeners.delete(listener);
  };
}
