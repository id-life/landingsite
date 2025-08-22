import { ReactNode } from 'react';
import INStyle from '../_components/INStyle';
import SpectrumHeader from '@/app/spectrum/_components/SpectrumHeader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Influence Network | Immortal Dragons',
  description: '长寿领域人物影响力与关系图 Longevity influencer network and relationship map',
  keywords: [
    '长寿',
    '长寿影响力',
    '长寿领域领军人物',
    '长寿领域人物关系',
    '长寿领域核心人物',
    'longevity',
    'longevity influencer',
    'longevity mentor',
    'longevity leaders',
    'longevity key opinion leaders',
    'longevity key people',
  ],
  openGraph: {
    title: 'Influence Network | Immortal Dragons',
    siteName: 'Immortal Dragons',
    description: '长寿领域人物影响力与关系图 Longevity influencer network and relationship map',
    images: [
      {
        url: 'https://cdn.id.life/id-life-cover-2.webp',
      },
    ],
  },
};

export default function InfluenceNetworkLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <INStyle />
      <div className="relative h-full w-full">
        <SpectrumHeader className="fixed left-0 top-0 w-full animate-fade-in" />
        {children}
      </div>
    </>
  );
}
