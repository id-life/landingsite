import { useCallback, useEffect, useRef } from 'react';
import { isSafari, isAndroid, isMobile, isTablet, isDesktop } from 'react-device-detect';

// Types for better type safety
interface ViewportManager {
  disable: () => void;
  enable: () => void;
  cleanup: () => void;
}

interface TouchGestureManager {
  setup: () => () => void;
  cleanup: () => void;
}

interface SafariZoomManager {
  setup: () => () => void;
  cleanup: () => void;
}

/**
 * Enhanced device detection using react-device-detect
 * More reliable than simple user agent string checking
 */
const getDeviceInfo = () => ({
  isAndroid,
  isSafari,
  isMobile,
  isTablet,
  isDesktop,
  // Combine mobile and tablet as touch devices
  isTouchDevice: isMobile || isTablet,
});

/**
 * Viewport meta tag manager
 * Handles dynamic viewport content modification for zoom control
 */
const createViewportManager = (): ViewportManager => {
  let originalContent: string | null = null;

  const getViewport = () => document.querySelector('meta[name="viewport"]');

  const disable = () => {
    if (typeof document === 'undefined') return;

    const viewport = getViewport();
    if (!viewport) return;

    // Store original content only once
    if (originalContent === null) {
      originalContent = viewport.getAttribute('content') || '';
    }

    const content = viewport.getAttribute('content') || '';
    if (!content.includes('user-scalable=no')) {
      const newContent = content.includes('user-scalable=')
        ? content.replace(/user-scalable=[^,]*/, 'user-scalable=no')
        : `${content}, user-scalable=no`;
      viewport.setAttribute('content', newContent);
    }
  };

  const enable = () => {
    if (typeof document === 'undefined') return;

    const viewport = getViewport();
    if (!viewport || !originalContent) return;

    viewport.setAttribute('content', originalContent);
  };

  const cleanup = () => {
    enable();
    originalContent = null;
  };

  return { disable, enable, cleanup };
};

/**
 * Touch gesture manager for pinch-to-zoom prevention
 * Handles multi-touch gesture detection and prevention with device-specific optimization
 */
