import React, { ReactNode } from 'react';
import AboutStyle from '@/app/about/_components/AboutStyle';
import type { Metadata } from 'next';
import { Organization, WithContext } from 'schema-dts';

export const metadata: Metadata = {
  title: 'About 关于 | Immortal Dragons',
  description:
    'Immortal Dragons is a purpose-driven longevity fund headquartered in Singapore, supporting radical life extension technologies with focus on impact over financial return.',
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
    title: 'About 关于 | Immortal Dragons',
    siteName: 'Immortal Dragons',
    description:
      'Immortal Dragons is a purpose-driven longevity fund headquartered in Singapore, supporting radical life extension technologies with focus on impact over financial return.',
    images: [
      {
        url: 'https://resources.id.life/id-life-cover-2.webp',
      },
    ],
  },
};

const jsonLd: WithContext<Organization> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  url: 'https://www.id.life',
  logo: 'https://resources.id.life/logo.png',
  name: 'IMMORTAL DRAGONS',
  description: 'Immortal Dragons is a purpose-driven longevity fund headquartered in Biopolis, Singapore.',
  email: 'dragons@id.life',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '3 Biopolis Dr, #01-15',
    addressLocality: 'Singapore',
    addressCountry: 'SG',
    postalCode: '537846',
  },
};

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AboutStyle />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
