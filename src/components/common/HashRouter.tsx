'use client';

import { fadeInAnimCompletedAtom, globalLoadedAtom } from '@/atoms/geo';
import { eventBus } from '@/components/event-bus/eventBus';
import { MessageType } from '@/components/event-bus/messageType';
import { NAV_LIST } from '@/components/nav/nav';
import { STORAGE_KEY } from '@/constants/storage';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useMobileNavigation } from '@/hooks/useMobileNavigation';
import { useNavigation } from '@/hooks/useNavigation';
import { useAtomValue, useSetAtom } from 'jotai';
import { experienceMountIdAtom, experienceMountedAtom, initialRouteHandledAtom } from '@/atoms';
import { useCallback, useEffect, useRef } from 'react';

/**
 * Maps the URL to a section of the experience. Rendered once in the root layout, so it never unmounts;
 * the experience itself can mount several times per tab (soft navigation to /news or /podcast and Back),
 * and each mount bumps experienceMountIdAtom (useExperienceLifecycle). The URL is applied once per mount:
 * before, it was applied once per tab, so a return from a content page showed the default section and
 * the URL sync then rewrote the address to it.
 */
export default function HashRouter() {
  const globalLoaded = useAtomValue(globalLoadedAtom);
  const mountId = useAtomValue(experienceMountIdAtom);
  const experienceMounted = useAtomValue(experienceMountedAtom);
  const { handleNavClick, handleNavClickNow } = useNavigation();
  const { mobileNavChange } = useMobileNavigation();
  const isMobile = useIsMobile();
  const handledMountRef = useRef(0);
  const setFadeInAnimCompleted = useSetAtom(fadeInAnimCompletedAtom);
  const setInitialRouteHandled = useSetAtom(initialRouteHandledAtom);

  // `now`: programmatic mapping on mount uses the unthrottled navigation. A popstate fired while no
  // experience was mounted (Back from /news) used to spend the 500 ms throttle on a no-op call, so the
  // mapping on mount a moment later was dropped and the page stayed on the hero.
  const handlePathnameNavigation = useCallback(
    (now = false) => {
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
        if (isMobile) mobileNavChange(matchingNavItem);
        else if (now) handleNavClickNow(matchingNavItem);
        else handleNavClick(matchingNavItem);
      }
    },
    [globalLoaded, handleNavClick, handleNavClickNow, isMobile, mobileNavChange],
  );

  const handleHashNavigation = useCallback(
    (now = false) => {
      if (!globalLoaded) return;
      handlePathnameNavigation(now);
      const { hash } = window.location;
      // Handle hash navigation for any pathname with hash
      if (hash) {
        const routeKey = hash.replace('#', '');
        eventBus.next({
          type: MessageType.SPECTRUM_HASH_NAVIGATION,
          payload: `#${routeKey}`,
        });
      }
    },
    [globalLoaded, handlePathnameNavigation],
  );

  // Apply the URL once per mount of the experience: the first load and every return from a content page.
  useEffect(() => {
    if (!globalLoaded || isMobile === null || mountId === 0 || handledMountRef.current === mountId) return;
    handledMountRef.current = mountId;
    handleHashNavigation(true);
    setInitialRouteHandled(true);
    // The fixed UI is revealed from fadeInAnimCompletedAtom. The intro tween (DragonModel) reveals it on a
    // first visit to /; a deep link or a return to the experience shows it at once.
    if (window.location.pathname !== '/' || mountId > 1) setFadeInAnimCompleted(true);
  }, [globalLoaded, isMobile, mountId, handleHashNavigation, setInitialRouteHandled, setFadeInAnimCompleted]);

  // Hash links inside the experience (Spectrum tools) for the whole session.
  useEffect(() => {
    if (!globalLoaded) return;
    const onHashChange = () => handleHashNavigation();
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [globalLoaded, handleHashNavigation]);

  // Back / Forward between sections of a mounted experience: move the view to the section in the address.
  useEffect(() => {
    // Only while an experience is mounted: a return from a content page is applied by the mount effect above.
    if (!globalLoaded || isMobile === null || !experienceMounted) return;
    const handlePopState = () => {
      const item = NAV_LIST.find((navItem) => navItem.href === window.location.pathname);
      if (!item) return;
      if (isMobile) mobileNavChange(item);
      else handleNavClick(item);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [globalLoaded, isMobile, experienceMounted, handleNavClick, mobileNavChange]);

  return null;
}
