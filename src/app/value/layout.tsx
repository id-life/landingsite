import React, { ReactNode } from 'react';
import NewsArticle1 from '@/app/news/_components/NewsArticle1';
import Style from '@/app/(home)/_components/Style';
import ClientNav from '@/components/nav/CilentNav';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Value 信念',
  description: 'Evangelism of Global Longevity Awareness/East & West Access/Moonshot Ventures/Live Longer & Happier',
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
    title: 'Value 信念',
    siteName: 'Immortal Dragons',
    description: 'Evangelism of Global Longevity Awareness/East & West Access/Moonshot Ventures/Live Longer & Happier',
    images: [
      {
        url: 'https://cdn.id.life/id-life-cover-2.webp',
      },
    ],
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Values',
    name: 'Values',
    url: 'https://www.id.life/value',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Values',
  },
];
export default function ValueLayout({ children }: { children: ReactNode }) {
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
