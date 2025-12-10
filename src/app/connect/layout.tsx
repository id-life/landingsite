import React, { ReactNode } from 'react';
import Style from '@/app/(home)/_components/Style';
import ClientNav from '@/components/nav/CilentNav';
import type { Metadata } from 'next';

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

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Connects',
    name: 'Connects',
    url: 'https://www.id.life/connect',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Connects',
  },
];
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
