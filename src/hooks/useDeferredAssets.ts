'use client';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { globalLoadedAtom } from '@/atoms/geo';
import { DeferredGroup, deferredSettledAtom, furthestSectionAtom } from '@/atoms/loading';
import { currentPageIndexAtom, mobileCurrentPageIndexAtom } from '@/atoms/nav';
import { NAV_LIST } from '@/components/nav/nav';

/**
 * Later-section 3D assets (the Digital Twin avatar and HDR of section 6, about 6 MB; the Connect
 * jellyfish of section 7, 2.8 MB) mount when the visitor comes within one section of them, not after
 * every first load:
 * - desktop follows currentPageAtom (set by each section's ScrollTrigger onEnter and by the nav),
 *   phones follow mobileCurrentPageAtom; the furthest section reached is kept, so nothing unmounts
 *   when the visitor goes back;
 * - a deep link counts from its own section: before the reveal only that section's assets load
 *   (they start with the hero), its neighbours after the reveal;
 * - when both groups are wanted, the one nearer the visitor loads first (on /digitaltwin the twin
 *   finishes before the jellyfish starts, at Connect the jellyfish goes first). A group never waits
 *   longer than WAIT_LIMIT_MS, so one stalled file cannot hold the other back for good.
 */
const SECTION: Record<DeferredGroup, number> = {
  twin: NAV_LIST.findIndex((item) => item.id === 'twin_page'),
  jellyfish: NAV_LIST.findIndex((item) => item.id === 'connect_page'),
};
const OTHER: Record<DeferredGroup, DeferredGroup> = { twin: 'jellyfish', jellyfish: 'twin' };
const WAIT_LIMIT_MS = 15000;

// Same breakpoint as HomeEntry (useMediaQuery maxWidth 768): the phone tree has no 3D twin.
const inPhoneTree = () => window.matchMedia('(max-width: 768px)').matches;
const routeSection = () => NAV_LIST.findIndex((item) => item.href === window.location.pathname);
const saveData = () => {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return Boolean(connection?.saveData) || /(^|-)2g$/.test(connection?.effectiveType ?? '');
};

function useFurthestSection() {
  const desktopIndex = useAtomValue(currentPageIndexAtom);
  const mobileIndex = useAtomValue(mobileCurrentPageIndexAtom);
  const [furthest, setFurthest] = useAtom(furthestSectionAtom);
  useEffect(() => {
    const reached = Math.max(desktopIndex, mobileIndex, routeSection());
    setFurthest((previous) => Math.max(previous, reached));
  }, [desktopIndex, mobileIndex, setFurthest]);
  return furthest;
}

/** True once the assets of `group` may mount (and from then on). */
export function useDeferredAssets(group: DeferredGroup) {
  const globalLoaded = useAtomValue(globalLoadedAtom);
  const furthest = useFurthestSection();
  const settled = useAtomValue(deferredSettledAtom);
  const [waitedOut, setWaitedOut] = useState(false);
  const startedRef = useRef(false);

  const near = (g: DeferredGroup) => (globalLoaded ? furthest >= SECTION[g] - 1 : furthest >= SECTION[g]);
  const other = OTHER[group];
  const otherPresent = other !== 'twin' || !inPhoneTree();
  const otherIsNearer = Math.abs(furthest - SECTION[other]) < Math.abs(furthest - SECTION[group]);
  const waiting = near(group) && otherPresent && near(other) && otherIsNearer && !settled[other];

  useEffect(() => {
    if (!waiting || waitedOut) return;
    const timer = setTimeout(() => setWaitedOut(true), WAIT_LIMIT_MS);
    return () => clearTimeout(timer);
  }, [waiting, waitedOut]);

  if (near(group) && (!waiting || waitedOut)) startedRef.current = true;
  return startedRef.current;
}

/**
 * True when the visitor is two sections away from `group` and moving forward, on a connection
 * without Save-Data: time to warm its files into the loader cache before they are mounted.
 */
export function useDeferredWarm(group: DeferredGroup) {
  const globalLoaded = useAtomValue(globalLoadedAtom);
  const furthest = useFurthestSection();
  return globalLoaded && furthest >= SECTION[group] - 2 && !saveData();
}

/** Rendered inside a group's Suspense boundary: marks the group loaded once its content commits. */
export function DeferredSettled({ group }: { group: DeferredGroup }) {
  const setSettled = useSetAtom(deferredSettledAtom);
  useEffect(() => {
    setSettled((state) => (state[group] ? state : { ...state, [group]: true }));
  }, [group, setSettled]);
  return null;
}
