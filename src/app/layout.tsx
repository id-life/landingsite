import React from 'react';
import { clsx } from 'clsx';
import Providers from '@/providers/root';
import { Analytics } from '@vercel/analytics/next';
import ClientNav from '@/components/nav/CilentNav';
import Background from '@/components/common/Background';
import { WebVitals } from '@/app/_components/web-vitals';
import { SpeedInsights } from '@vercel/speed-insights/next';
import NewsArticle1 from '@/app/news/_components/NewsArticle1';
import ScrollBehavior from '@/components/common/ScrollBehavior';
import BodyScrollManager from '@/components/common/BodyScrollManager';
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google';
import { migrena, oxanium, poppins, sourceHanSansCN, ttLakes, xirod } from '@/styles/fonts';

import '@/styles/globals.css';
import 'swiper/css';

const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
const gaDebugMode = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_DEBUG_MODE === 'true';

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
          <BodyScrollManager />
          <ScrollBehavior />
          <ClientNav />
          {children}
          <Background />
        </Providers>
        <NewsArticle1 />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
