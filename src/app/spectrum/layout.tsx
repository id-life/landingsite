import React, { ReactNode } from 'react';
import Style from '@/app/(home)/_components/Style';
import ClientNav from '@/components/nav/CilentNav';
import type { Metadata } from 'next';
import PageSEOContent from '@/components/seo/PageSEOContent';
import { getSpectrumJsonLd } from './_components/spectrumData';

const PAGE_TITLE = 'Spectrum 谱系';
const PAGE_DESCRIPTION =
  "Explore Immortal Dragon's variety of longevity initiatives on insight sharing, sponsorships, literature translation and publication, podcast channel, digital twin and clinical intelligence.";

export const metadata: Metadata = {
  alternates: { canonical: '/spectrum' },
  // An object, not a string: a string title here would reset the title template for the nested
  // /spectrum/* pages, which then shipped without the brand.
  title: { default: PAGE_TITLE, template: '%s | Immortal Dragons 不朽真龙' },
  description: PAGE_DESCRIPTION,
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
    title: PAGE_TITLE,
    siteName: 'Immortal Dragons',
    description: PAGE_DESCRIPTION,
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
      <link rel="prefetch" crossOrigin="anonymous" href="/assets/draco/draco_decoder.wasm" />
      <link rel="prefetch" crossOrigin="anonymous" href="/assets/draco/draco_wasm_wrapper.js" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* Same summary as the other section routes: one h1 and the page description, no links. The
          hidden link list that stood here (31 links, 28 of them external) read as hidden link spam. */}
      <PageSEOContent title={PAGE_TITLE} intro={[PAGE_DESCRIPTION]} />
      <Style />
      <ClientNav />
      {children}
    </>
  );
}
