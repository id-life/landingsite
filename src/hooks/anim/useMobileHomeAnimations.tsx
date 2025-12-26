import { mobileCurrentPageAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { BACKGROUND_THEME } from '@/constants/config';
import gsap from 'gsap';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { useMobileThemeTransition } from '../useMobileThemeTransition';

export function useMobileHomeAnimateInit() {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const { transitionToTheme } = useMobileThemeTransition();

  useEffect(() => {
    if (NAV_LIST[1].id === currentPage.id) {
      transitionToTheme(BACKGROUND_THEME.BLACK_RED);
    } else if (NAV_LIST[2].id === currentPage.id) {
      transitionToTheme(BACKGROUND_THEME.BLACK_RED_2);
    } else if (NAV_LIST[3].id === currentPage.id) {
      transitionToTheme(BACKGROUND_THEME.BLACK);
    } else {
      transitionToTheme(BACKGROUND_THEME.LIGHT);
    }

    const tl = gsap.timeline({
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.1,
    });

    if ([NAV_LIST[3].id, NAV_LIST[4].id, NAV_LIST[5].id, NAV_LIST[6].id].includes(currentPage.id)) {
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
