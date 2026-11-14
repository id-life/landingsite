'use client';

import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useEffect } from 'react';
import { dispatchSectionStep, StepDirection } from '@/utils/section-step';

const KEY_DIRECTIONS: Record<string, StepDirection> = {
  ArrowDown: 'down',
  PageDown: 'down',
  ArrowUp: 'up',
  PageUp: 'up',
};

const EDITABLE = 'input, textarea, select, [contenteditable=""], [contenteditable="true"], [role="slider"], [role="textbox"]';
const ACTIVATABLE = 'button, a[href], [role="button"], summary';

/** True when the element (or an ancestor up to the body) can scroll vertically on its own. */
function inVerticalScroller(target: EventTarget | null) {
  let el = target instanceof Element ? target : null;
  while (el && el !== document.body && el !== document.documentElement) {
    const style = getComputedStyle(el);
    if (/(auto|scroll)/.test(style.overflowY) && el.scrollHeight > el.clientHeight + 1) return true;
    el = el.parentElement;
  }
  return false;
}

/**
 * Keyboard and touch stepping for the desktop experience (mounted once in Home).
 * - ArrowUp/Down, PageUp/Down and Space / Shift+Space step one section, like a wheel flick.
 * - On touch screens (iPad and other tablets get this layout), a vertical swipe steps one section;
 *   native vertical touch scrolling is suppressed so the page never stops between sections.
 * Steps no section handles fall back to a plain scroll, so areas without a step target (the footer)
 * stay reachable.
 */
export function useSectionInput() {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest(EDITABLE) || target?.closest('[role="dialog"], [aria-modal="true"]')) return;
      let dir = KEY_DIRECTIONS[event.key];
      if (!dir && event.key === ' ') {
        if (target?.closest(ACTIVATABLE)) return; // Space activates a focused control
        dir = event.shiftKey ? 'up' : 'down';
      }
      if (!dir) return;
      if (dispatchSectionStep(dir, 'keyboard')) event.preventDefault();
    };

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
      nativeScroll = inVerticalScroller(event.target) || Boolean((event.target as Element | null)?.closest?.('[data-native-touch]'));
    };
    const onTouchMove = (event: TouchEvent) => {
      if (!tracking || nativeScroll || event.touches.length !== 1) return;
      const touch = event.touches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      // Vertical drags belong to section stepping; horizontal ones (carousels, the map) stay native.
      if (Math.abs(dy) > Math.abs(dx) && event.cancelable) event.preventDefault();
    };
    const onTouchEnd = (event: TouchEvent) => {
      if (!tracking) return;
      tracking = false;
      if (nativeScroll) return;
      const touch = event.changedTouches[0];
      if (!touch) return;
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      if (Math.abs(dy) < 40 || Math.abs(dy) < Math.abs(dx) * 1.2) return;
      const dir: StepDirection = dy < 0 ? 'down' : 'up';
      if (dispatchSectionStep(dir, 'touch')) return;
      const smoother = ScrollSmoother.get();
      const distance = (dir === 'down' ? 1 : -1) * window.innerHeight * 0.85;
      if (smoother) smoother.scrollTo(smoother.scrollTop() + distance, true);
      else window.scrollBy({ top: distance, behavior: 'smooth' });
    };

    window.addEventListener('keydown', onKeyDown);
    if (coarse) {
      window.addEventListener('touchstart', onTouchStart, { passive: true });
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd, { passive: true });
    }
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);
}
