import gsap from 'gsap';
import { useCallback, useRef } from 'react';

export function useMobileEngagementAnim() {
  const enterTLRef = useRef<gsap.core.Timeline | null>(null);

  const enterAnimate = useCallback(() => {
    console.log('enterAnimate');
    if (enterTLRef.current) enterTLRef.current.kill();

    const enterTL = gsap.timeline({
      duration: 0.3,
    });
    enterTLRef.current = enterTL;

    enterTL.set(
      ['.world-map-region', '.world-map-dot', '.world-map-dot-book', '.world-map-dot-sponsor', '.world-map-container'],
      {
        opacity: 0,
      },
    );

    // 入场动画序列
    enterTL.to('.world-map-container', {
      opacity: 1,
    });
    enterTL.to(
      '.world-map-img',
      {
        y: 0,
        opacity: 1,
        ease: 'none',
      },
      '<',
    );

    enterTL.to(['.world-map-region', '.world-map-dot', '.world-map-dot-book', '.world-map-dot-sponsor'], {
      opacity: 1,
      scale: 1,
      ease: 'power2.out',
      stagger: 0.05,
    });
    enterTLRef.current?.play();
    return () => {
      enterTLRef.current?.kill();
    };
  }, []);

  return {
    enterAnimate,
  };
}
