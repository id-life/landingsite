import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { throttle } from 'lodash-es';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SCROLL_ANIMATION_CONFIG } from '@/constants/scroll-config';
import { SECTION_STEP_EVENT, SectionStepDetail } from '@/utils/section-step';

/**
 * One direction of section stepping for one section: while `enableJudge` is true (the section is
 * current), a wheel flick, an arrow / page key or a vertical swipe in this direction runs scrollFn.
 */
export const useScrollSmootherAction = ({ scrollFn, isUp }: { scrollFn: () => void; isUp?: boolean }) => {
  const [enableJudge, setEnableJudge] = useState(false);
  const isScrollingRef = useRef(false);
  // Latest scrollFn without re-binding listeners on every render.
  const scrollFnRef = useRef(scrollFn);
  scrollFnRef.current = scrollFn;

  const throttleScrollFn = useMemo(
    () =>
      throttle(() => {
        isScrollingRef.current = true;
        scrollFnRef.current?.();
        isScrollingRef.current = false;
      }, SCROLL_ANIMATION_CONFIG.THROTTLE_TIME),
    [],
  );

  useEffect(() => {
    const busy = () => isScrollingRef.current || window.isNavScrolling || window.isResizing;

    const handleWheel = throttle((e: WheelEvent) => {
      if (!enableJudge || busy()) return;
      // Pinch-zoom on a trackpad arrives as a wheel event with ctrlKey; horizontal swipes are not
      // section changes.
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      const smoother = ScrollSmoother.get();
      const smootherST = smoother?.scrollTrigger as ScrollTrigger | undefined;
      if (!smootherST) return;

      const deltaY = e?.deltaY ?? 0;
      if (Math.abs(deltaY) < SCROLL_ANIMATION_CONFIG.MIN_VELOCITY) return;

      if ((isUp && deltaY < 0) || (!isUp && deltaY > 0)) throttleScrollFn();
    }, SCROLL_ANIMATION_CONFIG.THROTTLE_TIME);

    const handleStep = (event: Event) => {
      const detail = (event as CustomEvent<SectionStepDetail>).detail;
      if (!enableJudge) return;
      if (busy()) {
        detail.handled = true; // swallow input during a transition instead of letting it scroll natively
        return;
      }
      if ((detail.dir === 'up') !== Boolean(isUp)) return;
      detail.handled = true;
      throttleScrollFn();
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener(SECTION_STEP_EVENT, handleStep);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener(SECTION_STEP_EVENT, handleStep);
      handleWheel.cancel();
      throttleScrollFn.cancel?.();
    };
  }, [enableJudge, isUp, throttleScrollFn]);

  return { enableJudge, setEnableJudge };
};
