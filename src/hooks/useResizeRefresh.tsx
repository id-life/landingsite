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
    // Initialize the resize flag
    window.isResizing = false;

    const handleResize = debounce(() => {
      if (isRefreshingRef.current) return;
      isRefreshingRef.current = true;

      // 1. Set resize flag to prevent ScrollTrigger callbacks from executing
      window.isResizing = true;

      // 2. Refresh ScrollSmoother
      const smoother = ScrollSmoother.get();
      smoother?.refresh();

      // 3. Refresh all ScrollTriggers
      ScrollTrigger.refresh();

      // 4. Delay reset of resize flag to ensure callbacks have finished
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.isResizing = false;
          isRefreshingRef.current = false;
        });
      });
    }, 200);

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      handleResize.cancel();
    };
  }, []);
}
