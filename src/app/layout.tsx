import { clsx } from 'clsx';
import Nav from '@/components/nav';
import type { Metadata } from 'next';
import Providers from '@/providers/root';
import { poppins, xirod } from '@/styles/fonts';

import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Immortal Dragons',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={clsx(xirod.variable, poppins.variable, 'antialiased')} suppressHydrationWarning>
        <Providers>
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
