'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';
import ErrorState, { ERROR_LINKS, ERROR_MESSAGE, TryAgainButton } from '@/components/common/ErrorState';
import { color } from '@/styles/tokens';

import '@/styles/globals.css';

// Replaces the root layout when that fails, so it brings its own <html lang>, the site stylesheet and the
// critical body styles inline (the root layout's font classes and background are gone with it).
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          background: `linear-gradient(90deg, ${color.white} 0%, ${color['scene-sky']} 50%, ${color['scene-haze']} 100%)`,
          color: color.black,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Microsoft YaHei", sans-serif',
        }}
      >
        <ErrorState
          code="Error"
          title="Something went wrong"
          message={ERROR_MESSAGE}
          links={ERROR_LINKS}
          action={<TryAgainButton onClick={() => window.location.reload()} />}
        />
      </body>
    </html>
  );
}
