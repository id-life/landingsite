'use client';

import dynamic from 'next/dynamic';
import { useAtomValue } from 'jotai';
import { isLoadingUIAtom } from '@/atoms/geo';
import { useIsMobile } from '@/hooks/useIsMobile';

const PCNav = dynamic(() => import('./PCNav'), { ssr: false });
const MobileNav = dynamic(() => import('./MobileNav'), { ssr: false });

export default function ClientNav() {
  const isMobile = useIsMobile();
  const isLoadingUI = useAtomValue(isLoadingUIAtom);
  if (!isLoadingUI) return null;

  return isMobile ? <MobileNav /> : <PCNav />;
}
