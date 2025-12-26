import { throttle } from 'lodash-es';
import { useEffect, useRef, useState } from 'react';
import { SCROLL_ANIMATION_CONFIG } from '@/constants/scroll-config';

export const useScrollSmootherAction = ({ scrollFn, isUp }: { scrollFn: () => void; isUp?: boolean }) => {
  const [enableJudge, setEnableJudge] = useState(false);
  const scrollFnRef = useRef(scrollFn);
  scrollFnRef.current = scrollFn;

  useEffect(() => {
    const handleWheel = throttle(
      (e: WheelEvent) => {
        if (!enableJudge || window.isNavScrolling || window.isResizing) {
          return;
        }

        const deltaY = e?.deltaY ?? 0;

        if (Math.abs(deltaY) < SCROLL_ANIMATION_CONFIG.MIN_VELOCITY) {
          return;
        }

        if (isUp && deltaY < 0) {
          scrollFnRef.current?.();
        }
        if (!isUp && deltaY > 0) {
          scrollFnRef.current?.();
        }
      },
      SCROLL_ANIMATION_CONFIG.THROTTLE_TIME,
      { leading: true, trailing: false },
    );

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      handleWheel.cancel?.();
    };
  }, [enableJudge, isUp]);

  return { enableJudge, setEnableJudge };
};
