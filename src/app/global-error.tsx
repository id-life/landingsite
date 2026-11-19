'use client';

import { captureException } from '@/lib/sentry-client';
import { useEffect } from 'react';

// Design tokens first (VIS-02): every colour, font role, type role and grid value, generated from tokens.ts. Imported
// here rather than with @import in globals.css, which made it a separate stylesheet request.
import '@/styles/tokens.css';
import '@/styles/globals.css';

/** The sentence the owner's site draws when its root layout fails (the framework's default error page). */
const GLOBAL_ERROR_TEXT =
  'Application error: a client-side exception has occurred (see the browser console for more information).';

// Replaces the root layout when that fails, so it brings its own <html lang> and the critical body styles inline (the
// root layout's font classes and background are gone with it). It draws what the owner's site draws in that case,
// the framework's default sentence, and nothing else (his rule: no text he has not shown); like his, no title.
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          background: 'linear-gradient(90deg, var(--color-white) 0%, var(--color-scene-sky) 50%, var(--color-scene-haze) 100%)',
          color: 'var(--color-black)',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Microsoft YaHei", sans-serif',
        }}
      >
        <h2 style={{ fontSize: 14, fontWeight: 400, lineHeight: '28px', margin: '0 20px' }}>{GLOBAL_ERROR_TEXT}</h2>
      </body>
    </html>
  );
}
