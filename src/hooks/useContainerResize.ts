'use client';

import { useEffect, useRef, RefObject } from 'react';

/**
 * Hook to monitor a container's size changes using ResizeObserver.
 * Useful for responsive layouts that need to recalculate based on container dimensions.
 *
 * @param containerRef - Ref to the container element to observe
 * @param callback - Function to call when container size changes
 * @param selector - Optional CSS selector to find parent container (using closest())
 */
export function useContainerResize(
  containerRef: RefObject<HTMLElement>,
  callback: (entry: ResizeObserverEntry) => void,
  selector?: string,
) {
  const callbackRef = useRef(callback);

  // Update callback ref on each render to ensure latest callback is used
  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    let targetElement: Element | null = null;

    if (selector) {
      targetElement = containerRef.current?.closest(selector) ?? null;
    } else {
      targetElement = containerRef.current;
    }

    if (!targetElement) return;

    const resizeObserver = new ResizeObserver((entries) => {
      // Call callback with the first entry
      if (entries[0]) {
        callbackRef.current(entries[0]);
      }
    });

    resizeObserver.observe(targetElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, [containerRef, selector]);
}
