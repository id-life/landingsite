import React, { ReactNode } from 'react';
import Style from '@/app/(home)/_components/Style';
import ClientNav from '@/components/nav/CilentNav';
import type { Metadata } from 'next';
import { WebPage, WithContext } from 'schema-dts';

export const metadata: Metadata = {
  title: 'Presence 印记',
  description:
    "A global map of Immortal Dragons' presence --bridging East and West to advance longevity through events, partnerships, and community.",
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
    title: 'Presence 印记',
    siteName: 'Immortal Dragons',
    description:
      "A global map of Immortal Dragons' presence --bridging East and West to advance longevity through events, partnerships, and community.",
    images: [
      {
        url: 'https://resources.id.life/id-life-cover-2.webp',
      },
    ],
  },
};

const jsonLd: WithContext<WebPage> = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Presence 印记',
  url: 'https://www.id.life/presence',
  description:
    "A global map of Immortal Dragons' presence --bridging East and West to advance longevity through events, partnerships, and community.",
  isPartOf: {
    '@type': 'WebSite',
    name: 'Immortal Dragons',
    url: 'https://www.id.life',
  },
};

export default function PresenceLayout({ children }: { children: ReactNode }) {
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
