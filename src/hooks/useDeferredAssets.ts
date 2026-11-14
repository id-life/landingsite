'use client';

import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { globalLoadedAtom } from '@/atoms/geo';

/**
 * True once the first screen is revealed and the browser is idle. Models for later sections (the
 * Digital Twin avatar and its HDR, the Connect jellyfish: about 8.8 MB) mount behind this, so the
 * loader no longer waits for them before showing the hero.
 */
export function useDeferredAssets() {
  const globalLoaded = useAtomValue(globalLoadedAtom);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!globalLoaded || ready) return;
    let idleId: number | undefined;
    const timer = setTimeout(() => {
      if ('requestIdleCallback' in window) idleId = window.requestIdleCallback(() => setReady(true), { timeout: 2000 });
      else setReady(true);
    }, 600);
    return () => {
      clearTimeout(timer);
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
    };
  }, [globalLoaded, ready]);
  return ready;
}
