import { innerPageIndexAtom, innerPageTotalAtom, mobileCurrentPageAtom, mobileIsScrollingAtom } from '@/atoms';
import { NAV_LIST, NavItem } from '@/components/nav/nav';
import { BACKGROUND_COLORS, BACKGROUND_THEME, BackgroundTheme } from '@/constants/config';
import gsap from 'gsap';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';

export function useMobileNavigation() {
  const [currentPage, setCurrentPage] = useAtom(mobileCurrentPageAtom);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isAnimatingRef = useRef(false);
  const setInnerPageIndex = useSetAtom(innerPageIndexAtom);
  const setInnerPageTotal = useSetAtom(innerPageTotalAtom);
  const mobileIsScrolling = useAtomValue(mobileIsScrollingAtom);
  const changeBackground = useCallback((theme: BackgroundTheme) => {
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
    switch (theme) {
      case BACKGROUND_THEME.BLACK_RED:
        tl.set('.base-background2', { opacity: 0 }).to(root, {
          ...BACKGROUND_COLORS[BACKGROUND_THEME.BLACK_RED],
          duration: 0.5,
        });
        break;
      case BACKGROUND_THEME.BLACK:
        tl.set('.base-background2', { opacity: 0 }).to(root, {
          ...BACKGROUND_COLORS[BACKGROUND_THEME.BLACK],
          duration: 0.5,
        });
        break;
      default:
        tl.to(
          root,
          {
            ...BACKGROUND_COLORS[BACKGROUND_THEME.LIGHT],
            duration: 0.5,
          },
          '<',
        );
        break;
    }
  }, []);

  useEffect(() => {
    if (NAV_LIST[1].id === currentPage.id) {
      changeBackground(BACKGROUND_THEME.BLACK_RED);
    } else if (NAV_LIST[2].id === currentPage.id) {
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

    if ([NAV_LIST[2].id, NAV_LIST[3].id].includes(currentPage.id)) {
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
      if (isAnimatingRef.current || mobileIsScrolling) return;

      setCurrentPage(item);
      if (item?.id === NAV_LIST[4].id) {
        setInnerPageIndex(0);
      } else {
        gsap.to(window, { scrollTo: 0 }); // 从 value 切换页面时，回到顶部，因为目前就他一个可以滚动的
        setInnerPageTotal(0);
      }
    },
    [mobileIsScrolling, setCurrentPage, setInnerPageIndex, setInnerPageTotal],
  );

  return { mobileNavChange };
}
