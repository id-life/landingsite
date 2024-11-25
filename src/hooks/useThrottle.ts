import { useCallback, useRef } from 'react';

export function useThrottle<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
  const lastTime = useRef<number>(0);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastTime.current >= delay) {
        fn(...args);
        lastTime.current = now;
      }
    },
    [fn, delay],
  );
}
