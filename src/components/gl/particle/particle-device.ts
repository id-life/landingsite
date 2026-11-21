import { PHONE_TREE_QUERY } from '@/styles/device-classes';

/**
 * Which particle budget a sketch draws with: the phone one (smaller canvas, fewer and smaller particles) or the laptop
 * one. It follows the version the visitor is given (two versions only: the phone and the laptop), read from the same
 * query that picks the version, never from the user agent (RWD-10). That is the original's choice on phones, on
 * desktops at every width and on an iPad on its side (the laptop version, the mouse budget); an upright tablet gets the
 * phone version and its budget. An Android tablet on its side, which the original's user-agent test gave the phone
 * budget, now gets the laptop version's.
 */
export function particlePhoneBudget(): boolean {
  return typeof window !== 'undefined' && window.matchMedia(PHONE_TREE_QUERY).matches;
}
