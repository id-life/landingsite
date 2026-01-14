import React, { ReactNode } from 'react';
import Style from '@/app/(home)/_components/Style';
import ClientNav from '@/components/nav/CilentNav';
import type { Metadata } from 'next';
import { getSpectrumJsonLd } from './_components/spectrumData';
import SpectrumSEO from './_components/SpectrumSEO';

export const metadata: Metadata = {
  title: 'Spectrum 谱系',
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
        url: 'https://cdn.id.life/id-life-cover-2.webp',
      },
    ],
  },
};

export default function SpectrumLayout({ children }: { children: ReactNode }) {
  const jsonLd = getSpectrumJsonLd();

  return (
    <>
      <link rel="prefetch" crossOrigin="anonymous" href="/assets/draco/draco_decoder.wasm" />
      <link rel="prefetch" crossOrigin="anonymous" href="/assets/draco/draco_wasm_wrapper.js" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SpectrumSEO />
      <Style />
      <ClientNav />
      {children}
    </>
  );
}
