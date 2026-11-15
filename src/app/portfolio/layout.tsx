import React, { ReactNode } from 'react';
import Style from '@/app/(home)/_components/Style';
import SiteHeader from '@/components/site/SiteHeader';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { pageMeta } from '@/content/pages';
import { getPortfolioJsonLd } from './_components/portfolioData';
import PortfolioSEO from './_components/PortfolioSEO';
import JsonLd from '@/components/seo/JsonLd';
import HeroPreloads from '@/components/gl/HeroPreloads';

// Title topic and description from the content layer (src/content/pages.ts), shared with llms.txt.
const PAGE = pageMeta('portfolio');

// Title "<topic> | Immortal Dragons" in one language, og:title without the brand, no keywords (SEO-06).
export const metadata: Metadata = buildMetadata(PAGE);

export default function PortfolioLayout({ children }: { children: ReactNode }) {
  const jsonLd = getPortfolioJsonLd();

  return (
    <>
      <HeroPreloads />
      <JsonLd data={jsonLd} />
      <PortfolioSEO />
      <Style />
      <SiteHeader variant="overlay" />
      {children}
    </>
  );
}
