'use client';

import { useCallback, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { globalLoadedAtom } from '@/atoms/geo';
import { eventBus } from '@/components/event-bus/eventBus';
import { MessageType } from '@/components/event-bus/messageType';
import { useNavigation } from '@/hooks/useNavigation';
import { useMobileNavigation } from '@/hooks/useMobileNavigation';
import { useIsMobile } from '@/hooks/useIsMobile';
import { NAV_LIST } from '@/components/nav/nav';

export default function HashRouter() {
  const globalLoaded = useAtomValue(globalLoadedAtom);
  const { handleNavClick } = useNavigation();
  const { mobileNavChange } = useMobileNavigation();
  const isMobile = useIsMobile();

  const handleHashNavigation = useCallback(() => {
    if (!globalLoaded) return;
    const { hash } = window.location;

    // Handle hash navigation for any pathname with hash
    if (hash) {
      const routeKey = hash.replace('#', '');
      eventBus.next({
        type: MessageType.SPECTRUM_HASH_NAVIGATION,
        payload: `#${routeKey}`,
      });
    }
  }, [globalLoaded]);

  const handlePathnameNavigation = useCallback(() => {
    if (!globalLoaded || isMobile === null) return;
    const { pathname } = window.location;

    // Handle special pathname navigation
    if (pathname === '/digitaltwin') {
      // Auto-navigate to twin section
      if (isMobile) {
        mobileNavChange(NAV_LIST[4]);
      } else {
        handleNavClick(NAV_LIST[4]);
      }
    }
  }, [globalLoaded, isMobile, handleNavClick, mobileNavChange]);

  useEffect(() => {
    if (!globalLoaded) return;
    // Handle initial page load
    handleHashNavigation();
    handlePathnameNavigation();

    window.addEventListener('hashchange', handleHashNavigation);

    return () => {
      window.removeEventListener('hashchange', handleHashNavigation);
    };
  }, [globalLoaded, handleHashNavigation, handlePathnameNavigation]);

  return null;
}
