'use client';

import { useEffect } from 'react';
import { installMotionRuntime } from '@/motion/runtime';

/** Mounts the experience's idle and hidden-tab pause (MOT-03) for as long as the experience is on screen. */
export default function MotionRuntime() {
  useEffect(() => installMotionRuntime(), []);
  return null;
}
