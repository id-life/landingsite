import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { throttle } from 'lodash-es';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SCROLL_ANIMATION_CONFIG } from '@/constants/scroll-config';
import { SECTION_STEP_EVENT, SectionStepDetail } from '@/utils/section-step';

// One physical gesture = one section step. Trackpads and free-spinning wheels deliver a stream of wheel events
// (inertia) that can outlast a 0.9 s transition, so the end of the transition alone let one long gesture step
// two or more sections. After a step, the next step needs GESTURE_GAP_MS of wheel silence first.
// Shared by all twelve hook instances (one per section and direction); updated from EVERY wheel event in the
// capture phase, including the events the throttled handlers below never see.
const GESTURE_GAP_MS = 200;
let lastWheelAt = -Infinity;
let gestureHasStepped = false;
function trackWheelGesture(e: WheelEvent) {
  if (e.timeStamp - lastWheelAt >= GESTURE_GAP_MS) gestureHasStepped = false; // a new gesture began
  lastWheelAt = e.timeStamp;
}

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

      if (gestureHasStepped) return; // the rest of a gesture that already moved one section
      if ((isUp && deltaY < 0) || (!isUp && deltaY > 0)) {
        gestureHasStepped = true;
        throttleScrollFn();
      }
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

    // Same function and options from every instance: the browser registers it once.
    window.addEventListener('wheel', trackWheelGesture, { passive: true, capture: true });
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
