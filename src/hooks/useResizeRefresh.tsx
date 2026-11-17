'use client';

import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { debounce } from 'lodash-es';
import { useEffect, useRef } from 'react';
import { currentSection, resnapSection, setLayoutRefreshing } from '@/motion/sectionController';

/**
 * Hook to refresh ScrollTrigger and ScrollSmoother on window resize.
 * This ensures that scroll-based animations and navigation stay in sync
 * after the window dimensions change.
 */
export function useResizeRefresh() {
  const isRefreshingRef = useRef(false);

  useEffect(() => {
    setLayoutRefreshing(false);

    // The section the view is on, read at the first resize event of a burst, while the rests still match the
    // scroll. It used to be read when the debounced refresh ran, by which time ScrollTrigger's own resize refresh had
    // moved every rest while the scroll stayed where it was, so the old position could belong to a neighbour
    // (Spectrum went to Presence when a 1440x900 window became 1536x730).
    let section: number | null = null;

    const handleResize = debounce(() => {
      if (isRefreshingRef.current) return;
      isRefreshingRef.current = true;
      const settledOn = section ?? currentSection();
      section = null;

      // 1. Set resize flag to prevent ScrollTrigger callbacks from executing
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
          resnapSection(settledOn);
        });
      });
    }, 200);

    const onResize = () => {
      if (section === null) section = currentSection();
      handleResize();
    };

    // Capture phase, so the section is read before any other resize handler moves anything.
    window.addEventListener('resize', onResize, { capture: true });
    return () => {
      window.removeEventListener('resize', onResize, { capture: true });
      handleResize.cancel();
    };
  }, []);
}