const createTouchGestureManager = (options: {
  includeSafariSpecific?: boolean;
  pinchThreshold?: number;
  doubleTapDelay?: number;
}): TouchGestureManager => {
  let listeners: Array<{ element: Document; event: string; handler: EventListener }> = [];
  const deviceInfo = getDeviceInfo();

  const addListener = (event: string, handler: EventListener, listenerOptions?: AddEventListenerOptions) => {
    document.addEventListener(event, handler, listenerOptions);
    listeners.push({ element: document, event, handler });
  };

  const setup = (): (() => void) => {
    if (typeof document === 'undefined') return () => {};

    let lastTouchDistance = 0;
    let isMultiTouch = false;
    let initialTouchDistance = 0;

    const handleTouchStart = (e: Event) => {
      const touchEvent = e as TouchEvent;
      if (touchEvent.touches.length > 1) {
        isMultiTouch = true;
        const touch1 = touchEvent.touches[0];
        const touch2 = touchEvent.touches[1];
        const distance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
        lastTouchDistance = distance;
        initialTouchDistance = distance;
      } else {
        isMultiTouch = false;
        initialTouchDistance = 0;
      }
    };

    const handleTouchMove = (e: Event) => {
      const touchEvent = e as TouchEvent;
      if (touchEvent.touches.length <= 1 || !isMultiTouch) return;

      const touch1 = touchEvent.touches[0];
      const touch2 = touchEvent.touches[1];
      const currentDistance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);

      // Device-specific optimization: Use different thresholds based on device type
      let threshold = options.pinchThreshold || 10;

      if (deviceInfo.isAndroid) {
        // Android devices typically need higher threshold due to touch sensitivity
        threshold = 15;
      } else if (deviceInfo.isSafari && deviceInfo.isMobile) {
        // Safari mobile needs lower threshold for better responsiveness
        threshold = 8;
      } else if (deviceInfo.isTablet) {
        // Tablets might need different threshold due to larger screen
        threshold = 12;
      }

      const distanceChange = Math.abs(currentDistance - lastTouchDistance);
      const totalDistanceChange = Math.abs(currentDistance - initialTouchDistance);

      // Prevent zoom if distance change is significant or shows pinch pattern
      if (distanceChange > threshold || totalDistanceChange > threshold * 2) {
        e.preventDefault();
        e.stopPropagation();
      }

      lastTouchDistance = currentDistance;
    };

    const handleTouchEnd = (e: Event) => {
      const touchEvent = e as TouchEvent;
      if (touchEvent.touches.length <= 1) {
        isMultiTouch = false;
        lastTouchDistance = 0;
        initialTouchDistance = 0;
      }
    };

    const preventDefault = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Only add touch event listeners for touch devices
    if (deviceInfo.isTouchDevice) {
      addListener('touchstart', handleTouchStart, { passive: false });
      addListener('touchmove', handleTouchMove, { passive: false });
      addListener('touchend', handleTouchEnd, { passive: false });
    }

    // Safari-specific gesture events (only for Safari)
    if (options.includeSafariSpecific && deviceInfo.isSafari) {
      addListener('gesturestart', preventDefault, { passive: false });
      addListener('gesturechange', preventDefault, { passive: false });
      addListener('gestureend', preventDefault, { passive: false });
    }

    // Android-specific: Additional wheel event prevention for some browsers
    if (deviceInfo.isAndroid) {
      const handleWheel = (e: WheelEvent) => {
        if (e.ctrlKey) {
          e.preventDefault();
          e.stopPropagation();
        }
      };
      addListener('wheel', handleWheel as EventListener, { passive: false });
    }

    // Desktop-specific: Prevent Ctrl+Scroll zoom
    if (deviceInfo.isDesktop) {
      const handleWheel = (e: WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          e.stopPropagation();
        }
      };
      addListener('wheel', handleWheel as EventListener, { passive: false });

      // Prevent keyboard shortcuts for zooming
      const handleKeydown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '0')) {
          e.preventDefault();
          e.stopPropagation();
        }
      };
      addListener('keydown', handleKeydown as EventListener, { passive: false });
    }

    // Return cleanup function
    return () => {
      listeners.forEach(({ element, event, handler }) => {
        element.removeEventListener(event, handler);
      });
      listeners = [];
    };
  };

  const cleanup = () => {
    listeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    listeners = [];
  };

  return { setup, cleanup };
};

/**
 * Safari-specific zoom prevention manager
 * Handles Safari's visual viewport changes and double-tap zoom
 */
const createSafariZoomManager = (options: {
  includeSafariSpecific?: boolean;
  pinchThreshold?: number;
  doubleTapDelay?: number;
}): SafariZoomManager => {
  let listeners: Array<{ cleanup: () => void }> = [];
  let lastScale: number = 1;
  let lastTouchEnd: number = 0;
  const deviceInfo = getDeviceInfo();

  const setup = (): (() => void) => {
    if (typeof window === 'undefined' || !deviceInfo.isSafari) return () => {};

    // Initialize scale reference
    lastScale = window.visualViewport?.scale || 1;

    // Visual viewport change handler
    const handleVisualViewportChange = () => {
      const currentScale = window.visualViewport?.scale || 1;

      // Reset scale if it changed significantly
      if (Math.abs(currentScale - lastScale) > 0.1) {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
          const content = viewport.getAttribute('content') || '';
          viewport.setAttribute('content', `${content}, initial-scale=1.0`);
          requestAnimationFrame(() => {
            viewport.setAttribute('content', content);
          });
        }
      }
    };

    // Double-tap zoom prevention
    const handleTouchEnd = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTouchEnd <= (options.doubleTapDelay || 300)) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    // Setup listeners
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleVisualViewportChange);
      listeners.push({
        cleanup: () => window.visualViewport?.removeEventListener('resize', handleVisualViewportChange),
      });
    }

    // Only add touch end listener for mobile Safari
    if (deviceInfo.isMobile) {
      document.addEventListener('touchend', handleTouchEnd, { passive: false });
      listeners.push({
        cleanup: () => document.removeEventListener('touchend', handleTouchEnd),
      });
    }

    return () => {
      listeners.forEach(({ cleanup }) => cleanup());
      listeners = [];
      lastScale = 1;
      lastTouchEnd = 0;
    };
  };

  const cleanup = () => {
    listeners.forEach(({ cleanup }) => cleanup());
    listeners = [];
    lastScale = 1;
    lastTouchEnd = 0;
  };

  return { setup, cleanup };
};

