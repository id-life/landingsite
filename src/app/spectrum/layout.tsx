import React, { ReactNode } from 'react';
import NewsArticle1 from '@/app/news/_components/NewsArticle1';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Spectrum 谱系',
  description:
    'Features insights sharing, translation/publishing, software products, and longevity initiatives like sponsorships.',
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
      'Features insights sharing, translation/publishing, software products, and longevity initiatives like sponsorships.',
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
      {children}
      <NewsArticle1 />
    </>
  );
}
