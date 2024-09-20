import Nav from '@/components/nav';
import Providers from '@/providers/root';
import { migrena, poppins, ttLakes, xirod } from '@/styles/fonts';
import { clsx } from 'clsx';
import type { Metadata } from 'next';
import '../utils/analytics';

import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Immortal Dragons',
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
