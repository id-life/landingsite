import React from 'react';
import { clsx } from 'clsx';
import Providers from '@/providers/root';
import { Analytics } from '@vercel/analytics/next';
import Background from '@/components/common/Background';
import { WebVitals } from '@/app/_components/web-vitals';
import { SpeedInsights } from '@vercel/speed-insights/next';
import ExperienceRouter from '@/components/common/ExperienceRouter';
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';
import { SessionInvisibilityTracker } from '@/app/_components/session-invisibility-tracker';
import { migrena, oxanium, poppins, sourceHanSansCN, ttLakes, xirod } from '@/styles/fonts';
import type { Metadata, Viewport } from 'next';
import { SITE_URL } from '@/constants/site';
import { ANALYTICS_ENABLED } from '@/constants/env';
import { ORG_DESCRIPTION } from '@/constants/entity';

import '@/styles/globals.css';
// CON-16: validates every content record while the build prerenders (server only; zod never reaches the browser).
import '@/content/validate';
import { SubscribePopupStorageReporter } from './_components/page-storage-reporter';

const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
const gaDebugMode = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_DEBUG_MODE === 'true';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  verification: {
    other: {
      'baidu-site-verification': 'codeva-3t6o5pvEVk',
    },
  },
  // Defaults for pages without their own metadata (error pages). Routes build theirs with src/lib/seo/metadata.ts:
  // one language per title, no keywords (SEO-06).
  title: { default: 'Immortal Dragons', template: '%s | Immortal Dragons' },
  description: ORG_DESCRIPTION.slice(0, ORG_DESCRIPTION.indexOf('.') + 1),
  openGraph: {
    title: 'Immortal Dragons',
    siteName: 'Immortal Dragons',
    description: ORG_DESCRIPTION.slice(0, ORG_DESCRIPTION.indexOf('.') + 1),
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
      {ANALYTICS_ENABLED && <GoogleTagManager gtmId="GTM-NZKZJ38H" />}
      {/* DATA-07: Google signals and ad personalisation off before the tag's own config runs. Google documents that
          this suppresses the join beacons and adds npa=1 to every hit. Production builds only, like the tags. */}
      {ANALYTICS_ENABLED && gaId && (
        <Script id="ga-privacy-defaults" strategy="beforeInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('set','allow_google_signals',false);gtag('set','allow_ad_personalization_signals',false);`}
        </Script>
      )}
      {ANALYTICS_ENABLED && gaId && <GoogleAnalytics gaId={gaId} debugMode={gaDebugMode} />}
      {ANALYTICS_ENABLED && <WebVitals />}
      {ANALYTICS_ENABLED && <SessionInvisibilityTracker />}
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
        {ANALYTICS_ENABLED && <SubscribePopupStorageReporter />}
        <Providers>
          <ExperienceRouter />
          <main id="main-content" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Background />
        </Providers>
        {ANALYTICS_ENABLED && <Analytics />}
        {ANALYTICS_ENABLED && <SpeedInsights />}
      </body>
    </html>
  );
}
