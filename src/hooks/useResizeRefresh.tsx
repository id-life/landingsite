'use client';

import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { debounce } from 'lodash-es';
import { useEffect, useRef } from 'react';

/**
 * Hook to refresh ScrollTrigger and ScrollSmoother on window resize.
 * This ensures that scroll-based animations and navigation stay in sync
 * after the window dimensions change.
 */
export function useResizeRefresh() {
  const isRefreshingRef = useRef(false);

  useEffect(() => {
    const handleResize = debounce(() => {
      if (isRefreshingRef.current) return;
      isRefreshingRef.current = true;

      // 1. Refresh ScrollSmoother
      const smoother = ScrollSmoother.get();
      smoother?.refresh();

      // 2. Refresh all ScrollTriggers
      ScrollTrigger.refresh();

      // 3. Reset global flags to prevent them from getting stuck
      window.isNavScrolling = false;
      window.isSmootherScrolling = false;

      isRefreshingRef.current = false;
    }, 200);

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      handleResize.cancel();
    };
  }, []);
}
