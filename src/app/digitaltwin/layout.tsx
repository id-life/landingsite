import React, { ReactNode } from 'react';
import Style from '@/app/(home)/_components/Style';
import ClientNav from '@/components/nav/CilentNav';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import DigitalTwinSummary from '@/app/digitaltwin/_components/DigitalTwinSummary';
import { ORG_REF } from '@/constants/entity';
import { SoftwareApplication, WithContext } from 'schema-dts';
import JsonLd from '@/components/seo/JsonLd';
import HeroPreloads from '@/components/gl/HeroPreloads';

const PAGE_TITLE = 'DigitalTwin 孪生';
const PAGE_DESCRIPTION =
  'Medical digital twin and clinical intelligence built for comprehensive biomarker analysis and preliminary diagnostic suggestions.';

// Title "<topic> | Immortal Dragons" in one language, og:title without the brand, no keywords (SEO-06).
export const metadata: Metadata = buildMetadata({
  path: '/digitaltwin',
  title: 'Digital Twin',
  description: PAGE_DESCRIPTION,
});

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
      <HeroPreloads />
      <JsonLd data={jsonLd} />
      <Style />
      <ClientNav />
      <DigitalTwinSummary title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
      {children}
    </>
  );
}
