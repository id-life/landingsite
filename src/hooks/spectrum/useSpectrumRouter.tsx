import { globalLoadedAtom } from '@/atoms/geo';
import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';
import { useEventBus } from '@/components/event-bus/useEventBus';
import { MessageType } from '@/components/event-bus/messageType';

export interface SpectrumRouteConfig {
  key: string;
  action: () => void;
  pathname?: string; // Custom pathname for the route, defaults to '/presence'
  useHash?: boolean; // Whether to include hash fragment, defaults to true
}

export const generateSpectrumUrl = (key: string, pathname: string = '/presence', useHash: boolean = true) => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  if (useHash) {
    return `${baseUrl}${pathname}#${key}`;
  } else {
    return `${baseUrl}${pathname}`;
  }
};

export const openSpectrumInNewTab = (key: string, pathname: string = '/presence', useHash: boolean = true) => {
  const url = generateSpectrumUrl(key, pathname, useHash);
  window.open(url, '_blank');
};

export const useSpectrumRouter = (routeConfigs: SpectrumRouteConfig[]) => {
  const globalLoaded = useAtomValue(globalLoadedAtom);
  const pendingHashRef = useRef<string | null>(null);
  const consumedKeysRef = useRef<Set<string>>(new Set());

  const navigateByHash = useCallback(
    (hash: string) => {
      if (!hash || !hash.startsWith('#')) return;
      const key = hash.replace('#', '');
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

  // Handle spectrum hash navigation from eventBus
  const handleSpectrumHashNavigation = useCallback(
    (hash: string) => {
      if (!globalLoaded) {
        pendingHashRef.current = hash;
        return;
      }
      navigateByHash(hash);
    },
    [globalLoaded, navigateByHash],
  );

  useEventBus(MessageType.SPECTRUM_HASH_NAVIGATION, handleSpectrumHashNavigation);

  // When global is loaded, process pending hash or current URL hash once
  useEffect(() => {
    if (!globalLoaded) return;
    if (pendingHashRef.current) {
      navigateByHash(pendingHashRef.current);
      pendingHashRef.current = null;
    } else {
      // Process current URL hash on initial load
      handleHashNavigation();
    }
  }, [globalLoaded, handleHashNavigation, navigateByHash]);

  const updateUrlAndExecute = useCallback(
    (key: string) => {
      const config = routeConfigs.find((c) => c.key === key);
      if (!config) return;
      // Update URL without page reload
      if (typeof window !== 'undefined') {
        // Use default values when config properties are undefined
        const pathname = config.pathname ?? '/presence';
        const useHash = config.useHash ?? true;
        const newUrl = generateSpectrumUrl(key, pathname, useHash);
        window.history.pushState(null, '', newUrl);
      }

      config.action();
      // Mark as consumed to prevent re-triggering
      consumedKeysRef.current.add(key);
    },
    [routeConfigs],
  );

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
    updateUrlAndExecute,
  };
};
