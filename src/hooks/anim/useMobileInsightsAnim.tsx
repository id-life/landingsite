import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useCallback } from 'react';
import { ensureMobileUIVisible } from '@/utils/ui';

export function useMobileInsightsAnim() {
  const { contextSafe } = useGSAP();

  const enterAnimate = contextSafe(() => {
    // Ensure fixed UI elements are visible (important for browser back navigation)
    ensureMobileUIVisible();

    const tl = gsap.timeline({
      delay: 0.5, // 等待上一页退出动画
    });

    // 设置初始状态
    tl.set('.mobile-insights-content', {
      opacity: 0,
      y: 30,
    });

    tl.set('.mobile-insights-nav', {
      opacity: 0,
    });

    // 内容淡入上移
    tl.to('.mobile-insights-content', {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
    });

    // 底部导航淡入
    tl.to(
      '.mobile-insights-nav',
      {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      },
      '-=0.2',
    );

    return tl;
  });

  const leaveAnimate = useCallback(() => {
    gsap.set(['.mobile-insights-content', '.mobile-insights-nav'], {
      opacity: 0,
    });
  }, []);

  return {
    enterAnimate,
    leaveAnimate,
  };
}
