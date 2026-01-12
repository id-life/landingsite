'use client';

import { useEffect, useRef, RefObject } from 'react';

/**
 * Hook to monitor a container's size changes using ResizeObserver.
 * Useful for responsive layouts that need to recalculate based on container dimensions.
 *
 * @param containerRef - Ref to the container element to observe
 * @param callback - Function to call when container size changes
 * @param selector - Optional CSS selector to find parent container (using closest())
 * @param dependencies - Optional dependencies array to force re-observation when values change
 */
export function useContainerResize(
  containerRef: RefObject<HTMLElement>,
  callback: (entry: ResizeObserverEntry) => void,
  selector?: string,
  dependencies: unknown[] = [],
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

    // Manually trigger callback with current dimensions after layout
    // This ensures callback fires even if ResizeObserver doesn't (e.g., after display: none -> visible)
    const rafId = requestAnimationFrame(() => {
      if (!targetElement) return;
      const rect = targetElement.getBoundingClientRect();
      if (rect.height > 0 && rect.width > 0) {
        // Create a mock ResizeObserverEntry with current dimensions
        callbackRef.current({
          target: targetElement,
          contentRect: rect,
        } as ResizeObserverEntry);
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, selector, JSON.stringify(dependencies)]);
}
