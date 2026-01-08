'use client';

import { useSyncExternalStore } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

// Cache the snapshot to avoid returning new object references unnecessarily
let cachedSnapshot: WindowSize | null = null;

function subscribe(callback: () => void) {
  window.addEventListener('resize', callback);
  return () => {
    window.removeEventListener('resize', callback);
  };
}

function getSnapshot(): WindowSize {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // Only return new object if dimensions actually changed
  if (!cachedSnapshot || cachedSnapshot.width !== width || cachedSnapshot.height !== height) {
    cachedSnapshot = { width, height };
  }

  return cachedSnapshot;
}

function getServerSnapshot(): WindowSize {
  return {
    width: 0,
    height: 0,
  };
}

/**
 * Hook to get current window size using useSyncExternalStore.
 * Automatically updates when window is resized.
 * Safe for SSR - returns 0x0 on server.
 *
 * @returns Current window dimensions { width, height }
 */
export function useWindowSize(): WindowSize {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
