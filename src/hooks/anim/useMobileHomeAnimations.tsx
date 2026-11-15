import { mobileCurrentPageAtom } from '@/atoms';
import { BACKGROUND_THEME } from '@/constants/config';
import gsap from 'gsap';
import { useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';
import { useMobileThemeTransition } from '../useMobileThemeTransition';
import { DURATION, EASE, STAGGER } from '@/motion/tokens';

// 隐藏固定 UI 的页面
const HIDE_FIXED_UI_PAGES = ['engagement_page', 'twin_page', 'insights_page', 'connect_page'] as const;

export function useMobileHomeAnimateInit() {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const { transitionToTheme } = useMobileThemeTransition();
  // The first theme is set on mount, under the loader: no transition. An animated one would block
  // navigation for 0.5 s (mobileNavChange ignores requests while a theme transition runs) and drop a
  // deep link that the router applies as soon as a fast first load ends.
  const mountedRef = useRef(false);

  useEffect(() => {
    const options = { instant: !mountedRef.current };
    mountedRef.current = true;
    if (currentPage.id === 'portfolio_page') {
      transitionToTheme(BACKGROUND_THEME.BLACK_RED, options);
    } else if (currentPage.id === 'spectrum_page') {
      transitionToTheme(BACKGROUND_THEME.BLACK_RED_2, options);
    } else if (currentPage.id === 'engagement_page') {
      transitionToTheme(BACKGROUND_THEME.BLACK, options);
    } else {
      transitionToTheme(BACKGROUND_THEME.LIGHT, options);
    }

    // Duration, ease and stagger in defaults: among a timeline's own vars GSAP ignores them (MOT-08).
    const tl = gsap.timeline({ defaults: { duration: DURATION.moderate, ease: EASE.out, stagger: STAGGER.block } });

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
