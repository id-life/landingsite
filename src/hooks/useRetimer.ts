import { useCallback, useEffect, useRef } from 'react';

/**
 * A hook that manages a single timer, automatically clearing the previous one
 * when a new timer is set. Automatically cleans up on unmount.
 *
 * Based on https://github.com/SukkaW/foxact/blob/master/packages/foxact/src/use-retimer/index.ts
 */
export function useRetimer() {
  const timerIdRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerIdRef.current !== undefined) {
        clearTimeout(timerIdRef.current);
      }
    };
  }, []);

  return useCallback((timerId?: ReturnType<typeof setTimeout> | null) => {
    if (timerIdRef.current !== undefined) {
      clearTimeout(timerIdRef.current);
    }
    timerIdRef.current = timerId ?? undefined;
  }, []);
}
