import React, { ReactNode } from 'react';
import Style from '@/app/(home)/_components/Style';
import ClientNav from '@/components/nav/CilentNav';
import type { Metadata } from 'next';
import ConnectSummary from '@/app/connect/_components/ConnectSummary';
import { Graph } from 'schema-dts';
import { Links, MediaLinkType } from '@/constants/links';
import { ORG_EMAIL, ORG_ID, ORGANIZATION, WEBSITE, WEBSITE_ID } from '@/constants/entity';

const PAGE_TITLE = 'CONNECT 联结';
const PAGE_DESCRIPTION =
  "Immortal Dragons' connect and commitment to global longevity awareness, east/west longevity access, moonshot ventures and radical life extension.";

export const metadata: Metadata = {
  alternates: { canonical: '/connect' },
  title: 'CONNECT 联结',
  description: PAGE_DESCRIPTION,
  keywords: [
    'Longevity',
    'anti-aging',
    'life extension',
    'investment fund',
    'innovation',
    'biotech',
    'pharmaceutical',
    'healthcare',
    'Immortal Dragons',
  ],
  openGraph: {
    title: 'CONNECT 联结',
    siteName: 'Immortal Dragons',
    description: PAGE_DESCRIPTION,
    images: [
      {
        url: 'https://resources.id.life/id-life-cover-2.webp',
      },
    ],
  },
};

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
      <link rel="prefetch" crossOrigin="anonymous" href="/assets/draco/draco_decoder.wasm" />
      <link rel="prefetch" crossOrigin="anonymous" href="/assets/draco/draco_wasm_wrapper.js" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Style />
      <ClientNav />
      <ConnectSummary title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
      {children}
    </>
  );
}
