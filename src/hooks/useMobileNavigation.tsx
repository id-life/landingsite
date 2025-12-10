import { innerPageIndexAtom, innerPageTotalAtom, mobileCurrentPageAtom, mobileIsScrollingAtom } from '@/atoms';
import { NAV_LIST, NavItem } from '@/components/nav/nav';
import { useMobileThemeTransition } from '@/hooks/useMobileThemeTransition';
import gsap from 'gsap';
import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';

export function useMobileNavigation() {
  const setCurrentPage = useSetAtom(mobileCurrentPageAtom);
  const setInnerPageIndex = useSetAtom(innerPageIndexAtom);
  const setInnerPageTotal = useSetAtom(innerPageTotalAtom);
  const mobileIsScrolling = useAtomValue(mobileIsScrollingAtom);
  const { isTransitioning } = useMobileThemeTransition();

  const mobileNavChange = useCallback(
    (item: NavItem) => {
      // 如果动画正在进行中，不响应新的切换请求
      if (isTransitioning || mobileIsScrolling) return;

      setCurrentPage(item);
      if (item?.id === NAV_LIST[5].id) {
        setInnerPageIndex(0);
      } else {
        gsap.to(window, { scrollTo: 0 }); // 从 connect 切换页面时，回到顶部，因为目前就他一个可以滚动的
        setInnerPageTotal(0);
      }

      if (item.href !== window.location.pathname) {
        // if has hash, don't pushState
        window.history.pushState({}, '', item.href);
      }
    },
    [isTransitioning, mobileIsScrolling, setCurrentPage, setInnerPageIndex, setInnerPageTotal],
  );

  return { mobileNavChange };
}
