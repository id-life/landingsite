'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { installMotionRuntime, onMotionPause } from '@/motion/runtime';

/** Mounts the experience's idle and hidden-tab pause (MOT-03) for as long as the experience is on screen. */
export default function MotionRuntime() {
  useEffect(() => {
    // The GSAP ticker drives the tweens, the smoother and every canvas (FrameDriver): it sleeps with the experience.
    const offTicker = onMotionPause((paused) => (paused ? gsap.ticker.sleep() : gsap.ticker.wake()));
    const uninstall = installMotionRuntime();
    return () => {
      uninstall();
      offTicker();
    };
  }, []);
  return null;
}
