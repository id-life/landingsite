'use client';

import { globalLoadedAtom } from '@/atoms/geo';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useAtomValue } from 'jotai';
import MobileNav from './MobileNav';
import PCNav from './PCNav';

export default function ClientNav() {
  const isMobile = useIsMobile();
  const globalLoaded = useAtomValue(globalLoadedAtom);
  if (!globalLoaded) return null;
  return isMobile ? <MobileNav /> : <PCNav />;
}
