import React, { ReactNode } from 'react';
import Style from '@/app/(home)/_components/Style';
import ClientNav from '@/components/nav/CilentNav';
import type { Metadata } from 'next';
import { SoftwareApplication, WithContext } from 'schema-dts';

export const metadata: Metadata = {
  title: 'DigitalTwin 孪生',
  description:
    'Medical digital twin and clinical intelligence built for comprehensive biomarker analysis and preliminary diagnostic suggestions.',
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
    title: 'DigitalTwin 孪生',
    siteName: 'Immortal Dragons',
    description:
      'Medical digital twin and clinical intelligence built for comprehensive biomarker analysis and preliminary diagnostic suggestions.',
    images: [
      {
        url: 'https://resources.id.life/id-life-cover-2.webp',
      },
    ],
  },
};

const jsonLd: WithContext<SoftwareApplication> = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Digital Twin',
  description:
    'Medical digital twin and clinical intelligence built for comprehensive biomarker analysis and preliminary diagnostic suggestions.',
  url: 'https://www.id.life/digitaltwin',
  applicationCategory: 'MedicalApplication',
  operatingSystem: 'Web',
  creator: {
    '@type': 'Organization',
    name: 'IMMORTAL DRAGONS',
    url: 'https://www.id.life',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/OnlineOnly',
  },
};

export default function DigitalTwinLayout({ children }: { children: ReactNode }) {
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
