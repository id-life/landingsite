'use client';

import { atom, useAtomValue } from 'jotai';
import { probeWebGL } from '@/lib/analytics/experience';
import { jotaiStore } from '@/atoms/store';

/**
 * How the 3D experience renders (ENG-02), one value the whole experience reads:
 * - 'full': WebGL works; the canvases render as they always did;
 * - 'static': this browser cannot create a WebGL context (probed once, before any canvas mounts). No canvas, loader
 *   or model is ever mounted or downloaded; the hero poster (HeroPoster), the server-rendered copy and the
 *   navigation are the first screen;
 * - 'poster': WebGL works but the hero cannot show right now: its context is lost (until restored) or its scene
 *   failed (a boundary caught an error). The canvas stays mounted and the poster covers it.
 *
 * Reduced motion and software rendering do not select 'static': that would remove the 3D from devices that run it
 * today (plan ruling: the static tier is for no WebGL, Save-Data and slow connections; reduced motion gets a still
 * scene, MOT-02). failIfMajorPerformanceCaveat is recorded as a tag only (see gpuTier.ts).
 */
export type ExperienceMode = 'full' | 'static' | 'poster';

/** Canvases whose WebGL context is lost right now (by canvas name). */
const lostContextsAtom = atom<readonly string[]>([]);
/** The hero scene failed for good (its boundary caught an error, or a hero asset failed to load). */
export const heroSceneFailedAtom = atom<boolean>(false);
/** Whether this browser can create a WebGL context: probed once on first read (client only). */
const webglAvailableAtom = atom(() => (typeof document === 'undefined' ? true : probeWebGL()));

export const experienceModeAtom = atom<ExperienceMode>((get) => {
  if (!get(webglAvailableAtom)) return 'static';
  // Only the hero canvas decides the poster: the Digital Twin canvas sits behind its own section UI.
  if (get(heroSceneFailedAtom) || get(lostContextsAtom).includes('vision')) return 'poster';
  return 'full';
});

export function useExperienceMode() {
  return useAtomValue(experienceModeAtom);
}

/** Context loss and restore of one canvas, from its webglcontextlost / webglcontextrestored listeners. */
export function setContextLost(canvas: string, lost: boolean) {
  jotaiStore.set(lostContextsAtom, (list) => {
    const without = list.filter((name) => name !== canvas);
    return lost ? [...without, canvas] : without;
  });
}

export function markHeroSceneFailed() {
  jotaiStore.set(heroSceneFailedAtom, true);
}
