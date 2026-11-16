'use client';

import { PerformanceMonitor } from '@react-three/drei';
import { useCallback, useEffect, useState } from 'react';
import type { TierBudget } from '@/motion/gpuTier';

const STEP = 0.25;
/** Seconds after the canvas mounts before frame rate is judged: loading, shader compilation and the intro run here. */
const GRACE_S = 10;
/** Frame-rate samples per verdict: 20 x 250 ms, so a step needs 5 s of mostly slow frames, never a short hitch. */
const ITERATIONS = 20;

/**
 * Device pixel ratio of a 3D canvas: it starts at the original's (the device's own, up to 2) on every device, and is
 * stepped down by 0.25 (never below 1) only after the canvas has failed to hold its frame rate for a sustained
 * period, and back up when it recovers. Pass `dpr` to <Canvas dpr> and data-dpr, and render <AdaptiveDprMonitor>
 * inside the canvas.
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
 * drei's PerformanceMonitor, mounted only after GRACE_S, judging 5 s windows: a step down needs 75 % of a window's
 * samples below the frame-rate floor. After three direction changes it stops adjusting (no oscillation).
 */
export function AdaptiveDprMonitor({ decline, incline }: { decline: () => void; incline: () => void }) {
  const [judging, setJudging] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setJudging(true), GRACE_S * 1000);
    return () => window.clearTimeout(timer);
  }, []);
  if (!judging) return null;
  return <PerformanceMonitor iterations={ITERATIONS} flipflops={3} onDecline={decline} onIncline={incline} />;
}
