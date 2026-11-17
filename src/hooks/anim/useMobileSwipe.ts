'use client';

import { useEffect, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { mobileCurrentPageAtom, mobileNavOpenAtom } from '@/atoms';
import { useSectionStep } from '@/components/common/SectionPager';

const IGNORE = '[data-no-swipe], input, textarea, select, [role="dialog"], [aria-modal="true"]';
// Horizontal carousels (Swiper) and the Presence map (touch-none, scrolls sideways) keep horizontal
// drags; a swipe that starts on them changes section only when it is clearly vertical.
const HORIZONTAL_ZONE = '.swiper, .touch-none';

/** The nearest ancestor of the target that scrolls vertically on its own, if any. */
function verticalScroller(target: Element | null): Element | null {
  let el: Element | null = target;
  while (el && el !== document.body && el !== document.documentElement) {
    const style = getComputedStyle(el);
    if (/(auto|scroll)/.test(style.overflowY) && el.scrollHeight > el.clientHeight + 1) return el;
    el = el.parentElement;
  }
  return null;
}

/**
 * Vertical swipes move through the phone experience like the arrow buttons. (Before, only the two
 * 40 px arrows, the START pill and the menu could change sections.) Content that scrolls on its
 * own (the Connect section) scrolls first; a swipe past its edge changes section.
 *
 * "Did this swipe scroll something?" is measured, not predicted. Predicting from scrollHeight broke
 * on a page a couple of pixels taller than the viewport (iOS Safari's toolbars do this routinely):
 * the body cannot scroll (overflow hidden) but the check said it could, and every swipe up was
 * swallowed.
 *
 * `enabled` is false on the other deck's mount of Home (one Home for both decks): the hook then does nothing.
 */
export function useMobileSwipe(enabled = true) {
  const step = useSectionStep();
  const stepRef = useRef(step);
  stepRef.current = step;
  const menuOpen = useAtomValue(mobileNavOpenAtom);
  const menuOpenRef = useRef(menuOpen);
  menuOpenRef.current = menuOpen;
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const pageRef = useRef(currentPage);
  pageRef.current = currentPage;

  useEffect(() => {
    if (!enabled) return;
    let startX = 0;
    let startY = 0;
    let scroller: Element | null = null;
    let scrollerTop = 0;
    let pageY = 0;
    let tracking = false;
    let horizontalZone = false;

    const onStart = (event: TouchEvent) => {
      tracking = false;
      if (event.touches.length !== 1 || menuOpenRef.current) return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest(IGNORE)) return;
      const touch = event.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      horizontalZone = Boolean(target?.closest(HORIZONTAL_ZONE));
      scroller = verticalScroller(target);
      scrollerTop = scroller?.scrollTop ?? 0;
      pageY = window.scrollY;
      tracking = true;
    };
    const onEnd = (event: TouchEvent) => {
      if (!tracking) return;
      tracking = false;
      const touch = event.changedTouches[0];
      if (!touch) return;
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      if (Math.abs(dy) < 50 || Math.abs(dy) < Math.abs(dx) * (horizontalZone ? 2 : 1.3)) return;
      const dir = dy < 0 ? 'down' : 'up';
      // The swipe scrolled content (or the page): it was a scroll, not a section change. A swipe
      // against content already at its edge moves nothing, so it changes section.
      const scrolled =
        Math.abs(window.scrollY - pageY) > 2 || (scroller !== null && Math.abs(scroller.scrollTop - scrollerTop) > 2);
      if (scrolled) return;
      if (pageRef.current.id === 'connect_page' && dir === 'down') return; // last section
      stepRef.current(dir === 'up', 'swipe');
    };

    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchend', onEnd);
    };
  }, [enabled]);
}
