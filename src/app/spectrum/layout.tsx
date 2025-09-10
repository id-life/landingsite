import React, { ReactNode } from 'react';
import Style from '@/app/(home)/_components/Style';
import ClientNav from '@/components/nav/CilentNav';
import type { Metadata } from 'next';

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

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CreativeWorkSeries',
  name: 'Spectrum',
  applicationCategory: 'ProductivityApplication + NewsMedia',
  operatingSystem: 'Web',
  creator: 'IMMORTAL DRAGONS',
};

export default function SpectrumLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="prefetch" crossOrigin="anonymous" href="/assets/draco/draco_decoder.wasm" />
      <link rel="prefetch" crossOrigin="anonymous" href="/assets/draco/draco_wasm_wrapper.js" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Style />
      <ClientNav />
      {children}
    </>
  );
}
