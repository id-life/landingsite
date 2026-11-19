import React from 'react';
import { clsx } from 'clsx';
import Providers from '@/providers/root';
import Background from '@/components/common/Background';
import ExperienceRouter from '@/components/common/ExperienceRouter';
import { migrena, oxanium, poppins, sourceHanSansCN, ttLakes, xirod } from '@/styles/fonts';
import { color } from '@/styles/tokens';
import type { Metadata, Viewport } from 'next';
import { SITE_URL } from '@/constants/site';
import { DEFAULT_OG_IMAGE, SITE_KEYWORDS } from '@/lib/seo/metadata';
import { ANALYTICS_ENABLED } from '@/constants/env';
import HeadScript from '@/lib/analytics/HeadScript';
import { AnalyticsBootLazy, VercelInsightsLazy } from '@/lib/analytics/lazy';
import { VERCEL_INSIGHTS_ENABLED } from '@/lib/analytics/config';
import { ORG_DESCRIPTION } from '@/constants/entity';

// Design tokens first (VIS-02): every colour, font role, type role and grid value, generated from tokens.ts. Imported
// here rather than with @import in globals.css, which made it a separate stylesheet request.
import '@/styles/tokens.css';
import '@/styles/globals.css';
// CON-16: validates every content record while the build prerenders (server only; zod never reaches the browser).
import '@/content/validate';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  verification: {
    other: {
      'baidu-site-verification': 'codeva-3t6o5pvEVk',
    },
  },
  // Defaults for pages without their own metadata (error pages). The description is the one the owner's site serves
  // by default, word for word (question 12g). Routes build theirs with src/lib/seo/metadata.ts:
  // the owner's tab titles, and his keywords (SEO-06).
  title: { default: 'Immortal Dragons 不朽真龙', template: '%s | Immortal Dragons' },
  description: ORG_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  openGraph: {
    title: 'Immortal Dragons 不朽真龙',
    siteName: 'Immortal Dragons',
    description: ORG_DESCRIPTION,
    // The owner's cover as the link-preview image (src/lib/seo/metadata.ts); pages without metadata of their own
    // get it too, as on his site.
    images: [DEFAULT_OG_IMAGE],
  },
};

// Pinch zoom stays enabled (WCAG 1.4.4); iOS ignores zoom locks anyway, so the lock only hurt Android users.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // The phone browser bar in the site's own colour (question 9): tone-100 (#f0f0f0), the page background (--background) and the
  // header (--nav) of the first screen and the content pages.
  themeColor: color['tone-100'],
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
        <a href="#content-start" className="skip-link">
          Skip to content
        </a>
        <Providers>
          {ANALYTICS_ENABLED && <AnalyticsBootLazy />}
          <ExperienceRouter />
          <main id="main-content">{children}</main>
          <Background />
        </Providers>
        {VERCEL_INSIGHTS_ENABLED && <VercelInsightsLazy />}
      </body>
    </html>
  );
}
