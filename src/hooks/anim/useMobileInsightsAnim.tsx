import { useGSAP } from '@gsap/react';
import { PHONE } from '@/motion/original';
import { announceEntrance } from '@/motion/phoneHandover';
import gsap from 'gsap';
import { useCallback } from 'react';
import { ensureMobileUIVisible } from '@/utils/ui';
import { isReducedMotion } from '@/motion/preference';

export function useMobileInsightsAnim() {
  const { contextSafe } = useGSAP();

  const enterAnimate = contextSafe(() => {
    // Ensure fixed UI elements are visible (important for browser back navigation)
    ensureMobileUIVisible();

    // Reduced motion (MOT-02): the content in its final place at once. (A timeline whose durations all read 0
    // left it at the set() start state: invisible.)
    if (isReducedMotion()) {
      gsap.set('.mobile-insights-content', { opacity: 1, y: 0 });
      announceEntrance('insights_page');
      return null;
    }

    const tl = gsap.timeline({
      delay: PHONE.insightsIn.delay, // 等待上一页退出动画 (the previous page's exit)
      // The section being left stays drawn until now (MOT-05, src/motion/phoneHandover.ts).
      onStart: () => announceEntrance('insights_page'),
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
      duration: PHONE.insightsIn.duration,
      ease: PHONE.insightsIn.ease,
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
