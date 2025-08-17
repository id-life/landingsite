'use client';

import { useCallback, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { globalLoadedAtom } from '@/atoms/geo';
import { eventBus } from '@/components/event-bus/eventBus';
import { MessageType } from '@/components/event-bus/messageType';

export default function HashRouter() {
  const globalLoaded = useAtomValue(globalLoadedAtom);

  const handleHashNavigation = useCallback(() => {
    if (!globalLoaded) return;
    const { hash } = window.location;

    // Handle hash navigation for any pathname with hash
    if (hash) {
      const routeKey = hash.replace('#', '');
      eventBus.next({
        type: MessageType.SPECTRUM_HASH_NAVIGATION,
        payload: `#spectrum-${routeKey}`,
      });
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
