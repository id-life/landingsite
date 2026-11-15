import React, { ReactNode } from 'react';
import Style from '@/app/(home)/_components/Style';
import ExperienceHeader from '@/components/site/ExperienceHeader';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { pageMeta } from '@/content/pages';
import InsightsSummary from '@/app/insights/_components/InsightsSummary';
import { WEBSITE_ID } from '@/constants/entity';
import { CollectionPage, WithContext } from 'schema-dts';
import JsonLd from '@/components/seo/JsonLd';
import HeroPreloads from '@/components/gl/HeroPreloads';

// Title topic and description from the content layer (src/content/pages.ts), shared with llms.txt.
const PAGE = pageMeta('insights');
const PAGE_TITLE = 'Insights 洞见';
const PAGE_DESCRIPTION = PAGE.description;

export const revalidate = 300; // 5min, same as /news

// Title "<topic> | Immortal Dragons" in one language, og:title without the brand, no keywords (SEO-06).
export const metadata: Metadata = buildMetadata(PAGE);

const jsonLd: WithContext<CollectionPage> = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Insights 洞见',
  url: 'https://www.id.life/insights',
  description: PAGE_DESCRIPTION,
  isPartOf: { '@id': WEBSITE_ID },
};

export default function InsightsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <HeroPreloads />
      <JsonLd data={jsonLd} />
      <Style />
      <ExperienceHeader />
      <InsightsSummary title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
      {children}
    </>
  );
}
