'use client';

import { PerformanceMonitor } from '@react-three/drei';
import { useCallback, useState } from 'react';
import type { TierBudget } from '@/motion/gpuTier';

const STEP = 0.25;

/**
 * Device pixel ratio of a 3D canvas (MOT-06): the device's own, capped by its tier, stepped down by 0.25 (never below
 * 1) when the canvas cannot hold its frame rate and back up when it recovers. Pass `dpr` to <Canvas dpr> and
 * data-dpr, and render <AdaptiveDprMonitor> inside the canvas.
 */
export function useAdaptiveDpr(budget: TierBudget) {
  const [max] = useState(() =>
    Math.max(1, Math.min(typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1, budget.dprCap)),
  );
  const [dpr, setDpr] = useState(max);
  const decline = useCallback(() => setDpr((d) => Math.max(1, d - STEP)), []);
  const incline = useCallback(() => setDpr((d) => Math.min(max, d + STEP)), [max]);
  return { dpr, decline, incline };
}

/**
 * drei's PerformanceMonitor: about 2.5 s of frame-rate samples decide a decline or an incline; after three
 * direction changes it stops adjusting (no oscillation).
 */
export function AdaptiveDprMonitor({ decline, incline }: { decline: () => void; incline: () => void }) {
  return <PerformanceMonitor flipflops={3} onDecline={decline} onIncline={incline} />;
}
