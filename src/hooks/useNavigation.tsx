import { currentPageAtom, innerPageIndexAtom, innerPageTotalAtom, navigateToAtom } from '@/atoms';
import { NAV_LIST, NavItem } from '@/components/nav/nav';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAtom, useSetAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';

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
        // engagement 页，需要滚动到 0.6 进度
        isNavScrollingRef.current = true;
        smoother?.scrollTo(`#${id}`, true);
        requestAnimationFrame(() => {
          // 滚到 0.6 进度
          const st = ScrollTrigger.getById('engagement-scroll-trigger');
          if (!st) return;
          st.scroll(st.start + (st.end - st.start) * 0.6);
          const animation = st.animation;
          if (!animation) return;
          animation.progress(0.6);
        });
        setTimeout(() => (isNavScrollingRef.current = false), 500);
      } else {
        // 其他 正常滚
        isNavScrollingRef.current = true;
        smoother?.scrollTo(`#${id}`, true);
        setTimeout(() => (isNavScrollingRef.current = false), 500);
      }

      setCurrentPage(item);
      if (id === NAV_LIST[2].id || id === NAV_LIST[4].id) {
        setInnerPageIndex(0);
      } else {
        setInnerPageIndex(-1);
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
