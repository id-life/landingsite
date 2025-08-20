'use client';

import { globalLoadedAtom } from '@/atoms/geo';
import { eventBus } from '@/components/event-bus/eventBus';
import { MessageType } from '@/components/event-bus/messageType';
import { NAV_LIST } from '@/components/nav/nav';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useMobileNavigation } from '@/hooks/useMobileNavigation';
import { useNavigation } from '@/hooks/useNavigation';
import gsap from 'gsap';
import { useAtomValue } from 'jotai';
import { useCallback, useEffect } from 'react';

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
    const { pathname } = window.location;
    if (pathname !== '/') {
      // fixed ui opacity, see DragonModel triggerFadeInAnimation
      if (isMobile) {
        const mobileNav = document.querySelector('#mobile-nav');
        const mobileElement = document.querySelector('#mobile-fixed-ui');
        if (mobileNav) gsap.set(mobileNav, { opacity: 1 });
        if (mobileElement) gsap.set(mobileElement, { opacity: 1 });
      } else {
        const nav = document.querySelector('#nav');
        const element = document.querySelector('#pc-fixed-ui');
        if (nav) gsap.set(nav, { opacity: 1 });
        if (element) gsap.set(element, { opacity: 1 });
      }
    }

    window.addEventListener('hashchange', handleHashNavigation);

    return () => {
      window.removeEventListener('hashchange', handleHashNavigation);
    };
  }, [globalLoaded, handleHashNavigation, handlePathnameNavigation, isMobile]);

  return null;
}
