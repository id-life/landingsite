'use client';

import { useSyncExternalStore } from 'react';
import { setTokensReduced } from './tokens';

/**
 * The one motion preference of the site (MOT-02). Reduced motion is a designed mode, not motion switched off: every
 * section shows its finished composition as a still frame, and changes of state happen at once or as short fades.
 *
 * Two inputs:
 * - the operating system's setting, prefers-reduced-motion (this is the only module that reads it; globals.css has
 *   the matching CSS guard);
 * - the on-page Motion switch (MotionSwitch), remembered in localStorage. It wins over the OS setting in both
 *   directions: "off" reduces motion on any device, "on" brings motion back for a visitor whose OS asks for less.
 *   Without a stored choice the OS setting decides.
 *
 * Everything that moves reads isReducedMotion() (or useReducedMotionPref() in React) when it starts a movement, and
 * subscribes with onReducedMotionChange when it runs a loop, so the switch takes effect without a reload. The motion
 * tokens follow it too (every DURATION is 0 while reduced), and <html> carries .motion-reduced / .motion-full for CSS.
 */
const STORAGE_KEY = 'idl_motion';

type Stored = 'on' | 'off' | null;

let mql: MediaQueryList | null = null;
let stored: Stored = null;
let reduced = false;
let started = false;
const listeners = new Set<(reduced: boolean) => void>();

function readStored(): Stored {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === 'on' || value === 'off' ? value : null;
  } catch {
    return null; // storage blocked: the OS setting decides
  }
}

function compute() {
  return stored === 'off' || (stored !== 'on' && mql?.matches === true);
}

function apply() {
  const next = compute();
  const root = typeof document === 'undefined' ? null : document.documentElement;
  root?.classList?.toggle('motion-reduced', next);
  // An explicit "on" lifts the CSS guard of the OS setting (globals.css).
  root?.classList?.toggle('motion-full', !next && stored === 'on');
  if (next === reduced && started) return;
  reduced = next;
  setTokensReduced(next);
  listeners.forEach((listener) => listener(next));
}

function start() {
  if (started || typeof window === 'undefined') return;
  mql = typeof window.matchMedia === 'function' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  stored = readStored();
  mql?.addEventListener?.('change', apply);
  // Another tab changed the switch.
  window.addEventListener?.('storage', (event) => {
    if (event.key !== STORAGE_KEY) return;
    stored = readStored();
    apply();
  });
  apply();
  started = true;
}

if (typeof window !== 'undefined') start();

/** True while motion is reduced (by the OS setting or the Motion switch). */
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

/** The Motion switch: true plays motion, false reduces it. The choice is remembered on this device. */
export function setMotionEnabled(enabled: boolean) {
  start();
  stored = enabled ? 'on' : 'off';
  try {
    window.localStorage.setItem(STORAGE_KEY, stored);
  } catch {
    // Storage blocked: the choice lasts for this page.
  }
  apply();
}

const subscribe = (onChange: () => void) => onReducedMotionChange(onChange);

/** React view of the preference (false during server rendering). */
export function useReducedMotionPref() {
  return useSyncExternalStore(subscribe, isReducedMotion, () => false);
}
