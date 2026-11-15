'use client';

import dynamic from 'next/dynamic';
import { isNull } from 'lodash-es';
import ClientChunkBoundary from '@/components/common/ClientChunkBoundary';
import { useIsMobile } from '@/hooks/useIsMobile';
import { retryImport } from '@/utils/retry-import';
import HeroPoster from '@/components/gl/HeroPoster';
import '@/utils/gsap-plugins';

const Home = dynamic(() => retryImport(() => import('./Home')), { ssr: false });
const MobileHome = dynamic(() => retryImport(() => import('./MobileHome')), { ssr: false });

// Shared entry of every route that renders the single-page 3D experience.
export default function HomeEntry() {
  const isMobile = useIsMobile();

  return (
    <>
      {/* Server-rendered: the hero's first paint, and the hero itself without WebGL (ENG-02, VIS-03). */}
      <HeroPoster />
      {!isNull(isMobile) && <ClientChunkBoundary>{isMobile ? <MobileHome /> : <Home />}</ClientChunkBoundary>}
    </>
  );
}
