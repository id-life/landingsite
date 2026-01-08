'use client';

import { useEffect, useRef } from 'react';
import { useWindowSize } from './useWindowSize';

/**
 * Hook to monitor window size changes using useSyncExternalStore.
 * Executes callback on initial mount and whenever window is resized.
 *
 * @param callback - Function to call on resize
 * @param immediate - Whether to call callback immediately on mount (default: true)
 */
export function useWindowResize(callback: () => void, immediate = true) {
  const callbackRef = useRef(callback);
  const windowSize = useWindowSize();
  const isFirstRender = useRef(true);

  // Update callback ref on each render to ensure latest callback is used
  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    // Call immediately on mount if requested
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (immediate) {
        callbackRef.current();
      }
      return;
    }

    // Call on subsequent window size changes
    callbackRef.current();
  }, [windowSize, immediate]);
}
