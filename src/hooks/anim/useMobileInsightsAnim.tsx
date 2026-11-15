import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useCallback } from 'react';
import { ensureMobileUIVisible } from '@/utils/ui';
import { DURATION, EASE } from '@/motion/tokens';

export function useMobileInsightsAnim() {
  const { contextSafe } = useGSAP();

  const enterAnimate = contextSafe(() => {
    // Ensure fixed UI elements are visible (important for browser back navigation)
    ensureMobileUIVisible();

    const tl = gsap.timeline({
      delay: DURATION.moderate, // 等待上一页退出动画 (the previous page's exit)
    });

    // 设置初始状态
    tl.set('.mobile-insights-content', {
      opacity: 0,
      y: 30,
    });

    // 内容淡入上移
    tl.to('.mobile-insights-content', {
      opacity: 1,
      y: 0,
      duration: DURATION.moderate,
      ease: EASE.out,
    });

    return tl;
  });

  const leaveAnimate = useCallback(() => {
    gsap.set('.mobile-insights-content', {
      opacity: 0,
    });
  }, []);

  return {
    enterAnimate,
    leaveAnimate,
  };
}
