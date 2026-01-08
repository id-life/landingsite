import { mobileCurrentPageAtom } from '@/atoms';
import { BACKGROUND_THEME } from '@/constants/config';
import gsap from 'gsap';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { useMobileThemeTransition } from '../useMobileThemeTransition';

// 隐藏固定 UI 的页面
const HIDE_FIXED_UI_PAGES = ['engagement_page', 'twin_page', 'insights_page', 'connect_page'] as const;

export function useMobileHomeAnimateInit() {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const { transitionToTheme } = useMobileThemeTransition();

  useEffect(() => {
    if (currentPage.id === 'portfolio_page') {
      transitionToTheme(BACKGROUND_THEME.BLACK_RED);
    } else if (currentPage.id === 'spectrum_page') {
      transitionToTheme(BACKGROUND_THEME.BLACK_RED_2);
    } else if (currentPage.id === 'engagement_page') {
      transitionToTheme(BACKGROUND_THEME.BLACK);
    } else {
      transitionToTheme(BACKGROUND_THEME.LIGHT);
    }

    const tl = gsap.timeline({
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.1,
    });

    if (HIDE_FIXED_UI_PAGES.includes(currentPage.id as (typeof HIDE_FIXED_UI_PAGES)[number])) {
      tl.to(['.fixed-top', '.fixed-bottom'], {
        opacity: 0,

        y: 20,
      });
    } else {
      tl.to(['.fixed-top', '.fixed-bottom'], {
        opacity: 1,
        y: 0,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);
}
