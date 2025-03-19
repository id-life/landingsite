import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCallback } from 'react';

export const engagementProgressMap = [0.33, 0.52, 0.67, 0.75];

export function useEngagementJumpTo() {
  const jumpTo = useCallback((index: number, onSuccess?: () => void) => {
    requestAnimationFrame(() => {
      const progress = index === -1 ? 0.21 : engagementProgressMap[index]; // -1表示跳转到有世界地图但没有任何meeting弹窗的时候
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
