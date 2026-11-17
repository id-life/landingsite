import { ReactNode } from 'react';
import INStyle from '@/app/spectrum/_components/INStyle';
import SiteHeader from '@/components/site/SiteHeader';
import SubscribePopup from '@/components/layout/footer/SubscribePopup';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { pageMeta } from '@/content/pages';
import { breadcrumbJsonLd, WEBSITE_ID } from '@/constants/entity';
import PageSEOContent from '@/components/seo/PageSEOContent';
import { CollectionPage, WithContext } from 'schema-dts';
import JsonLd from '@/components/seo/JsonLd';

// Title topic and description from the content layer (src/content/pages.ts), shared with llms.txt.
const PAGE = pageMeta('influence-network');
const PAGE_TITLE = PAGE.title;
const PAGE_DESCRIPTION = PAGE.description;

// The owner's own tab title (src/content/pages.ts tabTitle), og:title the same, no keywords (SEO-06).
export const metadata: Metadata = buildMetadata(PAGE);

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
        <SiteHeader
          variant="solid"
          currentId="spectrum_page"
          currentKind="true"
          action="exit"
          className="fixed left-0 top-0 z-[100] p-10 mobile:p-5"
        />
        <SubscribePopup />
        {children}
      </div>
    </>
  );
}
