'use client';

import dynamic from 'next/dynamic';
import ClientChunkBoundary from '@/components/common/ClientChunkBoundary';
import { retryImport } from '@/utils/retry-import';

const CharacterRelation = dynamic(() => retryImport(() => import('@/components/character-relation/CharacterRelation')), {
  ssr: false,
});

export default function InfluenceNetworkPage() {
  return (
    <ClientChunkBoundary>
      <CharacterRelation />
    </ClientChunkBoundary>
  );
}
