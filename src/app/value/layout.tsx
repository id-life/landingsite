import React, { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Value 信念',
  description: 'Evangelism of Global Longevity Awareness/East & West Access/Moonshot Ventures/Live Longer & Happier',
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
    title: 'Value 信念',
    siteName: 'Immortal Dragons',
    description: 'Evangelism of Global Longevity Awareness/East & West Access/Moonshot Ventures/Live Longer & Happier',
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
    '@type': 'Values',
    name: 'Values',
    url: 'https://www.id.life/value',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Values',
  },
];
export default function ValueLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
