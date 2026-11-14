'use client';

import { useEffect, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { mobileCurrentPageAtom, mobileNavOpenAtom } from '@/atoms';
import { useMobileSectionStep } from '@/components/common/MobilePageArrows';

const IGNORE = '.swiper, [data-no-swipe], .touch-none, input, textarea, select, [role="dialog"], [aria-modal="true"]';

/** True when a scrollable ancestor of the target (or the page itself) can still scroll that way. */
function canScroll(target: Element | null, dir: 'up' | 'down') {
  let el: Element | null = target;
  while (el && el !== document.body && el !== document.documentElement) {
    const style = getComputedStyle(el);
    if (/(auto|scroll)/.test(style.overflowY) && el.scrollHeight > el.clientHeight + 1) {
      if (dir === 'down' && el.scrollTop + el.clientHeight < el.scrollHeight - 1) return true;
      if (dir === 'up' && el.scrollTop > 0) return true;
    }
    el = el.parentElement;
  }
  const page = document.scrollingElement ?? document.documentElement;
  if (dir === 'down') return window.scrollY + window.innerHeight < page.scrollHeight - 1;
  return window.scrollY > 0;
}

/**
 * Vertical swipes move through the phone experience like the arrow buttons. (Before, only the two
 * 40 px arrows, the START pill and the menu could change sections.) Content that scrolls on its
 * own (the Connect section) scrolls first; a swipe past its edge changes section.
 */
export function useMobileSwipe() {
  const step = useMobileSectionStep();
  const stepRef = useRef(step);
  stepRef.current = step;
  const menuOpen = useAtomValue(mobileNavOpenAtom);
  const menuOpenRef = useRef(menuOpen);
  menuOpenRef.current = menuOpen;
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const pageRef = useRef(currentPage);
  pageRef.current = currentPage;

  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let couldScrollDown = false;
    let couldScrollUp = false;
    let tracking = false;

    const onStart = (event: TouchEvent) => {
      tracking = false;
      if (event.touches.length !== 1 || menuOpenRef.current) return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest(IGNORE)) return;
      const touch = event.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      // Remember whether content could scroll when the finger went down, so a swipe that scrolls
      // content to its end does not also change section.
      couldScrollDown = canScroll(target, 'down');
      couldScrollUp = canScroll(target, 'up');
      tracking = true;
    };
    const onEnd = (event: TouchEvent) => {
      if (!tracking) return;
      tracking = false;
      const touch = event.changedTouches[0];
      if (!touch) return;
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      if (Math.abs(dy) < 50 || Math.abs(dy) < Math.abs(dx) * 1.3) return;
      const dir = dy < 0 ? 'down' : 'up';
      if ((dir === 'down' && couldScrollDown) || (dir === 'up' && couldScrollUp)) return;
      if (pageRef.current.id === 'connect_page' && dir === 'down') return; // last section
      stepRef.current(dir === 'up');
    };

    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchend', onEnd);
    };
  }, []);
}
