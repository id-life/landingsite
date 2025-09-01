import React, { ReactNode } from 'react';
import ClientNav from '@/components/nav/CilentNav';
import Style from '@/app/(home)/_components/Style';
import { Organization, WithContext } from 'schema-dts';
import NewsArticle1 from '@/app/news/_components/NewsArticle1';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Immortal Dragons 不朽真龙',
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
    title: 'Immortal Dragons 不朽真龙',
    siteName: 'Immortal Dragons',
    description: 'Immortal Dragons is a purpose-driven longevity fund headquartered in Biopolis, Singapore.',
    images: [
      {
        url: 'https://cdn.id.life/id-life-cover-2.webp',
      },
    ],
  },
};

const jsonLd: WithContext<Organization> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  url: 'https://www.id.life',
  logo: 'https://cdn.id.life/logo.png',
  name: 'IMMORTAL DRAGONS',
  description: 'Immortal Dragons is a purpose-driven longevity fund headquartered in Biopolis, Singapore.',
  email: 'dragons@id.life',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '3 Biopolis Dr, #01-15',
    addressLocality: 'Singapore',
    addressCountry: 'SG',
    postalCode: '537846',
  },
};

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="prefetch" crossOrigin="anonymous" href="/assets/draco/draco_decoder.wasm" />
      <link rel="prefetch" crossOrigin="anonymous" href="/assets/draco/draco_wasm_wrapper.js" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Style />
      <ClientNav />
      {children}
      <NewsArticle1 />
    </>
  );
}
