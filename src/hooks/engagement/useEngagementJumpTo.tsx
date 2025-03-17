import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCallback } from 'react';

const progressMap = [0.47, 0.57, 0.67, 0.77];

export function useEngagementJumpTo() {
  const jumpTo = useCallback((index: number, onSuccess?: () => void) => {
    requestAnimationFrame(() => {
      const progress = index === -1 ? 0.38 : progressMap[index]; // -1表示跳转到有世界地图但没有任何meeting弹窗的时候
      const st = ScrollTrigger.getById('engagement-scroll-trigger');
      if (!st) return;
      const animation = st.animation;
      if (!animation) return;
      animation.progress(progress);
      onSuccess?.();
    });
  }, []);
  return { jumpTo };
}
