import { ReactNode } from 'react';
import INStyle from '../_components/INStyle';
import SpectrumHeader from '@/app/spectrum/_components/SpectrumHeader';
import type { Metadata } from 'next';
import { CollectionPage, WithContext } from 'schema-dts';

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
        url: 'https://resources.id.life/id-life-cover-2.webp',
      },
    ],
  },
};

const jsonLd: WithContext<CollectionPage> = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Influence Network',
  url: 'https://www.id.life/spectrum/influence-network',
  description: '长寿领域人物影响力与关系图 Longevity influencer network and relationship map',
  isPartOf: {
    '@type': 'WebSite',
    name: 'Immortal Dragons',
    url: 'https://www.id.life',
  },
};

export default function InfluenceNetworkLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <INStyle />
      <div className="relative h-full w-full">
        <SpectrumHeader className="fixed left-0 top-0 w-full animate-fade-in" />
        {children}
      </div>
    </>
  );
}
