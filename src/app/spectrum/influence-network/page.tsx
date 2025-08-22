'use client';

import dynamic from 'next/dynamic';

const CharacterRelation = dynamic(() => import('@/components/character-relation/CharacterRelation'), { ssr: false });

export default function InfluenceNetworkPage() {
  return <CharacterRelation />;
}
