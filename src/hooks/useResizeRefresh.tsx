'use client';

import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { debounce } from 'lodash-es';
import { useEffect, useRef } from 'react';
import { currentSection, resnapSection, setLayoutRefreshing } from '@/motion/sectionController';

/**
 * Hook to refresh ScrollTrigger and ScrollSmoother on window resize.
 * This ensures that scroll-based animations and navigation stay in sync
 * after the window dimensions change. `enabled` is false on the other deck's mount of Home (one Home for both decks): the hook then does nothing.
 */
export function useResizeRefresh(enabled = true) {
  const isRefreshingRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    setLayoutRefreshing(false);

    const handleResize = debounce(() => {
      if (isRefreshingRef.current) return;
      isRefreshingRef.current = true;

      // 1. Set resize flag to prevent ScrollTrigger callbacks from executing
      const section = currentSection();
      setLayoutRefreshing(true);

      // 2. Refresh ScrollSmoother
      const smoother = ScrollSmoother.get();
      smoother?.refresh();

      // 3. Refresh all ScrollTriggers
      ScrollTrigger.refresh();

      // 4. Delay reset of resize flag to ensure callbacks have finished
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setLayoutRefreshing(false);
          isRefreshingRef.current = false;
          // The pins changed length: put the view back on the rest pose of the section it was on.
          resnapSection(section);
        });
      });
    }, 200);

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      handleResize.cancel();
    };
  }, [enabled]);
}
