import React, { ReactNode } from 'react';
import ExperienceHeader from '@/components/site/ExperienceHeader';
import Style from '@/app/(home)/_components/Style';
import type { Graph } from 'schema-dts';
import { ORG_DESCRIPTION, ORGANIZATION, WEBSITE } from '@/constants/entity';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { pageMeta } from '@/content/pages';
import PageSEOContent from '@/components/seo/PageSEOContent';
import JsonLd from '@/components/seo/JsonLd';
import HeroPreloads from '@/components/gl/HeroPreloads';

// The home title is the owner's own, "Immortal Dragons 不朽真龙" (question 5i); the description is the fund's one-sentence statement, the first
// sentence of ORG_DESCRIPTION, which stays whole in the page summary and JSON-LD (SEO-06). From the content layer
// (src/content/pages.ts), shared with llms.txt.
export const metadata: Metadata = buildMetadata(pageMeta('home'));

const jsonLd: Graph = {
  '@context': 'https://schema.org',
  '@graph': [ORGANIZATION, WEBSITE],
};

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* The page's h1 is the hero itself (HeroPoster: the wordmark and its tagline as drawn), so the crawler summary
          below starts at h2. The header, then the experience (whose music player is an early Tab stop). */}
      <ExperienceHeader />
      {children}
      <PageSEOContent
        title="Immortal Dragons 不朽真龙"
        titleAs="h2"
        // The Chinese intro of the 不朽真龙介绍 article is no longer repeated here: the home page does not show it (the
        // owner's rule of 2026-11-18). The organisation description stays: it is the focus text (question 12g).
        intro={[{ text: ORG_DESCRIPTION, lang: 'en' }]}
      />
      <HeroPreloads />
      <JsonLd data={jsonLd} />
      <Style />
    </>
  );
}
