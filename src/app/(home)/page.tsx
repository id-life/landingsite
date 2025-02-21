'use client';

import { useIsMobile } from '@/hooks/useIsMobile';
import Home from './_components/Home';
import MobileHome from './_components/MobileHome';

export default function HomePage() {
  const isMobile = useIsMobile();

  return isMobile ? <MobileHome /> : <Home />;
}
