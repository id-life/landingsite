import React, { ReactNode } from 'react';
import Style from '@/app/(home)/_components/Style';
import ClientNav from '@/components/nav/CilentNav';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import { getPortfolioJsonLd } from './_components/portfolioData';
import PortfolioSEO from './_components/PortfolioSEO';
import JsonLd from '@/components/seo/JsonLd';
import HeroPreloads from '@/components/gl/HeroPreloads';

// Title "<topic> | Immortal Dragons" in one language, og:title without the brand, no keywords (SEO-06).
export const metadata: Metadata = buildMetadata({
  path: '/portfolio',
  title: 'Portfolio',
  description:
    "Immortal Dragons' purpose-driven investment portfolio supporting moonshot and radical life extension technologies. Backing technologies like wholebody replacement, 3D bioprinting, gene therapy, artificial womb technology and more.",
});

export default function PortfolioLayout({ children }: { children: ReactNode }) {
  const jsonLd = getPortfolioJsonLd();

  return (
    <>
      <HeroPreloads />
      <JsonLd data={jsonLd} />
      <PortfolioSEO />
      <Style />
      <ClientNav />
      {children}
    </>
  );
}
