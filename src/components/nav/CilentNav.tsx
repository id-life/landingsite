'use client';

import { useIsMobile } from '@/hooks/useIsMobile';
import { isNull } from 'lodash-es';
import MobileNav from './MobileNav';
import PCNav from './PCNav';

export default function ClientNav() {
  const isMobile = useIsMobile();
  if (isNull(isMobile)) return null;

  return isMobile ? <MobileNav /> : <PCNav />;
}
