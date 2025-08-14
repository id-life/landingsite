import { mobileCurrentThemeAtom, mobileThemeTransitioningAtom } from '@/atoms';
import { BACKGROUND_COLORS, BackgroundTheme } from '@/constants/config';
import gsap from 'gsap';
import { useAtom } from 'jotai';
import { useCallback, useRef } from 'react';

export function useMobileThemeTransition() {
  const [currentTheme, setCurrentTheme] = useAtom(mobileCurrentThemeAtom);
  const [isTransitioning, setIsTransitioning] = useAtom(mobileThemeTransitioningAtom);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const transitionToTheme = useCallback(
    (theme: BackgroundTheme) => {
      const root = document.documentElement;
      if (!root) return;

      // 如果有正在进行的动画，先清除它
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      // 创建新的timeline
      const tl = gsap.timeline({
        onStart: () => {
          setIsTransitioning(true);
        },
        onComplete: () => {
          setIsTransitioning(false);
          timelineRef.current = null;
          setCurrentTheme(theme);
        },
      });

      timelineRef.current = tl;

      // 执行主题切换动画
      tl.set('.base-background2', { opacity: 0 }).to(root, {
        ...BACKGROUND_COLORS[theme],
        duration: 0.5,
      });
    },
    [setCurrentTheme, setIsTransitioning],
  );

  return {
    currentTheme,
    isTransitioning,
    transitionToTheme,
  };
}
