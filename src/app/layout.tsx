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
import { WebClarity } from '@/app/_components/web-clarity';
import { SessionInvisibilityTracker } from '@/app/_components/session-invisibility-tracker';
import { migrena, oxanium, poppins, sourceHanSansCN, ttLakes, xirod } from '@/styles/fonts';
import Image from 'next/image';
import type { Metadata, Viewport } from 'next';
import { SITE_URL } from '@/constants/site';
import { ANALYTICS_ENABLED } from '@/constants/env';

import '@/styles/globals.css';
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
      {ANALYTICS_ENABLED && <GoogleTagManager gtmId="GTM-NZKZJ38H" />}
      {ANALYTICS_ENABLED && gaId && <GoogleAnalytics gaId={gaId} debugMode={gaDebugMode} />}
      {ANALYTICS_ENABLED && <WebVitals />}
      {ANALYTICS_ENABLED && <WebClarity />}
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
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            width: 1,
            height: 1,
            overflow: 'hidden',
            opacity: 0,
            pointerEvents: 'none',
            clipPath: 'inset(50%)',
            whiteSpace: 'nowrap',
          }}
        >
          <Image src="/imgs/id-logo-large.png" alt="" width={216} height={200} priority unoptimized />
          <Image src="/imgs/id-logo-small.png" alt="" width={113} height={105} priority unoptimized />
        </div>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        {ANALYTICS_ENABLED && <SubscribePopupStorageReporter />}
        <Providers>
          <ScrollBehavior />
          <HashRouter />
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
