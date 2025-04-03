import Background from '@/components/common/Background';
import FixedUI from '@/components/common/FixedUI';
import Providers from '@/providers/root';
import { migrena, oxanium, poppins, sourceHanSansCN, ttLakes, xirod } from '@/styles/fonts';
import { GoogleTagManager } from '@next/third-parties/google';
import { clsx } from 'clsx';
import type { Metadata } from 'next';
import ScrollBehavior from '@/components/common/ScrollBehavior';
import ClientNav from '@/components/nav/CilentNav';

import '@/styles/globals.css';
import 'swiper/css';
import '../utils/analytics';

export const metadata: Metadata = {
  title: 'Immortal Dragons',
  description: 'Immortal Dragons is a purpose-driven longevity fund dedicated to unlimited human healthy lifespans.',
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
    description: 'Immortal Dragons is a purpose-driven longevity fund dedicated to unlimited human healthy lifespans.',
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
  name: 'Immortal Dragons',
  description: 'Immortal Dragons is a purpose-driven longevity fund dedicated to unlimited human healthy lifespans.',
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
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-NZKZJ38H" />
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
