'use client';

import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useEffect } from 'react';
import { currentPageAtom } from '@/atoms';
import { jotaiStore } from '@/atoms/store';
import { NAV_LIST, type SectionId } from '@/components/nav/nav';
import { prefersReducedMotion } from '@/constants/scroll-config';
import {
  canStepSection,
  goToSection,
  registerSectionDriver,
  type SectionDriver,
  stepSection,
} from '@/motion/sectionController';
import { DURATION, EASE, SECTION_COVER } from '@/motion/tokens';
import { THEME_TRANSITIONS } from '@/utils/gsap-config';
import { getRestScroll } from '@/utils/section-step';

/**
 * The desktop deck's side of the section controller (MOT-01), mounted once in Home: the driver (rest poses,
 * transitions, the far-jump cover) and the inputs (wheel, keys, touch on tablets that get this tree).
 *
 * - One gesture is one step: a wheel gesture steps on its first 10 px and re-arms only after 200 ms without
 *   wheel events (GSAP Observer's onStop), or when it turns around, however long its momentum lasts and however
 *   long the transition takes. Input is never dropped: a gesture during a transition either continues it (same
 *   direction) or reverses it.
 * - A neighbour gets a DURATION.section scroll on EASE.inOut through the smoother's own scrollTop, so the content
 *   rests when the scroll does. A jump of two or more sections fades a cover in the target's theme
 *   colour, jumps under it and fades it out.
 * - The nav is never dimmed or disabled.
 */
const GESTURE_GAP_MS = 200;
const WHEEL_TOLERANCE = 10;
const AT_REST_PX = 8;

const MODAL = '[role="dialog"], [aria-modal="true"]';
const EDITABLE = 'input, textarea, select, [contenteditable=""], [contenteditable="true"], [role="slider"], [role="textbox"]';
const ACTIVATABLE = 'button, a[href], [role="button"], summary';

const KEY_STEPS: Record<string, -1 | 1> = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1 };

const restOf = (index: number) => getRestScroll(NAV_LIST[index].id as SectionId);

/** A modal dialog (the SUBSCRIBE popup) is open: the deck behind it takes no input. */
const modalOpen = () => document.querySelector('[aria-modal="true"]') !== null;

/** The section whose rest pose is nearest the current scroll position. */
function viewIndex() {
  const y = window.scrollY;
  let best = 0;
  let bestDistance = Infinity;
  NAV_LIST.forEach((_, i) => {
    const rest = restOf(i);
    if (rest === null) return;
    const distance = Math.abs(y - rest);
    if (distance < bestDistance) {
      best = i;
      bestDistance = distance;
    }
  });
  return best;
}

/** The nearest ancestor that scrolls vertically and can still move in the direction of deltaY. */
function scrollsInside(target: EventTarget | null, deltaY: number) {
  let el = target instanceof Element ? target : null;
  while (el && el !== document.body && el !== document.documentElement) {
    const style = getComputedStyle(el);
    if (/(auto|scroll)/.test(style.overflowY) && el.scrollHeight > el.clientHeight + 1) {
      if (deltaY > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 0) return true;
    }
    el = el.parentElement;
  }
  return false;
}

/** True when the element (or an ancestor) scrolls vertically on its own. */
function inVerticalScroller(target: EventTarget | null) {
  let el = target instanceof Element ? target : null;
  while (el && el !== document.body && el !== document.documentElement) {
    const style = getComputedStyle(el);
    if (/(auto|scroll)/.test(style.overflowY) && el.scrollHeight > el.clientHeight + 1) return true;
    el = el.parentElement;
  }
  return false;
}

let cover: HTMLDivElement | null = null;
function getCover() {
  if (cover?.isConnected) return cover;
  cover = document.createElement('div');
  cover.setAttribute('aria-hidden', 'true');
  cover.dataset.sectionCover = '';
  // Under the fixed nav (z-50), over the sections and canvases.
  Object.assign(cover.style, {
    position: 'fixed',
    inset: '0',
    zIndex: '45',
    pointerEvents: 'none',
    opacity: '0',
    visibility: 'hidden',
  });
  document.body.appendChild(cover);
  return cover;
}

function themeColour(index: number) {
  const theme = THEME_TRANSITIONS[NAV_LIST[index].id as keyof typeof THEME_TRANSITIONS] as Record<string, string> | undefined;
  return theme?.['--background'] ?? getComputedStyle(document.documentElement).getPropertyValue('--background').trim();
}

/** Put the view at y at once: the smoother's own setter moves the content with the scroll, with no lag. */
function jumpTo(y: number) {
  ScrollSmoother.get()?.scrollTop(y);
}

