import React, { ReactNode } from 'react';
import Style from '@/app/(home)/_components/Style';
import ClientNav from '@/components/nav/CilentNav';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import PresenceSummary from '@/app/presence/_components/PresenceSummary';
import { WEBSITE_ID } from '@/constants/entity';
import { WebPage, WithContext } from 'schema-dts';
import JsonLd from '@/components/seo/JsonLd';
import HeroPreloads from '@/components/gl/HeroPreloads';

const PAGE_TITLE = 'Presence 印记';
const PAGE_DESCRIPTION =
  "A global map of Immortal Dragons' presence, bridging East and West to advance longevity through events, partnerships, and community.";

// Title "<topic> | Immortal Dragons" in one language, og:title without the brand, no keywords (SEO-06).
export const metadata: Metadata = buildMetadata({
  path: '/presence',
  title: 'Presence',
  description: PAGE_DESCRIPTION,
});

const jsonLd: WithContext<WebPage> = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Presence 印记',
  url: 'https://www.id.life/presence',
  description: PAGE_DESCRIPTION,
  isPartOf: { '@id': WEBSITE_ID },
};

export default function PresenceLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <HeroPreloads />
      <JsonLd data={jsonLd} />
      <Style />
      <ClientNav />
      <PresenceSummary title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
      {children}
    </>
  );
}
