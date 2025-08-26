import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { throttle } from 'lodash-es';
import { useEffect, useMemo, useState } from 'react';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

export const useScrollSmootherAction = ({ scrollFn, isUp }: { scrollFn: () => void; isUp?: boolean }) => {
  const [enableJudge, setEnableJudge] = useState(false);
  const throttleScrollFn = useMemo(
    () =>
      throttle(() => {
        scrollFn?.();
        setEnableJudge(false);
      }, 100),
    [scrollFn],
  );

  useEffect(() => {
    if (!enableJudge) return;

    const handleWheel = (e: WheelEvent) => {
      if (!enableJudge) return;
      const smoother = ScrollSmoother.get();
      const smootherST = smoother?.scrollTrigger as ScrollTrigger | undefined;
      if (!smootherST) return;

      const dir = smootherST.direction;
      const velocity = smootherST.getVelocity();

      if (Math.abs(velocity) < 1) return; // 速度小于1时，不执行滚动 防止一些 bug
      if (isUp && dir === -1) {
        // 向上滚动
        throttleScrollFn();
      }
      if (!isUp && dir === 1) {
        // 向下滚动
        throttleScrollFn();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [enableJudge, isUp, throttleScrollFn]);

  return { enableJudge, setEnableJudge };
};