const desktopDriver: SectionDriver = {
  tree: 'desktop',
  current: viewIndex,
  stepTarget(dir) {
    const index = viewIndex();
    const rest = restOf(index);
    const y = window.scrollY;
    // Off the rest pose (the footer below Connect, a dragged scrollbar): first back to the section's own rest.
    if (rest !== null && Math.abs(y - rest) > AT_REST_PX && (dir > 0 ? y < rest : y > rest)) return index;
    const next = index + dir;
    return next >= 0 && next < NAV_LIST.length ? next : null;
  },
  move(to, { from, source }) {
    const y = restOf(to);
    const smoother = ScrollSmoother.get();
    if (y === null || !smoother) return null;
    gsap.killTweensOf([window, smoother]);
    if (source === 'deeplink' || source === 'layout' || prefersReducedMotion()) {
      jumpTo(y);
      return null;
    }
    if (Math.abs(to - from) <= 1) {
      // Tween the smoother's scrollTop rather than the window: its setter renders the content at once, so the
      // section rests when the tween ends instead of trailing it by the smoother's 0.5 s lag.
      const tween = gsap.to(smoother, {
        scrollTop: y,
        duration: DURATION.section,
        ease: EASE.inOut,
        paused: true,
      });
      return { transition: tween, reversible: true };
    }
    const el = getCover();
    // A cover fade still running from an interrupted jump. (Not overwrite: true on the tween below: GSAP applies it
    // when the tween first renders and would kill this timeline's own fade-out of the same element.)
    gsap.killTweensOf(el);
    const tl = gsap.timeline({ paused: true });
    tl.set(el, { backgroundColor: themeColour(to), visibility: 'visible' });
    tl.to(el, { opacity: 1, duration: SECTION_COVER.fade, ease: EASE.out });
    tl.call(() => jumpTo(y));
    // A short hold so the sections and canvases under the cover render the new position before it lifts.
    tl.to(el, { opacity: 0, duration: SECTION_COVER.fade, ease: EASE.inOut }, `+=${DURATION.micro}`);
    tl.set(el, { visibility: 'hidden' });
    return { transition: tl, reversible: false };
  },
  settle(index) {
    jotaiStore.set(currentPageAtom, NAV_LIST[index]);
  },
  interrupt() {
    if (!cover || cover.style.visibility === 'hidden') return;
    const el = cover;
    gsap.killTweensOf(el);
    gsap.to(el, {
      opacity: 0,
      duration: SECTION_COVER.fade,
      ease: EASE.out,
      onComplete: () => gsap.set(el, { visibility: 'hidden' }),
    });
  },
};

export function useDesktopSections() {
  useEffect(() => {
    const unregister = registerSectionDriver(desktopDriver);

    // ---- wheel: one gesture, one step ----
    let lastWheelAt = -Infinity;
    let gestureSign = 0;
    let armed = true;
    let consumed = false;
    let travelled = 0;
    const onWheel = (event: WheelEvent) => {
      if (event.defaultPrevented || event.ctrlKey) return; // ctrl + wheel is a trackpad pinch (zoom)
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.deltaY === 0) return; // horizontal swipes
      const target = event.target instanceof Element ? event.target : null;
      if (modalOpen() || target?.closest(MODAL) || scrollsInside(target, event.deltaY)) return;
      const sign = Math.sign(event.deltaY);
      // The event's own timestamp, not the time the handler runs: on a busy main thread a continuous stream can
      // reach the handler in bursts with long gaps that are not in the gesture.
      const now = event.timeStamp;
      if (now - lastWheelAt >= GESTURE_GAP_MS || sign !== gestureSign) {
        armed = true;
        consumed = canStepSection(sign as -1 | 1);
        travelled = 0;
      }
      lastWheelAt = now;
      gestureSign = sign;
      if (!consumed) return; // nothing to step to (the footer below Connect): the browser scrolls
      event.preventDefault();
      if (!armed) return;
      travelled += event.deltaY;
      if (Math.abs(travelled) < WHEEL_TOLERANCE) return;
      armed = false;
      stepSection(sign as -1 | 1, 'wheel');
    };

    // ---- keys ----
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target instanceof Element ? event.target : null;
      if (modalOpen() || target?.closest(EDITABLE) || target?.closest(MODAL)) return;
      let handled = false;
      if (event.key === 'Home') handled = goToSection(0, 'key');
      else if (event.key === 'End') handled = goToSection(NAV_LIST.length - 1, 'key');
      else {
        let dir = KEY_STEPS[event.key];
        if (!dir && event.key === ' ') {
          if (target?.closest(ACTIVATABLE)) return; // Space activates a focused control
          dir = event.shiftKey ? -1 : 1;
        }
        if (!dir) return;
        handled = stepSection(dir, 'key');
      }
      if (handled) event.preventDefault();
    };

    // ---- touch (tablets get this tree): a vertical swipe is one step ----
    const coarse = window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
    let startX = 0;
    let startY = 0;
    let tracking = false;
    let nativeScroll = false;
    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) {
        tracking = false;
        return;
      }
      const touch = event.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      tracking = true;
      const target = event.target instanceof Element ? event.target : null;
      if (modalOpen() || target?.closest(MODAL)) {
        tracking = false;
        return;
      }
      nativeScroll = inVerticalScroller(target) || Boolean(target?.closest('[data-native-touch]'));
    };
    const onTouchMove = (event: TouchEvent) => {
      if (!tracking || nativeScroll || event.touches.length !== 1) return;
      const touch = event.touches[0];
      // Vertical drags belong to section stepping; horizontal ones (carousels, the map) stay native.
      if (Math.abs(touch.clientY - startY) > Math.abs(touch.clientX - startX) && event.cancelable) event.preventDefault();
    };
    const onTouchEnd = (event: TouchEvent) => {
      if (!tracking) return;
      tracking = false;
      if (nativeScroll || modalOpen()) return;
      const touch = event.changedTouches[0];
      if (!touch) return;
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      if (Math.abs(dy) < 40 || Math.abs(dy) < Math.abs(dx) * 1.2) return;
      const dir = dy < 0 ? 1 : -1;
      if (stepSection(dir, 'touch')) return;
      // Nothing to step to (the footer): scroll it like a page.
      const smoother = ScrollSmoother.get();
      const distance = dir * window.innerHeight * 0.85;
      if (smoother) smoother.scrollTo(smoother.scrollTop() + distance, true);
      else window.scrollBy({ top: distance, behavior: 'smooth' });
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);
    if (coarse) {
      window.addEventListener('touchstart', onTouchStart, { passive: true });
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd, { passive: true });
    }
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      unregister();
      cover?.remove();
      cover = null;
    };
  }, []);
}
