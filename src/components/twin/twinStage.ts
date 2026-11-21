'use client';

import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { currentPageIndexAtom } from '@/atoms/nav';
import { NAV_LIST } from '@/components/nav/nav';
import { sectionStateAtom } from '@/motion/sectionController';

/**
 * MOT-09: the Digital Twin's canvas (#model-canvas, a second WebGL context) exists only while the visitor is at the
 * Twin, next to it, or on the way there, so the laptop version runs one live context everywhere else. The stage's DOM
 * (its wrapper, controls and reports, which the Twin section fades and stacks) stays mounted; only the canvas comes
 * and goes. Leaving the section already puts the demo back to the original avatar and camera, the state a fresh
 * canvas starts in, so a remount shows what the visitor would have seen.
 */
const TWIN = NAV_LIST.findIndex((item) => item.id === 'twin_page');

/** How long the canvas outlives the last reason to keep it, so a quick step back does not remount it. */
export const TWIN_STAGE_RELEASE_MS = 1000;

/** At the Twin or a neighbour, by the section reached or the one being moved to (a far jump counts from its start). */
export function twinStageNear(state: { index: number; target: number }, twin: number = TWIN): boolean {
  return Math.abs(state.index - twin) <= 1 || Math.abs(state.target - twin) <= 1;
}

/** Whether the Twin's canvas should exist now. */
export function useTwinStageWanted(): boolean {
  const { index, target } = useAtomValue(sectionStateAtom);
  // The section a scroll or a section's own trigger reports, which can run ahead of the controller's index.
  const current = useAtomValue(currentPageIndexAtom);
  const wanted = twinStageNear({ index, target }) || twinStageNear({ index: current, target: current });
  // Kept for TWIN_STAGE_RELEASE_MS after the last reason ends; not mounted at all if there never was one.
  const [expired, setExpired] = useState(!wanted);
  if (wanted && expired) setExpired(false);
  useEffect(() => {
    if (wanted) return;
    const timer = setTimeout(() => setExpired(true), TWIN_STAGE_RELEASE_MS);
    return () => clearTimeout(timer);
  }, [wanted]);
  return wanted || !expired;
}
