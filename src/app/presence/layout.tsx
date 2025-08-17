import React, { ReactNode } from 'react';
import NewsArticle1 from '@/app/news/_components/NewsArticle1';
import Style from '@/app/(home)/_components/Style';
import ClientNav from '@/components/nav/CilentNav';
import BodyScrollManager from '@/components/common/BodyScrollManager';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Presence 印记',
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
    title: 'Presence 印记',
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
  name: 'Presence',
  applicationCategory: 'ProductivityApplication + NewsMedia',
  operatingSystem: 'Web',
  creator: 'IMMORTAL DRAGONS',
};

export default function PresenceLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="prefetch" crossOrigin="anonymous" href="/assets/draco/draco_decoder.wasm" />
      <link rel="prefetch" crossOrigin="anonymous" href="/assets/draco/draco_wasm_wrapper.js" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Style />
      <ClientNav />
      <BodyScrollManager />
      {children}
      <NewsArticle1 />
    </>
  );
}
