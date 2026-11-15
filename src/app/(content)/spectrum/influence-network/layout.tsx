import { ReactNode } from 'react';
import INStyle from '@/app/spectrum/_components/INStyle';
import SpectrumHeader from '@/app/spectrum/_components/SpectrumHeader';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { breadcrumbJsonLd, WEBSITE_ID } from '@/constants/entity';
import PageSEOContent from '@/components/seo/PageSEOContent';
import { CollectionPage, WithContext } from 'schema-dts';
import JsonLd from '@/components/seo/JsonLd';

const PAGE_TITLE = 'Influence Network';
const PAGE_DESCRIPTION = '长寿领域人物影响力与关系图 Longevity influencer network and relationship map';

// Title "<topic> | Immortal Dragons" in one language, og:title without the brand, no keywords (SEO-06).
export const metadata: Metadata = buildMetadata({
  path: '/spectrum/influence-network',
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
});

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
