import React, { ReactNode } from 'react';
import Style from '@/app/(home)/_components/Style';
import ClientNav from '@/components/nav/CilentNav';
import type { Metadata } from 'next';
import DigitalTwinSummary from '@/app/digitaltwin/_components/DigitalTwinSummary';
import { ORG_REF } from '@/constants/entity';
import { SoftwareApplication, WithContext } from 'schema-dts';

const PAGE_TITLE = 'DigitalTwin 孪生';
const PAGE_DESCRIPTION =
  'Medical digital twin and clinical intelligence built for comprehensive biomarker analysis and preliminary diagnostic suggestions.';

export const metadata: Metadata = {
  alternates: { canonical: '/digitaltwin' },
  title: 'DigitalTwin 孪生',
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
    title: 'DigitalTwin 孪生',
    siteName: 'Immortal Dragons',
    description: PAGE_DESCRIPTION,
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
  description: PAGE_DESCRIPTION,
  url: 'https://www.id.life/digitaltwin',
  applicationCategory: 'MedicalApplication',
  operatingSystem: 'Web',
  creator: ORG_REF,
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
      <DigitalTwinSummary title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
      {children}
    </>
  );
}
