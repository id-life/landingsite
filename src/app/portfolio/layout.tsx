import React, { ReactNode } from 'react';
import Style from '@/app/(home)/_components/Style';
import ClientNav from '@/components/nav/CilentNav';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio 投资',
  description: 'A showcase of longevity and biotech investments.',
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
    description: 'A showcase of longevity and biotech investments.',
    images: [
      {
        url: 'https://cdn.id.life/id-life-cover-2.webp',
      },
    ],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'IMMORTAL DRAGONS Portfolio',
  url: 'https://id.life/portfolio',
  hasPart: [
    {
      '@type': 'Organization',
      name: 'Healthspan Capital',
      url: 'https://www.healthspancapital.vc',
      description: "Longevity biotech VC focused on early-stage 'LongBio' companies.",
    },
    {
      '@type': 'Organization',
      name: 'Longevity.Technology',
      url: 'https://longevity.technology/',
      description: 'The #1 destination for daily news and insights on the fast-growing longevity market.',
    },
    {
      '@type': 'Organization',
      name: 'Mito Health',
      url: 'https://mitohealth.com',
      description: 'AI powered concierge doctor.',
    },
    {
      '@type': 'Organization',
      name: 'R3 Bio',
      description: 'Stealth mode biotech.',
    },
    {
      '@type': 'Organization',
      name: 'Frontier Bio',
      url: 'https://www.frontierbio.com/',
      description: 'The future of engineered tissue.',
    },
    {
      '@type': 'Organization',
      name: 'Vitalia',
      description: 'Accelerated longevity startups Special economic zone.',
    },
    {
      '@type': 'Organization',
      name: 'Unlimited Bio',
      description: 'Accelerate clinical trials.',
    },
    {
      '@type': 'Organization',
      name: 'ALIS BioSciences',
      description: 'Gold standard longevity services scaled globally.',
    },
    {
      '@type': 'Organization',
      name: 'VIBE SCIENCE',
      description: 'Builds consumer brain wellness technology.',
    },
  ],
};

export default function PortfolioLayout({ children }: { children: ReactNode }) {
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
