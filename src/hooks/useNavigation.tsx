import { currentPageAtom, innerPageIndexAtom, innerPageTotalAtom, navigateToAtom } from '@/atoms';
import { NAV_LIST, NavItem } from '@/components/nav/nav';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAtom, useSetAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';
import { engagementProgressMap } from './engagement/useEngagementJumpTo';
import { useThrottle } from './useThrottle';
import { useGSAP } from '@gsap/react';

export function useNavigation() {
  const setCurrentPage = useSetAtom(currentPageAtom);
  const [navigateTo, setNavigateTo] = useAtom(navigateToAtom);
  const setInnerPageIndex = useSetAtom(innerPageIndexAtom);
  const setInnerPageTotal = useSetAtom(innerPageTotalAtom);

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: `#${NAV_LIST[1].id}`,
      start: 'top bottom',
      endTrigger: `#${NAV_LIST[1].id}`,
      end: 'top top',
      onEnter: () => {
        if (window.isNavScrolling) return;
        window.isNavScrolling = true;
        const st = ScrollTrigger.getById('portfolio-trigger');
        if (!st) return;
        gsap.to(window, {
          duration: 3,
          scrollTo: { y: st.start + (st.end - st.start) * 0.95 },
          onComplete: () => {
            window.isNavScrolling = false;
          },
          ease: 'power4.inOut',
        });
      },
    });
  });

  const handleNavClickImpl = useCallback(
    (item: NavItem) => {
      const smoother = ScrollSmoother.get();
      if (!smoother) return;

      const id = item.id;
      if (id === NAV_LIST[0].id) {
        window.isNavScrolling = true;
        smoother?.scrollTo(`#${id}`, false, '1px');
        setTimeout(() => {
          window.isNavScrolling = false;
        }, 500);
      } else if (id === NAV_LIST[1].id) {
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
      } else if (id === NAV_LIST[2].id) {
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
      } else if (id === NAV_LIST[3].id) {
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
      } else if (item.id === NAV_LIST[4].id) {
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
      } else if (item.id === NAV_LIST[5].id) {
        window.isNavScrolling = true;
        smoother?.scrollTo(`#${item.id}`, false);
        requestAnimationFrame(() => {
          const st = ScrollTrigger.getById('value-page1-scroll-trigger');
          if (!st) return;
          smoother?.scrollTo(st.end, false);
        });
        setTimeout(() => {
          window.isNavScrolling = false;
        }, 500);
      } else {
        // 其他 正常滚
        window.isNavScrolling = true;
        smoother?.scrollTo(`#${id}`, false);
        setTimeout(() => {
          window.isNavScrolling = false;
        }, 500);
      }

      setCurrentPage(item);
      if (id === NAV_LIST[5].id) {
        setInnerPageIndex(0);
      } else {
        setInnerPageTotal(0);
      }
    },
    [setCurrentPage, setInnerPageIndex, setInnerPageTotal],
  );

  const handleNavClick = useThrottle(handleNavClickImpl, 500);

  useEffect(() => {
    if (navigateTo) {
      handleNavClick(navigateTo);
      setCurrentPage(navigateTo);
      setNavigateTo(null);
    }
  }, [handleNavClick, navigateTo, setCurrentPage, setNavigateTo]);

  return { handleNavClick };
}
