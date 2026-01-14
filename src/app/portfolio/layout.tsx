import React, { ReactNode } from 'react';
import Style from '@/app/(home)/_components/Style';
import ClientNav from '@/components/nav/CilentNav';
import type { Metadata } from 'next';
import { getPortfolioJsonLd } from './_components/portfolioData';
import PortfolioSEO from './_components/PortfolioSEO';

export const metadata: Metadata = {
  title: 'Portfolio 投资',
  description:
    "Immortal Dragons' purpose-driven investment portfolio supporting moonshot and radical life extension technologies. Backing technologies like wholebody replacement, 3D bioprinting, gene therapy, artificial womb technology and more.",
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
    title: 'Portfolio 投资',
    siteName: 'Immortal Dragons',
    description:
      "Immortal Dragons' purpose-driven investment portfolio supporting moonshot and radical life extension technologies. Backing technologies like wholebody replacement, 3D bioprinting, gene therapy, artificial womb technology and more.",
    images: [
      {
        url: 'https://cdn.id.life/id-life-cover-2.webp',
      },
    ],
  },
};

export default function PortfolioLayout({ children }: { children: ReactNode }) {
  const jsonLd = getPortfolioJsonLd();

  return (
    <>
      <link rel="prefetch" crossOrigin="anonymous" href="/assets/draco/draco_decoder.wasm" />
      <link rel="prefetch" crossOrigin="anonymous" href="/assets/draco/draco_wasm_wrapper.js" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PortfolioSEO />
      <Style />
      <ClientNav />
      {children}
    </>
  );
}
