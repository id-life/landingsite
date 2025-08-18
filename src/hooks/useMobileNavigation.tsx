import { innerPageIndexAtom, innerPageTotalAtom, mobileCurrentPageAtom, mobileIsScrollingAtom } from '@/atoms';
import { NAV_LIST, NavItem } from '@/components/nav/nav';
import { BACKGROUND_THEME, BackgroundTheme } from '@/constants/config';
import { useMobileThemeTransition } from '@/hooks/useMobileThemeTransition';
import gsap from 'gsap';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';

export function useMobileNavigation() {
  const [currentPage, setCurrentPage] = useAtom(mobileCurrentPageAtom);
  const isAnimatingRef = useRef(false);
  const setInnerPageIndex = useSetAtom(innerPageIndexAtom);
  const setInnerPageTotal = useSetAtom(innerPageTotalAtom);
  const mobileIsScrolling = useAtomValue(mobileIsScrollingAtom);
  const { transitionToTheme, isTransitioning } = useMobileThemeTransition();

  const changeBackground = useCallback(
    (theme: BackgroundTheme) => {
      transitionToTheme(theme);
    },
    [transitionToTheme],
  );

  useEffect(() => {
    if (NAV_LIST[1].id === currentPage.id) {
      changeBackground(BACKGROUND_THEME.BLACK_RED);
    } else if (NAV_LIST[2].id === currentPage.id) {
      changeBackground(BACKGROUND_THEME.BLACK_RED_2);
    } else if (NAV_LIST[3].id === currentPage.id) {
      changeBackground(BACKGROUND_THEME.BLACK);
    } else {
      changeBackground(BACKGROUND_THEME.LIGHT);
    }

    const tl = gsap.timeline({
      onStart: () => {
        isAnimatingRef.current = true;
      },
      onComplete: () => {
        isAnimatingRef.current = false;
      },
    });

    if ([NAV_LIST[3].id, NAV_LIST[4].id, NAV_LIST[5].id].includes(currentPage.id)) {
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
  }, [changeBackground, currentPage]);

  const mobileNavChange = useCallback(
    (item: NavItem) => {
      // 如果动画正在进行中，不响应新的切换请求
      if (isAnimatingRef.current || isTransitioning || mobileIsScrolling) return;

      setCurrentPage(item);
      if (item?.id === NAV_LIST[5].id) {
        setInnerPageIndex(0);
      } else {
        gsap.to(window, { scrollTo: 0 }); // 从 value 切换页面时，回到顶部，因为目前就他一个可以滚动的
        setInnerPageTotal(0);
      }

      window.history.pushState({}, '', item.href);
    },
    [isTransitioning, mobileIsScrolling, setCurrentPage, setInnerPageIndex, setInnerPageTotal],
  );

  return { mobileNavChange };
}
