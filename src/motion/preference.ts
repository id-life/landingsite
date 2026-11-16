'use client';

import { useSyncExternalStore } from 'react';
import { setTokensReduced } from './tokens';

/**
 * The one motion preference of the site (MOT-02). Reduced motion is a designed mode, not motion switched off: every
 * section shows its finished composition as a still frame, and changes of state happen at once or as short fades.
 *
 * Its only input is the operating system's setting, prefers-reduced-motion (this is the only module that reads it;
 * globals.css has the matching CSS guard). There is no on-page control: the owner asked for none, as it clutters the
 * header. A choice an earlier build stored in localStorage ('idl_motion') is ignored.
 *
 * Everything that moves reads isReducedMotion() (or useReducedMotionPref() in React) when it starts a movement, and
 * subscribes with onReducedMotionChange when it runs a loop, so a change of the system setting takes effect without a
 * reload. The motion tokens follow it too (every DURATION is 0 while reduced), and <html> carries .motion-reduced.
 */
let mql: MediaQueryList | null = null;
let reduced = false;
let started = false;
const listeners = new Set<(reduced: boolean) => void>();

function apply() {
  const next = mql?.matches === true;
  const root = typeof document === 'undefined' ? null : document.documentElement;
  root?.classList?.toggle('motion-reduced', next);
  if (next === reduced && started) return;
  reduced = next;
  setTokensReduced(next);
  listeners.forEach((listener) => listener(next));
}

function start() {
  if (started || typeof window === 'undefined') return;
  mql = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  mql?.addEventListener?.('change', apply);
  apply();
  started = true;
}

if (typeof window !== 'undefined') start();

/** True while the operating system asks for reduced motion. */
export function isReducedMotion() {
  start();
  return reduced;
}

/** Called with the new value whenever the preference changes; returns an unsubscribe function. */
export function onReducedMotionChange(listener: (reduced: boolean) => void) {
  start();
  listeners.add(listener);
  return () => void listeners.delete(listener);
}

const subscribe = (onChange: () => void) => onReducedMotionChange(onChange);

/** React view of the preference (false during server rendering). */
export function useReducedMotionPref() {
  return useSyncExternalStore(subscribe, isReducedMotion, () => false);
}
