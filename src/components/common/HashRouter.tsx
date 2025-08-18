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

    // Find matching nav item by href
    const matchingNavItem = NAV_LIST.find((item) => item.href === pathname);

    if (matchingNavItem) {
      // Auto-navigate to corresponding section
      if (isMobile) {
        mobileNavChange(matchingNavItem);
      } else {
        handleNavClick(matchingNavItem);
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
