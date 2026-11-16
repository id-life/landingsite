'use client';

import { MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';
import { useReducedMotionPref } from '@/motion/preference';

/**
 * motion (framer) components follow the site's motion preference (MOT-02). 'always' / 'never' from the preference,
 * not 'user': the site's preference (src/motion/preference.ts) is the one reader of the setting.
 */
export default function MotionPreferenceConfig({ children }: { children: ReactNode }) {
  const reduced = useReducedMotionPref();
  return <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>{children}</MotionConfig>;
}
