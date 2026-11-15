import { innerPageIndexAtom, innerPageTotalAtom, mobileCurrentPageAtom } from '@/atoms';
import { NAV_LIST, NavItem } from '@/components/nav/nav';
import { useMobileThemeTransition } from '@/hooks/useMobileThemeTransition';
import gsap from 'gsap';
import { useSetAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';
import { sectionTitle } from '@/constants/section-titles';
import { noteSectionView } from '@/lib/analytics/section-view';

export function useMobileNavigation() {
  const setCurrentPage = useSetAtom(mobileCurrentPageAtom);
  const setInnerPageIndex = useSetAtom(innerPageIndexAtom);
  const setInnerPageTotal = useSetAtom(innerPageTotalAtom);
  const { isTransitioning } = useMobileThemeTransition();
  const isTransitioningRef = useRef(isTransitioning);
  isTransitioningRef.current = isTransitioning;
  // One section change asked for during a background theme transition waits for it (the latest wins).
  // It used to be dropped silently, so a menu tap or an arrow tap at the wrong moment did nothing.
  const pendingRef = useRef<NavItem | null>(null);

  const go = useCallback(
    (item: NavItem) => {
      setCurrentPage(item);
      setInnerPageIndex(0); // 切换页面时重置内页索引
      if (item?.id === NAV_LIST[6].id) {
        // connect 页面不需要额外处理
      } else {
        gsap.to(window, { scrollTo: 0 }); // 从 connect 切换页面时，回到顶部，因为目前就他一个可以滚动的
        setInnerPageTotal(0);
      }

      if (item.href !== window.location.pathname) {
        // Keep the query string (campaign parameters) across section changes. Title first: GA4's page_view for
        // this pushState reads it (DATA-05).
        document.title = sectionTitle(item);
        window.history.pushState({}, '', `${item.href}${window.location.search}`);
        noteSectionView(document.title);
      }
    },
    [setCurrentPage, setInnerPageIndex, setInnerPageTotal],
  );

  const mobileNavChange = useCallback(
    (item: NavItem) => {
      if (isTransitioningRef.current) {
        pendingRef.current = item;
        return;
      }
      go(item);
    },
    [go],
  );

  useEffect(() => {
    if (isTransitioning || !pendingRef.current) return;
    const item = pendingRef.current;
    pendingRef.current = null;
    go(item);
  }, [isTransitioning, go]);

  return { mobileNavChange };
}
