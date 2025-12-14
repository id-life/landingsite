import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useCallback } from 'react';

export function useMobileInsightsAnim() {
  const { contextSafe } = useGSAP();

  const enterAnimate = contextSafe(() => {
    const enterTL = gsap.timeline({
      defaults: {
        ease: 'power2.out',
      },
    });

    // 设置初始状态 - 所有 section 隐藏并向下偏移
    enterTL.set('.insights-section', {
      opacity: 0,
      y: 30,
    });

    // 依次显示三个 section
    enterTL.to('.insights-section-news', {
      opacity: 1,
      y: 0,
      duration: 0.5,
    });

    enterTL.to(
      '.insights-section-talks',
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
      },
      '-=0.3',
    );

    enterTL.to(
      '.insights-section-podcast',
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
      },
      '-=0.3',
    );

    enterTL.play();
  });

  const leaveAnimate = useCallback(() => {
    // 重置所有元素状态
    gsap.set('.insights-section', {
      opacity: 0,
      y: 30,
    });
  }, []);

  return {
    enterAnimate,
    leaveAnimate,
  };
}
