'use client';

import { useIsMobile } from '@/hooks/useIsMobile';
import MobileFixedUI from './MobileFixedUI';
import PCFixedUI from './PCFixedUI';
import { cn } from '@/utils';
import { useAtomValue } from 'jotai';
import { globalLoadedAtom } from '@/atoms/geo';

export default function FixedUI() {
  const isMobile = useIsMobile();
  const globalLoaded = useAtomValue(globalLoadedAtom);
  return <div className={cn(globalLoaded ? 'opacity-100' : 'opacity-0')}>{isMobile ? <MobileFixedUI /> : <PCFixedUI />}</div>;
}
