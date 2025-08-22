'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { isNull } from 'lodash-es';
import { useIsMobile } from '@/hooks/useIsMobile';
import Style from '@/app/(home)/_components/Style';
import ClientNav from '@/components/nav/CilentNav';

const Home = dynamic(() => import('../(home)/_components/Home'), { ssr: false });
const MobileHome = dynamic(() => import('../(home)/_components/MobileHome'), { ssr: false });

export default function SpectrumPage() {
  const isMobile = useIsMobile();
  if (isNull(isMobile)) return null;

  return (
    <>
      <Style />
      <ClientNav />
      {isMobile ? <MobileHome /> : <Home />}
    </>
  );
}
