import React, { ReactNode } from 'react';
import Style from '@/app/(home)/_components/Style';
import ClientNav from '@/components/nav/CilentNav';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Value 信念',
  description:
    "Immortal Dragons' value and commitment to global longevity awareness, east/west longevity access, moonshot ventures and radical life extension.",
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
    description:
      "Immortal Dragons' value and commitment to global longevity awareness, east/west longevity access, moonshot ventures and radical life extension.",
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
    </>
  );
}
