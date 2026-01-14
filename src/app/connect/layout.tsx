import React, { ReactNode } from 'react';
import Style from '@/app/(home)/_components/Style';
import ClientNav from '@/components/nav/CilentNav';
import type { Metadata } from 'next';
import { Graph } from 'schema-dts';

export const metadata: Metadata = {
  title: 'CONNECT 联结',
  description:
    "Immortal Dragons' connect and commitment to global longevity awareness, east/west longevity access, moonshot ventures and radical life extension.",
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
    description:
      "Immortal Dragons' connect and commitment to global longevity awareness, east/west longevity access, moonshot ventures and radical life extension.",
    images: [
      {
        url: 'https://cdn.id.life/id-life-cover-2.webp',
      },
    ],
  },
};

const jsonLd: Graph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://www.id.life/#website',
      name: 'Immortal Dragons',
      url: 'https://www.id.life/',
    },
    {
      '@type': 'WebPage',
      '@id': 'https://www.id.life/connect#webpage',
      name: 'Connect',
      url: 'https://www.id.life/connect',
      isPartOf: { '@id': 'https://www.id.life/#website' },
      about: { '@id': 'https://www.id.life/#org' },
      mainEntity: { '@id': 'https://www.id.life/#org' },
      description: 'Contact Immortal Dragons for partnerships, media, and community connections.',
    },
    {
      '@type': 'Organization',
      '@id': 'https://www.id.life/#org',
      name: 'Immortal Dragons',
      url: 'https://www.id.life/',
      email: 'contact@id.life',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '3 Biopolis Dr, #01-15',
        addressLocality: 'Singapore',
        postalCode: '138623',
        addressCountry: 'SG',
      },
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'general inquiries',
          email: 'contact@id.life',
          availableLanguage: ['en', 'zh'],
          url: 'https://www.id.life/connect',
        },
      ],
      sameAs: ['https://www.youtube.com/@Immortal-Dragons', 'https://www.linkedin.com/company/immortaldragons/'],
      subjectOf: [
        {
          '@type': 'CreativeWork',
          name: 'Immortal Dragons Media Kit',
          url: 'https://drive.google.com/drive/folders/1vajrjCq-nAX1LVSzJ_fETL2GKI0-ckrG',
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
      {children}
    </>
  );
}
