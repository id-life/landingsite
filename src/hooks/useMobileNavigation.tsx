import { mobileCurrentPageAtom } from '@/atoms';
import { NAV_LIST, NavItem } from '@/components/nav/nav';
import gsap from 'gsap';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';

export function useMobileNavigation() {
  const [currentPage, setCurrentPage] = useAtom(mobileCurrentPageAtom);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isAnimatingRef = useRef(false);

  const changeToDarkBackground = useCallback((isDark: boolean) => {
    const root = document.documentElement;
    if (!root) return;

    // 如果有正在进行的动画，先清除它
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // 创建新的timeline
    const tl = gsap.timeline({
      onStart: () => {
        isAnimatingRef.current = true;
      },
      onComplete: () => {
        isAnimatingRef.current = false;
        timelineRef.current = null;
      },
    });
    timelineRef.current = tl;

    if (isDark) {
      tl.set('.base-background2', { opacity: 0 }).to(root, {
        '--gradient-from': '#000000',
        '--gradient-to': '#C111114C',
        '--background': '#000000',
        '--foreground': '#F0F0F0',
        duration: 0.5,
      });
    } else {
      tl.to('.base-background2', { opacity: 1, duration: 0.5 }).to(
        root,
        {
          '--gradient-from': '#FFFFFF',
          '--gradient-to': '#CBD6EA',
          '--background': '#F0F0F0',
          '--foreground': '#000000',
          duration: 0.5,
        },
        '<',
      );
    }
  }, []);

  useEffect(() => {
    changeToDarkBackground(currentPage.id === NAV_LIST[1].id);

    const tl = gsap.timeline({
      onStart: () => {
        isAnimatingRef.current = true;
      },
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });

    if (currentPage.id === NAV_LIST[3].id) {
      tl.to(['.fixed-top', '.fixed-bottom'], {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.1,
        y: 20,
      });
    } else {
      tl.to(['.fixed-top', '.fixed-bottom'], {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.1,
        y: 0,
      });
    }
  }, [changeToDarkBackground, currentPage]);

  const mobileNavChange = useCallback(
    (item: NavItem) => {
      // 如果动画正在进行中，不响应新的切换请求
      if (isAnimatingRef.current) return;
      setCurrentPage(item);
    },
    [setCurrentPage],
  );

  return { mobileNavChange };
}
