import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCallback } from 'react';

const progressMap = [0.47, 0.57, 0.67, 0.77];

export function useEngagementJumpTo() {
  const jumpTo = useCallback((index: number, onSuccess?: () => void) => {
    requestAnimationFrame(() => {
      const progress = progressMap[index];
      const st = ScrollTrigger.getById('engagement-scroll-trigger');
      if (!st) return;
      st.scroll(st.start + (st.end - st.start) * progress);
      const animation = st.animation;
      if (!animation) return;
      animation.progress(progress);
      onSuccess?.();
    });
  }, []);
  return { jumpTo };
}
