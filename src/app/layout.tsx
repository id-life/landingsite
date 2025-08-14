import React from 'react';
import { clsx } from 'clsx';
import Providers from '@/providers/root';
import { Analytics } from '@vercel/analytics/next';
import Background from '@/components/common/Background';
import { WebVitals } from '@/app/_components/web-vitals';
import { SpeedInsights } from '@vercel/speed-insights/next';
import ScrollBehavior from '@/components/common/ScrollBehavior';
import HashRouter from '@/components/common/HashRouter';
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google';
import { migrena, oxanium, poppins, sourceHanSansCN, ttLakes, xirod } from '@/styles/fonts';
import type { Metadata } from 'next';

import '@/styles/globals.css';

const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
const gaDebugMode = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_DEBUG_MODE === 'true';

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-NZKZJ38H" />
      {gaId && <GoogleAnalytics gaId={gaId} debugMode={gaDebugMode} />}
      <WebVitals />
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
        <Providers>
          <ScrollBehavior />
          <HashRouter />
          {children}
          <Background />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
