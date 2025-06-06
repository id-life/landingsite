'use client';

import dynamic from 'next/dynamic';
import { isNull } from 'lodash-es';
import { useIsMobile } from '@/hooks/useIsMobile';

const Home = dynamic(() => import('./_components/Home'), { ssr: false });
const MobileHome = dynamic(() => import('./_components/MobileHome'), { ssr: false });

export default function HomePage() {
  const isMobile = useIsMobile();
  if (isNull(isMobile)) return null;

  return isMobile ? <MobileHome /> : <Home />;
}
