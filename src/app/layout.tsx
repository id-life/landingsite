import { clsx } from 'clsx';
import Nav from '@/components/nav';
import Providers from '@/providers/root';
import Background from '@/components/common/Background';
import { migrena, oxanium, poppins, ttLakes, xirod } from '@/styles/fonts';
import type { Metadata } from 'next';
import '../utils/analytics';

import '@/styles/globals.css';
import FixedUI from '@/components/common/FixedUI';

export const metadata: Metadata = {
  title: 'IMMORTAL DRAGONS',
  description: 'Til Unlimited Human Healthy Lifespan.',
  keywords: [
    'Longevity',
    'anti-aging',
    'life extension',
    'investment fund',
    'innovation',
    'biotech',
    'pharmaceutical',
    'healthcare',
  ],
  openGraph: {
    title: 'IMMORTAL DRAGONS',
    description: 'Til Unlimited Human Healthy Lifespan.',
    images: [
      {
        url: 'https://cdn.id.life/id-life-cover.webp',
      },
    ],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={clsx(xirod.variable, poppins.variable, migrena.variable, ttLakes.variable, oxanium.variable, 'antialiased')}
        suppressHydrationWarning
      >
        <Providers>
          <Nav />
          {children}
          <FixedUI />
          <Background />
        </Providers>
      </body>
    </html>
  );
}
