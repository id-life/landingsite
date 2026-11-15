import React, { ReactNode } from 'react';
import Style from '@/app/(home)/_components/Style';
import ClientNav from '@/components/nav/CilentNav';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import ConnectSummary from '@/app/connect/_components/ConnectSummary';
import { Graph } from 'schema-dts';
import { Links, MediaLinkType } from '@/constants/links';
import { ORG_EMAIL, ORG_ID, ORG_PRESS, ORGANIZATION, WEBSITE, WEBSITE_ID } from '@/constants/entity';
import JsonLd from '@/components/seo/JsonLd';
import HeroPreloads from '@/components/gl/HeroPreloads';

const PAGE_TITLE = 'CONNECT 联结';
const PAGE_DESCRIPTION =
  "Immortal Dragons' connect and commitment to global longevity awareness, east/west longevity access, moonshot ventures and radical life extension.";

// Title "<topic> | Immortal Dragons" in one language, og:title without the brand, no keywords (SEO-06).
export const metadata: Metadata = buildMetadata({
  path: '/connect',
  title: 'Connect',
  description: PAGE_DESCRIPTION,
});

const jsonLd: Graph = {
  '@context': 'https://schema.org',
  '@graph': [
    WEBSITE,
    {
      '@type': 'WebPage',
      '@id': 'https://www.id.life/connect#webpage',
      name: 'Connect',
      url: 'https://www.id.life/connect',
      isPartOf: { '@id': WEBSITE_ID },
      about: { '@id': ORG_ID },
      mainEntity: { '@id': ORG_ID },
      description: 'Contact Immortal Dragons for partnerships, media, and community connections.',
    },
    {
      ...ORGANIZATION,
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'general inquiries',
          email: ORG_EMAIL,
          availableLanguage: ['en', 'zh'],
          url: 'https://www.id.life/connect',
        },
      ],
      subjectOf: [
        ...ORG_PRESS,
        {
          '@type': 'CreativeWork',
          name: 'Immortal Dragons Media Kit',
          url: Links[MediaLinkType.Media],
        },
      ],
    },
  ],
};
export default function ConnectLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <HeroPreloads />
      <JsonLd data={jsonLd} />
      <Style />
      <ClientNav />
      <ConnectSummary title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
      {children}
    </>
  );
}
