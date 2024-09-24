import Nav from '@/components/nav';
import Providers from '@/providers/root';
import { migrena, poppins, ttLakes, xirod } from '@/styles/fonts';
import { clsx } from 'clsx';
import type { Metadata } from 'next';
import '../utils/analytics';

import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'IMMORTAL DRAGONS',
  description: 'Committed to Human Longevity - Til Unlimited Human Healthy Lifespan.',
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
    description: 'Committed to Human Longevity - Til Unlimited Human Healthy Lifespan.',
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
        className={clsx(xirod.variable, poppins.variable, migrena.variable, ttLakes.variable, 'antialiased')}
        suppressHydrationWarning
      >
        <Providers>
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
