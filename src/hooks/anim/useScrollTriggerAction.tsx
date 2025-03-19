import { useEffect, useMemo, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { throttle } from 'lodash-es';

export const useScrollTriggerAction = ({
  triggerId,
  scrollFn,
  isUp,
}: {
  triggerId: string;
  scrollFn: () => void;
  isUp?: boolean;
}) => {
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
      if (!isUp && e.deltaY > 0) {
        // 向下滚动
        const trigger = ScrollTrigger.getById(triggerId);
        if (trigger && window.scrollY > trigger.end) {
          // console.log('scrollFn down end', window.scrollY, trigger.end, enableJudge);
          throttleScrollFn();
        }
      }
      if (isUp && e.deltaY < 0) {
        // 向上滚动
        const trigger = ScrollTrigger.getById(triggerId);
        if (trigger && window.scrollY < trigger.start) {
          // console.log('scrollFn up start', window.scrollY, trigger.start, enableJudge);
          throttleScrollFn();
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [enableJudge]);

  return { enableJudge, setEnableJudge };
};
