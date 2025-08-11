import { globalLoadedAtom } from '@/atoms/geo';
import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export interface SpectrumRouteConfig {
  key: string;
  action: () => void;
}

export const useSpectrumRouter = (routeConfigs: SpectrumRouteConfig[]) => {
  const globalLoaded = useAtomValue(globalLoadedAtom);
  const pendingHashRef = useRef<string | null>(null);
  const consumedKeysRef = useRef<Set<string>>(new Set());

  const generateSpectrumUrl = useCallback((key: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/#spectrum-${key}`;
  }, []);

  const openSpectrumInNewTab = useCallback(
    (key: string) => {
      const url = generateSpectrumUrl(key);
      window.open(url, '_blank');
    },
    [generateSpectrumUrl],
  );

  const navigateByHash = useCallback(
    (hash: string) => {
      if (!hash || !hash.startsWith('#spectrum-')) return;
      // fixed ui opacity
      const element = document.querySelector('#pc-fixed-ui');
      const mobileElement = document.querySelector('#mobile-fixed-ui');
      const nav = document.querySelector('#nav');
      if (nav) gsap.set(nav, { opacity: 1 });
      if (element) gsap.set(element, { opacity: 1 });
      if (mobileElement) gsap.set(mobileElement, { opacity: 1 });

      const key = hash.replace('#spectrum-', '');
      if (consumedKeysRef.current.has(key)) return;
      const config = routeConfigs.find((c) => c.key === key);
      if (config) {
        config.action();
        // mark consumed to prevent re-triggering while keeping hash in URL for sharing
        consumedKeysRef.current.add(key);
      }
    },
    [routeConfigs],
  );

  const handleHashNavigation = useCallback(() => {
    if (typeof window === 'undefined') return;
    navigateByHash(window.location.hash);
  }, [navigateByHash]);

  // Register event listeners; queue actions until globalLoaded becomes true
  useEffect(() => {
    const handleHashChange = () => {
      if (!globalLoaded && typeof window !== 'undefined') {
        pendingHashRef.current = window.location.hash;
        return;
      }
      handleHashNavigation();
    };

    const handleSpectrumHashNavigation = (event: CustomEvent) => {
      const hash = event.detail as string;
      if (!globalLoaded) {
        pendingHashRef.current = hash;
        return;
      }
      navigateByHash(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('spectrumHashNavigation', handleSpectrumHashNavigation as EventListener);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('spectrumHashNavigation', handleSpectrumHashNavigation as EventListener);
    };
  }, [globalLoaded, handleHashNavigation, navigateByHash]);

  // When global is loaded, process pending hash or current URL hash once
  useEffect(() => {
    if (!globalLoaded) return;
    if (pendingHashRef.current) {
      navigateByHash(pendingHashRef.current);
      pendingHashRef.current = null;
    } else {
      handleHashNavigation();
    }
  }, [globalLoaded, handleHashNavigation, navigateByHash]);

  const executeSpectrumRoute = useCallback(
    (key: string) => {
      const config = routeConfigs.find((c) => c.key === key);
      if (config) {
        config.action();
      }
    },
    [routeConfigs],
  );

  return {
    generateSpectrumUrl,
    openSpectrumInNewTab,
    handleHashNavigation,
    executeSpectrumRoute,
  };
};
