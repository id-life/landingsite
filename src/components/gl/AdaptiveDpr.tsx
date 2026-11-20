'use client';

import { useFrame } from '@react-three/fiber';
import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';
import { globalLoadedAtom } from '@/atoms/geo';
import { INTRO, shouldSkipIntro } from '@/components/gl/model/vision/intro';
import type { TierBudget } from '@/motion/gpuTier';
import { createDprGovernor } from './dprGovernor';

const STEP = 0.25;

/**
 * Device pixel ratio of a 3D canvas: it starts at the original's (the device's own, up to 2) on every device, steps
 * down by 0.25 (never below 1) once the canvas has failed to hold 30 fps for 2 s, and back up when it holds 50 fps
 * again (dprGovernor.ts). Pass `dpr` to <Canvas dpr> and data-dpr, and render <AdaptiveDprMonitor> inside the canvas.
 */
export function useAdaptiveDpr(budget: TierBudget) {
  const [max] = useState(() =>
    Math.max(1, Math.min(typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1, budget.dprCap)),
  );
  const [dpr, setDpr] = useState(max);
  const decline = useCallback(() => setDpr((d) => Math.max(1, d - STEP)), []);
  const incline = useCallback(() => setDpr((d) => Math.min(max, d + STEP)), [max]);
  return { dpr, max, decline, incline };
}

/**
 * Feeds every rendered frame to the governor and applies its verdicts. It judges only once the hero's intro has
 * played (the loader gone, then the fly-in's delay and length from intro.ts), so loading, shader compilation and his
 * intro never change the pixel ratio; before that, and on a device that keeps its frame rate, nothing changes.
 */
export function AdaptiveDprMonitor({
  dpr,
  max,
  decline,
  incline,
}: {
  dpr: number;
  max: number;
  decline: () => void;
  incline: () => void;
}) {
  const loaded = useAtomValue(globalLoadedAtom);
  const [judging, setJudging] = useState(false);
  const governor = useRef(createDprGovernor());
  useEffect(() => {
    if (!loaded) return;
    const introMs = shouldSkipIntro() ? 0 : (INTRO.flyInDelaySeconds + INTRO.flyInSeconds) * 1000;
    const timer = window.setTimeout(() => {
      governor.current.reset();
      setJudging(true);
    }, introMs);
    return () => window.clearTimeout(timer);
  }, [loaded]);
  useFrame(() => {
    if (!judging) return;
    const step = governor.current.frame(performance.now(), dpr > 1, dpr < max);
    if (step === 'down') decline();
    else if (step === 'up') incline();
  });
  return null;
}
