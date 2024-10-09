import gsap from 'gsap';
import { isMobile } from 'react-device-detect';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { smootherAtom } from '@/atoms/scroll';

const scrollLimit = 100;

export function useSwitchPage() {
  const deltaYRef = useRef<number>(0);
  const touchDeltaYRef = useRef<number>(0);
  const isScrollingRef = useRef<boolean>(false);
  const currentPageIndexRef = useRef<number>(0);
  const wheelTimerRef = useRef<NodeJS.Timeout>();
  const scrollTimerRef = useRef<NodeJS.Timeout>();
  const pagesRef = useRef<HTMLDivElement[]>([]);
  const pagesYRef = useRef<number[]>([]);
  const smoothingRef = useRef<boolean>(false);
  const smoother = useAtomValue(smootherAtom);

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
    if (!content || !smoother) return;

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

    function handleMobileSwitchPage() {
      if (!smoother) return;
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
      smoother.paused(currentPageIndexRef.current !== pagesYRef.current.length - 1);
      isScrollingRef.current = true;
      smoother.scrollTo(pagesRef.current[currentPageIndexRef.current], true, `top ${navHeight}px`);
      isScrollingRef.current = false;
      deltaYRef.current = 0;
    }

    function handleWheelEvent(event: WheelEvent) {
      deltaYRef.current += event.deltaY;
      clearTimeout(wheelTimerRef.current);
      wheelTimerRef.current = setTimeout(() => handleSwitchPage(), 80);
    }

    function handleTouchstartEvent(event: TouchEvent) {
      touchDeltaYRef.current = event.touches[0].clientY;
    }

    function handleTouchEndEvent(event: TouchEvent) {
      touchDeltaYRef.current -= event.changedTouches[0].clientY;
      deltaYRef.current += touchDeltaYRef.current;
      handleMobileSwitchPage();
    }

    function handleScrollEndEvent() {
      if (currentPageIndexRef.current === pagesRef.current.length - 1) {
        const currentHeight = window.scrollY + navHeight;
        const minHeight = pagesYRef.current[currentPageIndexRef.current];
        if (currentHeight < minHeight) {
          smoother?.paused(true);
        } else {
          smoother?.paused(false);
        }
      }
    }

    if (isMobile) {
      smoother?.paused(true);
      content.addEventListener('touchstart', handleTouchstartEvent);
      content.addEventListener('touchend', handleTouchEndEvent);
      window.addEventListener('scroll', handleScrollEndEvent);
    } else {
      content.addEventListener('wheel', handleWheelEvent);
    }
  }, [smoother]);

  return useMemo(() => ({ onChangeCurrentPage }), [onChangeCurrentPage]);
}
