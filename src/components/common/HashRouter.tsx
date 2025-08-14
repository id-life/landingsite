'use client';

import { useCallback, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { globalLoadedAtom } from '@/atoms/geo';

export default function HashRouter() {
  const globalLoaded = useAtomValue(globalLoadedAtom);

  const handleHashNavigation = useCallback(() => {
    if (!globalLoaded) return;
    const hash = window.location.hash;
    if (hash.startsWith('#spectrum-')) {
      // Trigger a custom event that the spectrum router can listen to
      window.dispatchEvent(new CustomEvent('spectrumHashNavigation', { detail: hash }));
    }
  }, [globalLoaded]);

  useEffect(() => {
    if (!globalLoaded) return;
    // Handle initial page load
    handleHashNavigation();

    window.addEventListener('hashchange', handleHashNavigation);

    return () => {
      window.removeEventListener('hashchange', handleHashNavigation);
    };
  }, [globalLoaded, handleHashNavigation]);

  return null;
}
