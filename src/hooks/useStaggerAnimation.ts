import { useCallback, useEffect, useRef } from 'react';

interface UseStaggerAnimationOptions {
  enabled: boolean;
  interval: number;
  onAnimate: () => void;
}

export function useStaggerAnimation({ enabled, interval, onAnimate }: UseStaggerAnimationOptions) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  const startAnimation = useCallback(() => {
    if (!mountedRef.current || !enabled) return;

    // Run first animation immediately
    onAnimate();

    // Set up interval for subsequent animations
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      if (mountedRef.current && enabled) {
        onAnimate();
      }
    }, interval);
  }, [enabled, interval, onAnimate]);

  const stopAnimation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Start/stop based on enabled state
  useEffect(() => {
    if (enabled) {
      startAnimation();
    } else {
      stopAnimation();
    }

    return stopAnimation;
  }, [enabled, startAnimation, stopAnimation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      stopAnimation();
    };
  }, [stopAnimation]);

  return { startAnimation, stopAnimation };
}
