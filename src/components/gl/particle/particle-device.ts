import { COARSE_POINTER_QUERY } from '@/styles/device-classes';

/**
 * Which particle budget a sketch draws with: the touch one (smaller canvas, fewer and smaller particles) or the mouse
 * one. The sketches used to read the user agent for a phone or tablet name (RWD-10); a touch screen as the main pointer
 * is the capability that test stood for, and it gives the same answer on phones, Android tablets and desktop browsers
 * at any window size. The one device it answers differently is an iPad in its default desktop-class mode, whose user
 * agent names a Mac: the original drew the mouse budget there, this draws the touch one.
 */
export function particleTouchBudget(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(COARSE_POINTER_QUERY).matches;
}
