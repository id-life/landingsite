import { ReactNode } from 'react';
import INStyle from '@/app/spectrum/_components/INStyle';
import SpectrumHeader from '@/app/spectrum/_components/SpectrumHeader';
import type { Metadata } from 'next';
import { breadcrumbJsonLd, WEBSITE_ID } from '@/constants/entity';
import PageSEOContent from '@/components/seo/PageSEOContent';
import { CollectionPage, WithContext } from 'schema-dts';
import JsonLd from '@/components/seo/JsonLd';

const PAGE_TITLE = 'Influence Network';
const PAGE_DESCRIPTION = '长寿领域人物影响力与关系图 Longevity influencer network and relationship map';

export const metadata: Metadata = {
  alternates: { canonical: '/spectrum/influence-network' },
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
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
    description: PAGE_DESCRIPTION,
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
  name: PAGE_TITLE,
  url: 'https://www.id.life/spectrum/influence-network',
  description: PAGE_DESCRIPTION,
  isPartOf: { '@id': WEBSITE_ID },
};

const breadcrumb = breadcrumbJsonLd([
  { name: 'Spectrum', path: '/spectrum' },
  { name: 'Influence Network', path: '/spectrum/influence-network' },
]);

export default function InfluenceNetworkLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <JsonLd data={[jsonLd, breadcrumb]} />
      {/* The page's one h1 (it used to inherit the Spectrum section's), until the visible content layer ships. */}
      <PageSEOContent title={PAGE_TITLE} intro={[PAGE_DESCRIPTION]} />
      <INStyle />
      <div className="relative h-full w-full">
        <SpectrumHeader className="fixed left-0 top-0 w-full" />
        {children}
      </div>
    </>
  );
}
