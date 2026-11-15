import React, { ReactNode } from 'react';
import Style from '@/app/(home)/_components/Style';
import ClientNav from '@/components/nav/CilentNav';
import type { Metadata } from 'next';
import { getSpectrumJsonLd } from './_components/spectrumData';
import SpectrumSEO from './_components/SpectrumSEO';
import HeroPreloads from '@/components/gl/HeroPreloads';

export const metadata: Metadata = {
  alternates: { canonical: '/spectrum' },
  // An object, not a string: a string title here would reset the title template for the nested
  // /spectrum/* pages, which then shipped without the brand.
  title: { default: 'Spectrum 谱系', template: '%s | Immortal Dragons 不朽真龙' },
  description:
    "Explore Immortal Dragon's variety of longevity initiatives on insight sharing, sponsorships, literature translation and publication, podcast channel, digital twin and clinical intelligence.",
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
    title: 'Spectrum 谱系',
    siteName: 'Immortal Dragons',
    description:
      "Explore Immortal Dragon's variety of longevity initiatives on insight sharing, sponsorships, literature translation and publication, podcast channel, digital twin and clinical intelligence.",
    images: [
      {
        url: 'https://resources.id.life/id-life-cover-2.webp',
      },
    ],
  },
};

export default function SpectrumLayout({ children }: { children: ReactNode }) {
  const jsonLd = getSpectrumJsonLd();

  return (
    <>
      <HeroPreloads />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SpectrumSEO />
      <Style />
      <ClientNav />
      {children}
    </>
  );
}
