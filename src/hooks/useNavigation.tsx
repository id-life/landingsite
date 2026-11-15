import { currentPageAtom, innerPageIndexAtom, innerPageTotalAtom, navigateToAtom } from '@/atoms';
import { NAV_LIST, NavItem } from '@/components/nav/nav';
import { sectionTitle } from '@/constants/section-titles';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAtom, useSetAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';
import { engagementProgressMap } from './engagement/useEngagementJumpTo';
import { useThrottle } from './useThrottle';
import { useGSAP } from '@gsap/react';

/**
 * One history entry per explicit navigation, and none when the address is already right (Back and
 * Forward call the same navigation; pushing again there would break the Forward stack). Keeps the
 * query string so campaign parameters survive.
 */
function pushSectionUrl(path: string, hash = '') {
  if (window.location.pathname === path && window.location.hash === hash) return;
  // The title first: GA4 reads it when the tag's history listener sees the pushState (DATA-05), so a nav-click
  // page_view carries the section's own title, not the previous one.
  const item = NAV_LIST.find((nav) => nav.href === path);
  if (item) document.title = sectionTitle(item);
  window.history.pushState({}, '', `${path}${window.location.search}${hash}`);
}

export function useNavigation() {
  const setCurrentPage = useSetAtom(currentPageAtom);
  const [navigateTo, setNavigateTo] = useAtom(navigateToAtom);
  const setInnerPageIndex = useSetAtom(innerPageIndexAtom);
  const setInnerPageTotal = useSetAtom(innerPageTotalAtom);

  const handleNavClickImpl = useCallback(
    (item: NavItem) => {
      const smoother = ScrollSmoother.get();
      if (!smoother) return;

      const id = item.id;
      if (id === 'vision_page') {
        window.isNavScrolling = true;
        smoother?.scrollTo(`#${id}`, false, '1px');
        setTimeout(() => {
          window.isNavScrolling = false;
        }, 500);
        pushSectionUrl('/');
      } else if (id === 'portfolio_page') {
        // portfolio 页 偏移 & contact 需要处理
        window.isNavScrolling = true;
        smoother?.scrollTo(`#${id}`, false);
        requestAnimationFrame(() => {
          const st = ScrollTrigger.getById('portfolio-trigger');
          if (!st) return;
          smoother?.scrollTo(st.start + (st.end - st.start) * 0.965, false);
        });
        setTimeout(() => {
          window.isNavScrolling = false;
        }, 500);
        pushSectionUrl('/portfolio');
      } else if (id === 'spectrum_page') {
        window.isNavScrolling = true;
        smoother?.scrollTo(`#${item.id}`, false);
        requestAnimationFrame(() => {
          const st = ScrollTrigger.getById('spectrum-trigger');
          if (!st) return;
          smoother?.scrollTo(st.start + (st.end - st.start) * 0.965, false);
        });
        setTimeout(() => {
          window.isNavScrolling = false;
        }, 500);
        // Preserve hash if it exists (for spectrum routing)
        pushSectionUrl('/spectrum', window.location.hash);
      } else if (id === 'engagement_page') {
        // engagement 页
        window.isNavScrolling = true;
        smoother?.scrollTo(`#${item.id}`, false);
        requestAnimationFrame(() => {
          const st = ScrollTrigger.getById('engagement-scroll-trigger');
          if (!st) return;
          smoother?.scrollTo(st.start + (st.end - st.start) * engagementProgressMap[0], false);
        });
        setTimeout(() => {
          window.isNavScrolling = false;
        }, 500);
        // Preserve hash if it exists (for spectrum routing)
        pushSectionUrl('/presence', window.location.hash);
      } else if (id === 'twin_page') {
        window.isNavScrolling = true;
        smoother?.scrollTo(`#${item.id}`, false, 'top 10px');
        requestAnimationFrame(() => {
          const st = ScrollTrigger.getById('twin-scroll-trigger');
          const twinShow = st?.labelToScroll('twin-show');
          if (!twinShow) return;
          smoother?.scrollTo(twinShow, false);
        });
        setTimeout(() => {
          window.isNavScrolling = false;
        }, 500);
        pushSectionUrl('/digitaltwin');
      } else if (id === 'insights_page') {
        window.isNavScrolling = true;
        smoother?.scrollTo(`#${item.id}`, false, 'top 10px');
        requestAnimationFrame(() => {
          const st = ScrollTrigger.getById('insights-scroll-trigger');
          if (!st) return;
          smoother?.scrollTo(st.start + (st.end - st.start) * 0.5, false);
        });
        setTimeout(() => {
          window.isNavScrolling = false;
        }, 500);
        pushSectionUrl('/insights');
      } else if (id === 'connect_page') {
        window.isNavScrolling = true;
        smoother?.scrollTo(`#${item.id}`, false);
        requestAnimationFrame(() => {
          const st = ScrollTrigger.getById('connect-page1-scroll-trigger');
          if (!st) return;
          smoother?.scrollTo(st.end, false);
        });
        setTimeout(() => {
          window.isNavScrolling = false;
        }, 500);
        pushSectionUrl('/connect');
      } else {
        // 其他 正常滚
        window.isNavScrolling = true;
        smoother?.scrollTo(`#${id}`, false);
        setTimeout(() => {
          window.isNavScrolling = false;
        }, 500);
      }

      setCurrentPage(item);
      if (id === 'connect_page') {
        setInnerPageIndex(0);
      } else {
        setInnerPageTotal(0);
      }
    },
    [setCurrentPage, setInnerPageIndex, setInnerPageTotal],
  );

  const handleNavClick = useThrottle(handleNavClickImpl, 500);
  // Unthrottled, for programmatic navigation that must not be swallowed by an earlier no-op call
  // (HashRouter applying the URL when the experience mounts).
  const handleNavClickNow = handleNavClickImpl;

  useEffect(() => {
    if (navigateTo) {
      handleNavClick(navigateTo);
      setCurrentPage(navigateTo);
      setNavigateTo(null);
    }
  }, [handleNavClick, navigateTo, setCurrentPage, setNavigateTo]);

  return { handleNavClick, handleNavClickNow };
}
