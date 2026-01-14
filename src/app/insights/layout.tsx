import React, { ReactNode } from 'react';
import Style from '@/app/(home)/_components/Style';
import ClientNav from '@/components/nav/CilentNav';
import type { Metadata } from 'next';
import { CollectionPage, WithContext } from 'schema-dts';

export const metadata: Metadata = {
  title: 'Insights 洞见',
  description: 'Immortal Dragons is a purpose-driven longevity fund headquartered in Biopolis, Singapore.',
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
    title: 'Insights 洞见',
    siteName: 'Immortal Dragons',
    description: 'Immortal Dragons is a purpose-driven longevity fund headquartered in Biopolis, Singapore.',
    images: [
      {
        url: 'https://cdn.id.life/id-life-cover-2.webp',
      },
    ],
  },
};

const jsonLd: WithContext<CollectionPage> = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Insights 洞见',
  url: 'https://www.id.life/insights',
  description: 'Immortal Dragons is a purpose-driven longevity fund headquartered in Biopolis, Singapore.',
  isPartOf: {
    '@type': 'WebSite',
    name: 'Immortal Dragons',
    url: 'https://www.id.life',
  },
};

export default function InsightsLayout({ children }: { children: ReactNode }) {
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
