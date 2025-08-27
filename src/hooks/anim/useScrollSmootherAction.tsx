import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { throttle } from 'lodash-es';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { SCROLL_ANIMATION_CONFIG } from '@/constants/scroll-config';

export const useScrollSmootherAction = ({ scrollFn, isUp }: { scrollFn: () => void; isUp?: boolean }) => {
  const [enableJudge, setEnableJudge] = useState(false);
  const isScrollingRef = useRef(false);

  const throttleScrollFn = useMemo(
    () =>
      throttle(() => {
        // console.log(`[useScrollSmootherAction] Executing scrollFn, isUp: ${isUp}`);
        isScrollingRef.current = true;
        scrollFn?.();
        // Don't disable immediately, let the scroll animation complete
        isScrollingRef.current = false;
      }, SCROLL_ANIMATION_CONFIG.THROTTLE_TIME),
    [scrollFn],
  );

  useEffect(() => {
    const handleWheel = throttle(() => {
      if (!enableJudge) {
        // console.log(`[useScrollSmootherAction] Wheel ignored - enableJudge: false, isUp: ${isUp}`);
        return;
      }

      if (isScrollingRef.current || window.isNavScrolling) {
        // console.log(`[useScrollSmootherAction] Wheel ignored - already scrolling, isUp: ${isUp}`);
        return;
      }

      const smoother = ScrollSmoother.get();
      const smootherST = smoother?.scrollTrigger as ScrollTrigger | undefined;
      if (!smootherST) return;

      const dir = smootherST.direction;
      const velocity = smootherST.getVelocity();

      // console.log(`[useScrollSmootherAction] Wheel event - dir: ${dir}, velocity: ${velocity}, isUp: ${isUp}`);

      if (Math.abs(velocity) < SCROLL_ANIMATION_CONFIG.MIN_VELOCITY) {
        // console.log(`[useScrollSmootherAction] Velocity too low, ignoring`);
        return;
      }

      if (isUp && dir === -1) {
        // console.log(`[useScrollSmootherAction] Triggering UP scroll`);
        throttleScrollFn();
      }
      if (!isUp && dir === 1) {
        // console.log(`[useScrollSmootherAction] Triggering DOWN scroll`);
        throttleScrollFn();
      }
    }, SCROLL_ANIMATION_CONFIG.THROTTLE_TIME);

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      // Cancel any pending throttled calls on unmount
      throttleScrollFn.cancel?.();
    };
  }, [enableJudge, isUp, throttleScrollFn]);

  return { enableJudge, setEnableJudge };
};
