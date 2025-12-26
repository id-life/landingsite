'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { isNull } from 'lodash-es';
import { useIsMobile } from '@/hooks/useIsMobile';

const Home = dynamic(() => import('../(home)/_components/Home'), { ssr: false });
const MobileHome = dynamic(() => import('../(home)/_components/MobileHome'), { ssr: false });

export default function InsightsPage() {
  const isMobile = useIsMobile();
  if (isNull(isMobile)) return null;

  return isMobile ? <MobileHome /> : <Home />;
}