// Configuration options interface
export interface ZoomPreventionOptions {
  includeSafariSpecific?: boolean;
  pinchThreshold?: number;
  doubleTapDelay?: number;
}

// Return interface for better API design
export interface ZoomPreventionControls {
  forceEnable: () => void;
  forceDisable: () => void;
}

/**
 * Enhanced browser zoom prevention hook
 * Consolidates viewport, touch gesture, and Safari-specific zoom prevention
 * Optimized for Android devices with better pinch detection
 *
 * @param disabled - When true, prevents all zoom functionality
 * @param options - Configuration options for customizing behavior
 * @returns Controls object with manual enable/disable functions
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { forceEnable, forceDisable } = useBrowserZoom(true);
 *
 * // Advanced usage with custom options
 * const controls = useBrowserZoom(shouldDisableZoom, {
 *   includeSafariSpecific: true,
 *   pinchThreshold: 15,
 *   doubleTapDelay: 400
 * });
 * ```
 */
export const useBrowserZoom = (disabled: boolean, options: ZoomPreventionOptions = {}): ZoomPreventionControls => {
  const { includeSafariSpecific = true, pinchThreshold = 10, doubleTapDelay = 300 } = options;

  // Create managers using refs to maintain stable references
  const managersRef = useRef<{
    viewport?: ViewportManager;
    touch?: TouchGestureManager;
    safari?: SafariZoomManager;
  }>({});
  const cleanupFunctionsRef = useRef<Array<() => void>>([]);
  const isInitializedRef = useRef(false);

  // Initialize managers once
  if (!isInitializedRef.current) {
    const normalizedOptions = { includeSafariSpecific, pinchThreshold, doubleTapDelay };

    managersRef.current.viewport = createViewportManager();
    managersRef.current.touch = createTouchGestureManager(normalizedOptions);

    if (includeSafariSpecific) {
      managersRef.current.safari = createSafariZoomManager(normalizedOptions);
    }

    isInitializedRef.current = true;
  }

  const setupZoomPrevention = useCallback(() => {
    // Clear any existing cleanup functions
    cleanupFunctionsRef.current.forEach((cleanup) => cleanup());
    cleanupFunctionsRef.current = [];

    if (!disabled) return;

    // Setup viewport prevention
    managersRef.current.viewport?.disable();

    // Setup touch gesture prevention
    const touchCleanup = managersRef.current.touch?.setup();
    if (touchCleanup) {
      cleanupFunctionsRef.current.push(touchCleanup);
    }

    // Setup Safari-specific prevention (only for Safari)
    if (includeSafariSpecific && managersRef.current.safari) {
      const safariCleanup = managersRef.current.safari.setup();
      if (safariCleanup) {
        cleanupFunctionsRef.current.push(safariCleanup);
      }
    }
  }, [disabled, includeSafariSpecific]);

  const cleanup = useCallback(() => {
    // Run all cleanup functions
    cleanupFunctionsRef.current.forEach((fn) => fn());
    cleanupFunctionsRef.current = [];

    // Cleanup managers
    managersRef.current.viewport?.cleanup();
    managersRef.current.touch?.cleanup();
    managersRef.current.safari?.cleanup();
  }, []);

  useEffect(() => {
    setupZoomPrevention();

    return cleanup;
  }, [setupZoomPrevention, cleanup]);

  // Return control functions for advanced usage
  return {
    forceEnable: useCallback(() => {
      managersRef.current.viewport?.enable();
    }, []),
    forceDisable: useCallback(() => {
      managersRef.current.viewport?.disable();
    }, []),
  };
};
