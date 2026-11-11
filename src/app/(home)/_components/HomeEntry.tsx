'use client';

import dynamic from 'next/dynamic';
import { isNull } from 'lodash-es';
import ClientChunkBoundary from '@/components/common/ClientChunkBoundary';
import { useIsMobile } from '@/hooks/useIsMobile';
import { retryImport } from '@/utils/retry-import';

const Home = dynamic(() => retryImport(() => import('./Home')), { ssr: false });
const MobileHome = dynamic(() => retryImport(() => import('./MobileHome')), { ssr: false });

// Shared entry of every route that renders the single-page 3D experience.
export default function HomeEntry() {
  const isMobile = useIsMobile();
  if (isNull(isMobile)) return null;

  return <ClientChunkBoundary>{isMobile ? <MobileHome /> : <Home />}</ClientChunkBoundary>;
}
