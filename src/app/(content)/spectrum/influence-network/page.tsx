'use client';

import dynamic from 'next/dynamic';
import ClientChunkBoundary from '@/components/common/ClientChunkBoundary';
import { ReactQueryProvider } from '@/providers/react-query-provider';
import { retryImport } from '@/utils/retry-import';
import CharacterRelationControls from '@/components/character-relation/CharacterRelationControls';

const CharacterRelation = dynamic(() => retryImport(() => import('@/components/character-relation/CharacterRelation')), {
  ssr: false,
});

export default function InfluenceNetworkPage() {
  return (
    <ReactQueryProvider>
      {/* Before the boundary, so its Reload overlay is drawn above them if the graph's chunk fails. */}
      <CharacterRelationControls />
      <ClientChunkBoundary>
        <CharacterRelation />
      </ClientChunkBoundary>
    </ReactQueryProvider>
  );
}
