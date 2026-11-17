import React, { ReactNode } from 'react';
import Style from '@/app/(home)/_components/Style';
import ExperienceHeader from '@/components/site/ExperienceHeader';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { pageMeta } from '@/content/pages';
import PageSEOContent from '@/components/seo/PageSEOContent';
import { getSpectrumJsonLd, spectrumBaseData } from '@/app/spectrum/_components/spectrumData';
import JsonLd from '@/components/seo/JsonLd';
import HeroPreloads from '@/components/gl/HeroPreloads';

// Title topic and description from the content layer (src/content/pages.ts), shared with llms.txt.
const PAGE = pageMeta('spectrum');
const PAGE_TITLE = 'Spectrum 谱系';
const PAGE_DESCRIPTION = PAGE.description;

// Title "<topic> | Immortal Dragons" in one language, og:title without the brand, no keywords (SEO-06).
export const metadata: Metadata = buildMetadata(PAGE);

export default function SpectrumLayout({ children }: { children: ReactNode }) {
  const jsonLd = getSpectrumJsonLd();

  return (
    <>
      <HeroPreloads />
      <JsonLd data={jsonLd} />
      {/* Same summary as the other section routes: one h1, the page description, the section's five headings
          and the item names it shows, with no links. The hidden link list that stood here (31 links, 28 of
          them external, aria-hidden) read as hidden link spam. The section itself shows each of these items as
          a real link or logo (three papers behind "more"), so the list is kept from screen readers, as the
          original kept its own, or each would be announced twice; the h1 and the description stay announced. */}
      <PageSEOContent
        title={PAGE_TITLE}
        intro={[PAGE_DESCRIPTION]}
        sections={spectrumBaseData.map((item) => ({
          heading: `${item.title} ${item.titleCn}`,
          items: item.links.map((link) => ({ title: link.label })),
          shownOnPage: true,
        }))}
      />
      <Style />
      <ExperienceHeader />
      {children}
    </>
  );
}
