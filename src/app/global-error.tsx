'use client';

import { captureException } from '@/lib/sentry-client';
import { useEffect } from 'react';
import ErrorState, { ERROR_LINKS, ERROR_MESSAGE, TryAgainButton } from '@/components/common/ErrorState';

// Design tokens first (VIS-02): every colour, font role, type role and grid value, generated from tokens.ts. Imported
// here rather than with @import in globals.css, which made it a separate stylesheet request.
import '@/styles/tokens.css';
import '@/styles/globals.css';

// Replaces the root layout when that fails, so it brings its own <html lang>, the site stylesheet and the
// critical body styles inline (the root layout's font classes and background are gone with it).
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          background: 'linear-gradient(90deg, var(--color-white) 0%, var(--color-scene-sky) 50%, var(--color-scene-haze) 100%)',
          color: 'var(--color-black)',
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
