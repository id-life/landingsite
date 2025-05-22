import React from 'react';
import Background from '@/components/common/Background';
import FixedUI from '@/components/common/FixedUI';
import Providers from '@/providers/root';
import { migrena, oxanium, poppins, sourceHanSansCN, ttLakes, xirod } from '@/styles/fonts';
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google';
import { clsx } from 'clsx';
import type { Metadata } from 'next';
import ScrollBehavior from '@/components/common/ScrollBehavior';
import ClientNav from '@/components/nav/CilentNav';

import '@/styles/globals.css';
import 'swiper/css';

export const metadata: Metadata = {
  title: 'Immortal Dragons',
  description: 'Immortal Dragons is a purpose-driven longevity fund.',
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
    description: 'Immortal Dragons is a purpose-driven longevity fund.',
    images: [
      {
        url: 'https://cdn.id.life/id-life-cover-2.webp',
      },
    ],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  image: 'https://cdn.id.life/id-life-cover-2.webp',
  url: 'https://www.id.life/',
  logo: 'https://cdn.id.life/id-logo-circle.png',
  name: 'Immortal Dragons',
  description: 'Immortal Dragons is a purpose-driven longevity fund.',
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
    'Immortal Dragons',
  ],
};

const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
const gaDebugMode = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_DEBUG_MODE === 'true';

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-NZKZJ38H" />
      {gaId && <GoogleAnalytics gaId={gaId} debugMode={gaDebugMode} />}
      <body
        className={clsx(
          xirod.variable,
          poppins.variable,
          migrena.variable,
          ttLakes.variable,
          oxanium.variable,
          sourceHanSansCN.variable,
          'antialiased',
        )}
        suppressHydrationWarning
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Providers>
          <ScrollBehavior />
          <ClientNav />
          {children}
          <FixedUI />
          <Background />
        </Providers>
      </body>
    </html>
  );
}
