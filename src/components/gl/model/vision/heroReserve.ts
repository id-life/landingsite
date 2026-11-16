import { atom } from 'jotai';

/**
 * The home statement's box on screen (px, viewport coordinates), published by HomeStatementFrame so the desktop hero
 * can keep the ring and the dragon clear of it (heroFit.ts, fitHeroToReserve). Null until the frame has measured.
 */
export type HeroStatementBox = { bottom: number; right: number };
export const heroStatementBoxAtom = atom<HeroStatementBox | null>(null);
