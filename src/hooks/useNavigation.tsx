import { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAtom, useSetAtom } from 'jotai';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { NAV_LIST, NavItem } from '@/components/nav/nav';
import { navigateToAtom, currentPageAtom } from '@/atoms';

export function useNavigation() {
  const isNavScrollingRef = useRef(false);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const [navigateTo, setNavigateTo] = useAtom(navigateToAtom);

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: `#${NAV_LIST[1].id}`,
      start: 'top bottom',
      endTrigger: `#${NAV_LIST[1].id}`,
      end: 'top top',
      onEnter: () => {
        if (isNavScrollingRef.current) return;
        gsap.to(window, { scrollTo: { y: `#${NAV_LIST[1].id}`, offsetY: -500 } });
      },
    });
  });

  const handleNavClick = useCallback(
    (item: NavItem) => {
      const smoother = ScrollSmoother.get();
      if (!smoother) return;
      if (item.id === NAV_LIST[0].id) {
        isNavScrollingRef.current = true;
        smoother?.scrollTo(`#${item.id}`, true);
        setTimeout(() => (isNavScrollingRef.current = false), 500);
      }
      if (item.id === NAV_LIST[1].id) {
        isNavScrollingRef.current = true;
        smoother?.scrollTo(`#${item.id}`, false, 'top 10px');
        requestAnimationFrame(() => smoother?.scrollTo('.page2-contact', true, `${window.innerHeight}px`));
        setTimeout(() => (isNavScrollingRef.current = false), 500);
      }
      if (item.id === NAV_LIST[2].id) {
        isNavScrollingRef.current = true;
        smoother?.scrollTo(`#${item.id}`, true);
        setTimeout(() => (isNavScrollingRef.current = false), 500);
      }
      setCurrentPage(item);
    },
    [setCurrentPage],
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
