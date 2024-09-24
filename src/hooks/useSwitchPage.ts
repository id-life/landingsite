import gsap from 'gsap';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useCallback, useEffect, useMemo, useRef } from 'react';

const scrollLimit = 100;

export function useSwitchPage() {
  const isMobile = useIsMobile();
  const deltaYRef = useRef<number>(0);
  const touchDeltaYRef = useRef<number>(0);
  const isScrollingRef = useRef<boolean>(false);
  const currentPageIndexRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout>();
  const pagesRef = useRef<HTMLDivElement[]>([]);
  const pagesYRef = useRef<number[]>([]);
  const smoothingRef = useRef<boolean>(false);

  const onChangeCurrentPage = useCallback((pageIndex: number) => {
    currentPageIndexRef.current = pageIndex;
  }, []);

  useEffect(() => {
    if (pagesYRef.current.length) return;
    const pages = gsap.utils.toArray<HTMLDivElement>('.page-container');
    pagesRef.current = pages;
    pagesYRef.current = pages.map((page) => page.getBoundingClientRect().y);
  }, []);

  useEffect(() => {
    const content = document.getElementById('content');
    const navHeight = document.getElementById('nav')?.clientHeight ?? 0;
    if (!content) return;

    function handleSwitchPage() {
      if (isScrollingRef.current) return;
      if (!pagesYRef.current.length) return;
      let direction = deltaYRef.current > 0 ? 1 : -1;
      if (direction < 0) smoothingRef.current = true;
      if (Math.abs(deltaYRef.current) < scrollLimit) direction = 0;
      if (
        currentPageIndexRef.current + direction < 0 ||
        currentPageIndexRef.current + direction >= pagesYRef.current.length ||
        window.scrollY - pagesYRef.current[2] > 10
      ) {
        deltaYRef.current = 0;
        return;
      }
      currentPageIndexRef.current += direction;
      isScrollingRef.current = true;

      gsap.to(window, {
        scrollTo: { y: pagesYRef.current[currentPageIndexRef.current] - navHeight, autoKill: false },
        duration: 0.3,
        ease: 'power3.out',
        onComplete: () => {
          isScrollingRef.current = false;
          deltaYRef.current = 0;
        },
      });
    }

    function handleWheelEvent(event: WheelEvent) {
      deltaYRef.current += event.deltaY;
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => handleSwitchPage(), 80);
    }

    function handleTouchstartEvent(event: TouchEvent) {
      touchDeltaYRef.current = event.touches[0].clientY;
    }

    function handleTouchEndEvent(event: TouchEvent) {
      touchDeltaYRef.current -= event.changedTouches[0].clientY;
      deltaYRef.current += touchDeltaYRef.current;
      handleSwitchPage();
    }

    function handleScrollEndEvent() {
      if (smoothingRef.current) {
        smoothingRef.current = false;
        if (currentPageIndexRef.current === 2) {
          const currentEle = pagesRef.current[currentPageIndexRef.current];
          const currentY = currentEle.getBoundingClientRect().y;
          if (currentY > 20) {
            gsap.to(window, {
              scrollTo: { y: pagesYRef.current[currentPageIndexRef.current] - navHeight, autoKill: false },
              duration: 0.3,
              ease: 'power3.out',
              onComplete: () => {
                isScrollingRef.current = false;
                deltaYRef.current = 0;
              },
            });
          }
        }
      }
    }

    if (isMobile) {
      content.addEventListener('touchstart', handleTouchstartEvent);
      content.addEventListener('touchend', handleTouchEndEvent);
      window.addEventListener('scrollend', handleScrollEndEvent);
    } else {
      content.addEventListener('wheel', handleWheelEvent);
    }

    return () => {
      content.removeEventListener('wheel', handleWheelEvent);
      content.removeEventListener('touchstart', handleTouchstartEvent);
      content.removeEventListener('touchend', handleTouchEndEvent);
      window.removeEventListener('scrollend', handleScrollEndEvent);
    };
  }, [isMobile]);

  return useMemo(() => ({ onChangeCurrentPage }), [onChangeCurrentPage]);
}
