import React from 'react';
import { clsx } from 'clsx';
import Providers from '@/providers/root';
import Background from '@/components/common/Background';
import HashRouter from '@/components/common/HashRouter';
import { migrena, oxanium, poppins, sourceHanSansCN, ttLakes, xirod } from '@/styles/fonts';
import type { Metadata, Viewport } from 'next';
import { SITE_URL } from '@/constants/site';
import { ANALYTICS_ENABLED } from '@/constants/env';
import HeadScript from '@/lib/analytics/HeadScript';
import AnalyticsBoot from '@/lib/analytics/boot';
import VercelInsights from '@/lib/analytics/VercelInsights';
import { VERCEL_INSIGHTS_ENABLED } from '@/lib/analytics/config';

import '@/styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  verification: {
    other: {
      'baidu-site-verification': 'codeva-3t6o5pvEVk',
    },
  },
  title: { default: 'Immortal Dragons 不朽真龙', template: '%s | Immortal Dragons 不朽真龙' },
  description:
    'Immortal Dragons is a purpose-driven longevity fund headquartered in Singapore. Its investment themes include replacement strategy, 3D bioprinting, gene therapy, artificial womb, longevity special economic zones, and LP positions in other long-bio funds. Beyond conventional capital investment, Immortal Dragons also engages in book translation and publishing, delivers talks and produces podcasts, sponsors events and initiatives, and collaborates on research projects.',
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
    title: 'Immortal Dragons 不朽真龙',
    siteName: 'Immortal Dragons',
    description:
      'Immortal Dragons is a purpose-driven longevity fund headquartered in Singapore. Its investment themes include replacement strategy, 3D bioprinting, gene therapy, artificial womb, longevity special economic zones, and LP positions in other long-bio funds. Beyond conventional capital investment, Immortal Dragons also engages in book translation and publishing, delivers talks and produces podcasts, sponsors events and initiatives, and collaborates on research projects.',
    images: [
      {
        url: 'https://resources.id.life/id-life-cover-2.webp',
      },
    ],
  },
};

// Pinch zoom stays enabled (WCAG 1.4.4); iOS ignores zoom locks anyway, so the lock only hurt Android users.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      {/* DATA-08: one Google tag, owned by src/lib/analytics. The head script sets the Consent Mode defaults, Google
          signals and ad personalisation off (DATA-07) and records the landing URL before anything can call gtag;
          AnalyticsBoot loads gtag/js after consent, once the experience is ready. No GTM container, no preloads. */}
      <head>{ANALYTICS_ENABLED && <HeadScript />}</head>
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
        {/* Client API calls go to id-platform; covers and media come from the CDN hosts. */}
        <link rel="preconnect" href="https://id-platform.id.life" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.id.life" />
        <link rel="dns-prefetch" href="https://resources.id.life" />
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Providers>
          {ANALYTICS_ENABLED && <AnalyticsBoot />}
          <HashRouter />
          <main id="main-content" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Background />
        </Providers>
        {VERCEL_INSIGHTS_ENABLED && <VercelInsights />}
      </body>
    </html>
  );
}
