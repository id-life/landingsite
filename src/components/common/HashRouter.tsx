'use client';

import { fadeInAnimCompletedAtom, globalLoadedAtom } from '@/atoms/geo';
import { eventBus } from '@/components/event-bus/eventBus';
import { MessageType } from '@/components/event-bus/messageType';
import { NAV_LIST } from '@/components/nav/nav';
import { STORAGE_KEY } from '@/constants/storage';
import { useIsMobile } from '@/hooks/useIsMobile';
import { goToSection, type SectionSource } from '@/motion/sectionController';
import { useAtomValue, useSetAtom } from 'jotai';
import { experienceMountIdAtom, experienceMountedAtom, initialRouteHandledAtom } from '@/atoms';
import { useCallback, useEffect, useRef } from 'react';
import '@/utils/gsap-plugins';
import { PHONE_TREE_QUERY } from '@/styles/device-classes';

/**
 * Maps the URL to a section of the experience. Rendered once in the root layout, so it never unmounts;
 * the experience itself can mount several times per tab (soft navigation to /news or /podcast and Back),
 * and each mount bumps experienceMountIdAtom (useExperienceLifecycle). The URL is applied once per mount:
 * before, it was applied once per tab, so a return from a content page showed the default section and
 * the URL sync then rewrote the address to it.
 */
// Which tree HomeEntry has mounted, read when it is needed. HashRouter now loads after the page (ExperienceRouter), so
// its media-query listener can fire after HomeEntry's. The section controller moves whichever tree registered its
// driver, so the URL is always applied to the tree on screen.
const phoneTree = () => window.matchMedia(PHONE_TREE_QUERY).matches;

export default function HashRouter() {
  const globalLoaded = useAtomValue(globalLoadedAtom);
  const mountId = useAtomValue(experienceMountIdAtom);
  const experienceMounted = useAtomValue(experienceMountedAtom);
  const isMobile = useIsMobile();
  const handledMountRef = useRef(0);
  const setFadeInAnimCompleted = useSetAtom(fadeInAnimCompletedAtom);
  const setInitialRouteHandled = useSetAtom(initialRouteHandledAtom);

  // source 'deeplink' when the experience mounts (no transition, no history entry), 'link' for a hash link.
  const handlePathnameNavigation = useCallback(
    (source: SectionSource) => {
      if (!globalLoaded || isMobile === null) return;
      const { pathname } = window.location;

      const mobile = phoneTree();

      // Check if returning from /news or /podcast on mobile
      if (mobile && pathname === '/') {
        const returnPageId = sessionStorage.getItem(STORAGE_KEY.MOBILE_RETURN_PAGE);
        if (returnPageId) {
          sessionStorage.removeItem(STORAGE_KEY.MOBILE_RETURN_PAGE);
          const returnNavItem = NAV_LIST.find((item) => item.id === returnPageId);
          if (returnNavItem) {
            goToSection(returnNavItem.id, 'restore');
            return;
          }
        }
      }

      const matchingNavItem = NAV_LIST.find((item) => item.href === pathname);
      if (matchingNavItem) goToSection(matchingNavItem.id, source);
    },
    [globalLoaded, isMobile],
  );

  const handleHashNavigation = useCallback(
    (source: SectionSource) => {
      if (!globalLoaded) return;
      handlePathnameNavigation(source);
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
    handleHashNavigation('deeplink');
    setInitialRouteHandled(true);
    // The fixed UI is revealed from fadeInAnimCompletedAtom. The intro tween (DragonModel) reveals it on a
    // first visit to /; a deep link or a return to the experience shows it at once.
    if (window.location.pathname !== '/' || mountId > 1) setFadeInAnimCompleted(true);
  }, [globalLoaded, isMobile, mountId, handleHashNavigation, setInitialRouteHandled, setFadeInAnimCompleted]);

  // Hash links inside the experience (Spectrum tools) for the whole session.
  useEffect(() => {
    if (!globalLoaded) return;
    const onHashChange = () => handleHashNavigation('link');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [globalLoaded, handleHashNavigation]);

  // Back / Forward between sections of a mounted experience: move the view to the section in the address.
  useEffect(() => {
    // Only while an experience is mounted: a return from a content page is applied by the mount effect above.
    if (!globalLoaded || isMobile === null || !experienceMounted) return;
    // The controller records the view (DATA-05) and moves without touching the address.
    const handlePopState = () => {
      const item = NAV_LIST.find((navItem) => navItem.href === window.location.pathname);
      if (item) goToSection(item.id, 'history');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [globalLoaded, isMobile, experienceMounted]);

  return null;
}
