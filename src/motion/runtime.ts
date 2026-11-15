'use client';

import { useSyncExternalStore } from 'react';

/**
 * The experience's motion runtime (MOT-03): one switch that pauses every loop of the experience at once.
 *
 * - After IDLE_MS without pointer, key, wheel or touch input on a visible page, and while the tab is hidden, the
 *   experience is paused: the GSAP ticker sleeps (it also drives the WebGL canvases, see FrameDriver, and every
 *   tween, ScrollTrigger and ScrollSmoother), every p5 sketch stops looping, and registered loops (the audio
 *   visualiser) stop. Nothing requests an animation frame while paused.
 * - The next input (or the tab becoming visible again) resumes everything where it was.
 *
 * The browser already stops requestAnimationFrame in a background tab; the hidden-tab pause is for timers and audio
 * visualisers. Code that runs its own loop registers it with onMotionPause. This module imports nothing heavy (the
 * podcast player's visualiser uses it): the GSAP ticker is put to sleep by MotionRuntime, which only the experience
 * mounts.
 */
const IDLE_MS = 60_000;
const INPUT_EVENTS = ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart'] as const;

let paused = false;
const listeners = new Set<(paused: boolean) => void>();

export function isMotionPaused() {
  return paused;
}

/** Called with true when the experience pauses and false when it resumes; returns an unsubscribe function. */
export function onMotionPause(listener: (paused: boolean) => void) {
  listeners.add(listener);
  return () => void listeners.delete(listener);
}

/**
 * While paused, animation frames are held the way a background tab holds them: a callback requested in that time
 * runs on the first frame after the resume. This stops the loops nobody can pause from outside, such as GSAP
 * ScrollTrigger's own keep-alive loop (_rafBugFix), which requests a frame every frame for as long as ScrollTrigger is
 * enabled. Every rAF user already tolerates this: browsers do the same whenever a tab is hidden.
 */
let nativeRaf: typeof window.requestAnimationFrame | null = null;
let nativeCancel: typeof window.cancelAnimationFrame | null = null;
const held = new Map<number, FrameRequestCallback>();
let heldId = -1;

function holdFrames() {
  if (nativeRaf) return;
  nativeRaf = window.requestAnimationFrame;
  nativeCancel = window.cancelAnimationFrame;
  window.requestAnimationFrame = (callback) => {
    heldId -= 1;
    held.set(heldId, callback);
    return heldId;
  };
  window.cancelAnimationFrame = (id) => {
    if (held.delete(id)) return;
    nativeCancel?.call(window, id);
  };
}

function releaseFrames() {
  if (!nativeRaf || !nativeCancel) return;
  window.requestAnimationFrame = nativeRaf;
  window.cancelAnimationFrame = nativeCancel;
  nativeRaf = nativeCancel = null;
  const callbacks = [...held.values()];
  held.clear();
  if (callbacks.length) window.requestAnimationFrame((time) => callbacks.forEach((callback) => callback(time)));
}

function setPaused(next: boolean) {
  if (paused === next) return;
  paused = next;
  if (next) holdFrames();
  else releaseFrames();
  listeners.forEach((listener) => listener(next));
}

/** React view of the pause state. */
export function useMotionPaused() {
  return useSyncExternalStore(onMotionPause, isMotionPaused, () => false);
}

let installs = 0;
let timer: ReturnType<typeof setTimeout> | undefined;
let lastInput = 0;

function armIdleTimer() {
  clearTimeout(timer);
  timer = setTimeout(() => setPaused(true), IDLE_MS);
}

function onInput() {
  // Input arrives up to hundreds of times a second: re-arm the timer at most every 250 ms.
  const now = performance.now();
  if (paused) setPaused(false);
  if (now - lastInput < 250) return;
  lastInput = now;
  armIdleTimer();
}

function onVisibility() {
  if (document.visibilityState === 'hidden') {
    clearTimeout(timer);
    setPaused(true);
  } else {
    setPaused(false);
    armIdleTimer();
  }
}

/** Starts the idle and visibility watch; returns its teardown. Mounted once by the experience (MotionRuntime). */
export function installMotionRuntime() {
  installs += 1;
  if (installs === 1) {
    // Capture phase: wake the ticker before the smoother or any handler reacts to the same input.
    for (const type of INPUT_EVENTS) window.addEventListener(type, onInput, { capture: true, passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    armIdleTimer();
  }
  return () => {
    installs -= 1;
    if (installs > 0) return;
    for (const type of INPUT_EVENTS) window.removeEventListener(type, onInput, { capture: true });
    document.removeEventListener('visibilitychange', onVisibility);
    clearTimeout(timer);
    setPaused(false);
  };
}
