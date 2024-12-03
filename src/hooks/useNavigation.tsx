import { currentPageAtom, navigateToAtom } from '@/atoms';
import { NAV_LIST, NavItem } from '@/components/nav/nav';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAtom, useSetAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';
import { useIsMobile } from './useIsMobile';

export function useNavigation() {
  const isNavScrollingRef = useRef(false);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const [navigateTo, setNavigateTo] = useAtom(navigateToAtom);
  const isMobile = useIsMobile();

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
      if (item.id === NAV_LIST[0].id) {
        isNavScrollingRef.current = true;
        if (isMobile) {
          gsap.to(window, {
            duration: 1.5,
            scrollTo: {
              y: `#${NAV_LIST[0].id}`,
              offsetY: 0,
            },
          });
        } else smoother?.scrollTo(`#${item.id}`, true);
        setTimeout(() => (isNavScrollingRef.current = false), 500);
      }
      if (item.id === NAV_LIST[1].id) {
        isNavScrollingRef.current = true;
        if (isMobile) {
          const height = window.innerHeight;
          gsap.to(window, { duration: 1.5, scrollTo: { y: `#${NAV_LIST[1].id}`, offsetY: -height * 0.85 } });
        } else {
          smoother?.scrollTo(`#${item.id}`, false, 'top 10px');
          requestAnimationFrame(() => smoother?.scrollTo('.page2-contact', true, `${window.innerHeight}px`));
        }
        setTimeout(() => (isNavScrollingRef.current = false), 500);
      }
      if (item.id === NAV_LIST[2].id) {
        isNavScrollingRef.current = true;
        if (isMobile) {
          gsap.to(window, {
            duration: 1.5,
            scrollTo: {
              y: `#${NAV_LIST[2].id}`,
              offsetY: 0,
            },
          });
        } else {
          smoother?.scrollTo(`#${item.id}`, true);
        }
        setTimeout(() => (isNavScrollingRef.current = false), 500);
      }
      setCurrentPage(item);
    },
    [isMobile, setCurrentPage],
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
