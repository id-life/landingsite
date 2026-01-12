'use client';

import { fadeInAnimCompletedAtom, globalLoadedAtom } from '@/atoms/geo';
import { eventBus } from '@/components/event-bus/eventBus';
import { MessageType } from '@/components/event-bus/messageType';
import { NAV_LIST } from '@/components/nav/nav';
import { STORAGE_KEY } from '@/constants/storage';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useMobileNavigation } from '@/hooks/useMobileNavigation';
import { useNavigation } from '@/hooks/useNavigation';
import { ensureMobileUIVisible, ensureDesktopUIVisible, ensureUIVisibleIfHidden } from '@/utils/ui';
import gsap from 'gsap';
import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';

export default function HashRouter() {
  const globalLoaded = useAtomValue(globalLoadedAtom);
  const { handleNavClick } = useNavigation();
  const { mobileNavChange } = useMobileNavigation();
  const isMobile = useIsMobile();
  const hashLoadedRef = useRef(false);
  const setFadeInAnimCompleted = useSetAtom(fadeInAnimCompletedAtom);

  const handlePathnameNavigation = useCallback(() => {
    if (!globalLoaded || isMobile === null) return;
    const { pathname } = window.location;

    // Check if returning from /news or /podcast on mobile
    if (isMobile && pathname === '/') {
      const returnPageId = sessionStorage.getItem(STORAGE_KEY.MOBILE_RETURN_PAGE);
      if (returnPageId) {
        sessionStorage.removeItem(STORAGE_KEY.MOBILE_RETURN_PAGE);
        const returnNavItem = NAV_LIST.find((item) => item.id === returnPageId);
        if (returnNavItem) {
          mobileNavChange(returnNavItem);
          return;
        }
      }
    }

    const matchingNavItem = NAV_LIST.find((item) => item.href === pathname);
    if (matchingNavItem) {
      isMobile ? mobileNavChange(matchingNavItem) : handleNavClick(matchingNavItem);
    }
  }, [globalLoaded, handleNavClick, isMobile, mobileNavChange]);

  const handleHashNavigation = useCallback(() => {
    if (!globalLoaded) return;
    handlePathnameNavigation();
    const { hash } = window.location;
    // Handle hash navigation for any pathname with hash
    if (hash) {
      const routeKey = hash.replace('#', '');
      eventBus.next({
        type: MessageType.SPECTRUM_HASH_NAVIGATION,
        payload: `#${routeKey}`,
      });
    }
  }, [globalLoaded, handlePathnameNavigation]);

  useEffect(() => {
    if (!globalLoaded || hashLoadedRef.current) return;
    hashLoadedRef.current = true; // 处理初始页面加载
    handleHashNavigation();
    const { pathname } = window.location;
    if (pathname !== '/') {
      // fixed initial ui opacity, see DragonModel triggerFadeInAnimation
      if (isMobile) {
        ensureMobileUIVisible();
      } else {
        ensureDesktopUIVisible();
      }

      setFadeInAnimCompleted(true);
    }
    // 监听 hashchange 事件，处理 hash 导航
    window.addEventListener('hashchange', handleHashNavigation);
    return () => {
      window.removeEventListener('hashchange', handleHashNavigation);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalLoaded, handleHashNavigation, isMobile]);

  // Ensure UI remains visible after browser navigation (e.g., back button)
  useEffect(() => {
    if (!globalLoaded || isMobile === null) return;

    const handlePopState = () => {
      // When navigating back to the main page, ensure UI elements are visible
      ensureUIVisibleIfHidden(isMobile);
    };

    // Listen to popstate (browser back/forward button)
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [globalLoaded, isMobile]);

  return null;
}
