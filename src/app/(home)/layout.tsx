import React, { ReactNode } from 'react';
import Head from 'next/head';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Immortal Dragons',
  description: 'Immortal Dragons is a purpose-driven longevity fund headquartered in Biopolis, Singapore.',
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
    title: 'Immortal Dragons',
    siteName: 'Immortal Dragons',
    description: 'Immortal Dragons is a purpose-driven longevity fund headquartered in Biopolis, Singapore.',
    images: [
      {
        url: 'https://cdn.id.life/id-life-cover-2.webp',
      },
    ],
  },
};

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Immortal Dragons',
    url: 'https://www.id.life',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'IMMORTAL DRAGONS',
    url: 'https://www.id.life',
    logo: 'https://cdn.id.life/logo.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '3 Biopolis Dr, #01-15',
      addressLocality: 'Singapore',
      addressCountry: 'SG',
      postalCode: '537846',
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Jane Doe',
    jobTitle: 'Founder, Investor',
    worksFor: 'IMMORTAL DRAGONS',
    image: 'https://cdn.id.life/images/boyang.jpg',
  },
];

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="prefetch" crossOrigin="anonymous" href="/assets/draco/draco_decoder.wasm" />
      <link rel="prefetch" crossOrigin="anonymous" href="/assets/draco/draco_wasm_wrapper.js" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
