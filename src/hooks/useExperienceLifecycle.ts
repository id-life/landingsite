'use client';

import { experienceMountIdAtom, experienceMountedAtom, initialRouteHandledAtom } from '@/atoms';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

/**
 * Called by Home (both decks). The 3D experience can mount several times in one tab (soft navigation
 * to /news or /podcast and Back), while HashRouter lives in the root layout and never unmounts.
 *
 * On every mount: scroll restoration is 'manual' (the experience positions itself from the URL, so the
 * browser must not restore a stale offset) and HashRouter is asked to map the URL to a section again.
 * On unmount: restoration goes back to 'auto' so content pages (Back from an episode to /podcast) get the
 * browser's own restoration, and the URL sync waits for the next mapping instead of writing the default
 * section over the URL the visitor came back to.
 *
 * ScrollTrigger.clearScrollMemory(mode) also records the mode, which ScrollTrigger re-applies after
 * every refresh; setting history.scrollRestoration alone would be overwritten.
 */
export function useExperienceLifecycle() {
  const bumpMountId = useSetAtom(experienceMountIdAtom);
  const setInitialRouteHandled = useSetAtom(initialRouteHandledAtom);
  const setMounted = useSetAtom(experienceMountedAtom);

  useEffect(() => {
    ScrollTrigger.clearScrollMemory('manual');
    setMounted(true);
    bumpMountId((id) => id + 1);
    return () => {
      setMounted(false);
      setInitialRouteHandled(false);
      ScrollTrigger.clearScrollMemory('auto');
    };
  }, [bumpMountId, setInitialRouteHandled, setMounted]);
}
