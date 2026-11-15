import React, { ReactNode } from 'react';
import Style from '@/app/(home)/_components/Style';
import ExperienceHeader from '@/components/site/ExperienceHeader';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { pageMeta } from '@/content/pages';
import ConnectSummary from '@/app/connect/_components/ConnectSummary';
import { Graph } from 'schema-dts';
import { Links, MediaLinkType } from '@/constants/links';
import { ORG_EMAIL, ORG_ID, ORG_PRESS, ORGANIZATION, WEBSITE, WEBSITE_ID } from '@/constants/entity';
import JsonLd from '@/components/seo/JsonLd';
import HeroPreloads from '@/components/gl/HeroPreloads';

// Title topic and description from the content layer (src/content/pages.ts), shared with llms.txt.
const PAGE = pageMeta('connect');
const PAGE_TITLE = 'CONNECT 联结';
const PAGE_DESCRIPTION = PAGE.description;

// Title "<topic> | Immortal Dragons" in one language, og:title without the brand, no keywords (SEO-06).
export const metadata: Metadata = buildMetadata(PAGE);

const jsonLd: Graph = {
  '@context': 'https://schema.org',
  '@graph': [
    WEBSITE,
    {
      '@type': 'WebPage',
      '@id': 'https://www.id.life/connect#webpage',
      name: 'Connect',
      url: 'https://www.id.life/connect',
      isPartOf: { '@id': WEBSITE_ID },
      about: { '@id': ORG_ID },
      mainEntity: { '@id': ORG_ID },
      description: 'Contact Immortal Dragons for partnerships, media, and community connections.',
    },
    {
      ...ORGANIZATION,
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'general inquiries',
          email: ORG_EMAIL,
          availableLanguage: ['en', 'zh'],
          url: 'https://www.id.life/connect',
        },
      ],
      subjectOf: [
        ...ORG_PRESS,
        {
          '@type': 'CreativeWork',
          name: 'Immortal Dragons Media Kit',
          url: Links[MediaLinkType.Media],
        },
      ],
    },
  ],
};
export default function ConnectLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <HeroPreloads />
      <JsonLd data={jsonLd} />
      <Style />
      <ExperienceHeader />
      <ConnectSummary title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
      {children}
    </>
  );
}
