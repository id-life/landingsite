import { currentPageAtom, innerPageIndexAtom, innerPageTotalAtom, navigateToAtom } from '@/atoms';
import { NAV_LIST, NavItem } from '@/components/nav/nav';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAtom, useSetAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';
import { engagementProgressMap } from './engagement/useEngagementJumpTo';

export function useNavigation() {
  const isNavScrollingRef = useRef(false);
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
        if (isNavScrollingRef.current) return;
        const height = window.innerHeight;
        gsap.to(window, { duration: 1.5, scrollTo: { y: `#${NAV_LIST[1].id}`, offsetY: -height * 0.85 } });
      },
    });
  });

  const handleNavClick = useCallback(
    (item: NavItem) => {
      const smoother = ScrollSmoother.get();
      if (!smoother) return;

      const id = item.id;

      if (id === NAV_LIST[0].id) {
        isNavScrollingRef.current = true;
        smoother?.scrollTo(`#${id}`, true);
        setTimeout(() => (isNavScrollingRef.current = false), 500);
      } else if (id === NAV_LIST[1].id) {
        // portfolio 页 偏移 & contact 需要处理
        isNavScrollingRef.current = true;
        smoother?.scrollTo(`#${id}`, false, 'top 10px');
        requestAnimationFrame(() => smoother?.scrollTo('.page2-contact', true, `${window.innerHeight}px`));
        setTimeout(() => (isNavScrollingRef.current = false), 500);
      } else if (id === NAV_LIST[2].id) {
        // engagement 页
        isNavScrollingRef.current = true;
        smoother?.scrollTo(`#${id}`, false);
        requestAnimationFrame(() => {
          const st = ScrollTrigger.getById('engagement-scroll-trigger');
          if (!st) return;
          gsap.set(window, { scrollTo: { y: st.start + (st.end - st.start) * engagementProgressMap[0] } });
          // const animation = st.animation;
          // if (!animation) return;
          // animation.progress(engagementProgressMap[0]);
        });
        setTimeout(() => (isNavScrollingRef.current = false), 500);
      } else if (item.id === NAV_LIST[3].id) {
        isNavScrollingRef.current = true;
        smoother?.scrollTo(`#${item.id}`, false, 'top 10px');
        requestAnimationFrame(() => smoother?.scrollTo('#switch-model', true, `${window.innerHeight}px`));
      } else {
        // 其他 正常滚
        isNavScrollingRef.current = true;
        smoother?.scrollTo(`#${id}`, false);
        setTimeout(() => (isNavScrollingRef.current = false), 500);
      }

      setCurrentPage(item);
      if (id === NAV_LIST[4].id) {
        setInnerPageIndex(0);
      } else {
        setInnerPageTotal(0);
      }
    },
    [setCurrentPage, setInnerPageIndex, setInnerPageTotal],
  );

  useEffect(() => {
    if (navigateTo) {
      handleNavClick(navigateTo);
      setCurrentPage(navigateTo);
      setNavigateTo(null);
    }
  }, [handleNavClick, navigateTo, setCurrentPage, setNavigateTo]);

  return { handleNavClick };
}
