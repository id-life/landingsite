import { clsx } from 'clsx';
import Nav from '@/components/nav';
import Providers from '@/providers/root';
import { GoogleTagManager } from '@next/third-parties/google';
import { migrena, poppins, ttLakes, xirod } from '@/styles/fonts';
import type { Metadata } from 'next';

import '../utils/analytics';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'IMMORTAL DRAGONS',
  description: 'Immortal Dragons is a purpose-driven longevity fund dedicated to the unlimited human healthy lifespan.',
  keywords: [
    'Longevity',
    'anti-aging',
    'life extension',
    'investment fund',
    'innovation',
    'biotech',
    'pharmaceutical',
    'healthcare',
    'IMMORTAL DRAGONS',
  ],
  openGraph: {
    title: 'IMMORTAL DRAGONS',
    siteName: 'IMMORTAL DRAGONS',
    description: 'Immortal Dragons is a purpose-driven longevity fund dedicated to the unlimited human healthy lifespan.',
    images: [
      {
        url: 'https://cdn.id.life/id-life-cover.webp',
      },
    ],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  image: 'https://cdn.id.life/id-life-cover.webp',
  url: 'https://www.id.life/',
  logo: 'https://cdn.id.life/id-logo-circle.png',
  name: 'IMMORTAL DRAGONS',
  description: 'Immortal Dragons is a purpose-driven longevity fund dedicated to the unlimited human healthy lifespan.',
  email: 'contact@id.life',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '2 JALAN LOKAM',
    addressLocality: 'SINGAPORE',
    addressRegion: 'SG',
    postalCode: '537846',
    addressCountry: 'SG',
  },
  legalName: 'IMMORTAL DRAGONS PRIVATE LIMITED',
  keywords: [
    'Longevity',
    'anti-aging',
    'life extension',
    'investment fund',
    'innovation',
    'biotech',
    'pharmaceutical',
    'healthcare',
    'IMMORTAL DRAGONS',
  ],
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-NZKZJ38H" />
      <body
        className={clsx(xirod.variable, poppins.variable, migrena.variable, ttLakes.variable, 'antialiased')}
        suppressHydrationWarning
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Providers>
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
