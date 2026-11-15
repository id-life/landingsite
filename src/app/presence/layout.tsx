import React, { ReactNode } from 'react';
import Style from '@/app/(home)/_components/Style';
import ExperienceHeader from '@/components/site/ExperienceHeader';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { pageMeta } from '@/content/pages';
import PresenceSummary from '@/app/presence/_components/PresenceSummary';
import { WEBSITE_ID } from '@/constants/entity';
import { WebPage, WithContext } from 'schema-dts';
import JsonLd from '@/components/seo/JsonLd';
import HeroPreloads from '@/components/gl/HeroPreloads';

// Title topic and description from the content layer (src/content/pages.ts), shared with llms.txt.
const PAGE = pageMeta('presence');
const PAGE_TITLE = 'Presence 印记';
const PAGE_DESCRIPTION = PAGE.description;

// Title "<topic> | Immortal Dragons" in one language, og:title without the brand, no keywords (SEO-06).
export const metadata: Metadata = buildMetadata(PAGE);

const jsonLd: WithContext<WebPage> = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Presence 印记',
  url: 'https://www.id.life/presence',
  description: PAGE_DESCRIPTION,
  isPartOf: { '@id': WEBSITE_ID },
};

export default function PresenceLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <HeroPreloads />
      <JsonLd data={jsonLd} />
      <Style />
      <ExperienceHeader />
      <PresenceSummary title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
      {children}
    </>
  );
}
