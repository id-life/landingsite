'use client';

import { glLoadedAtom } from '@/atoms/geo';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useAtomValue } from 'jotai';
import MobileFixedUI from './MobileFixedUI';
import PCFixedUI from './PCFixedUI';

export default function FixedUI() {
  const isMobile = useIsMobile();
  const glLoaded = useAtomValue(glLoadedAtom); // 重要
  if (!glLoaded) return null;
  return isMobile ? <MobileFixedUI /> : <PCFixedUI />;
}
