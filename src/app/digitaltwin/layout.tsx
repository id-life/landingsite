import React, { ReactNode } from 'react';
import Style from '@/app/(home)/_components/Style';
import ExperienceHeader from '@/components/site/ExperienceHeader';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { pageMeta } from '@/content/pages';
import DigitalTwinSummary from '@/app/digitaltwin/_components/DigitalTwinSummary';
import { ORG_REF } from '@/constants/entity';
import { SoftwareApplication, WithContext } from 'schema-dts';
import JsonLd from '@/components/seo/JsonLd';
import HeroPreloads from '@/components/gl/HeroPreloads';

// Title topic and description from the content layer (src/content/pages.ts), shared with llms.txt.
const PAGE = pageMeta('digitaltwin');
const PAGE_TITLE = 'DigitalTwin 孪生';
const PAGE_DESCRIPTION = PAGE.description;

// Title "<topic> | Immortal Dragons" in one language, og:title without the brand, no keywords (SEO-06).
export const metadata: Metadata = buildMetadata(PAGE);

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
      <ExperienceHeader />
      <DigitalTwinSummary title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
      {children}
    </>
  );
}
