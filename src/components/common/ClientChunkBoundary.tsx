'use client';

import * as Sentry from '@sentry/nextjs';
import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

// Wraps client-only (ssr: false) parts of a page. Without it, a failed chunk download or a render
// error bubbles to global-error.tsx, which replaces the whole document — including the title,
// canonical and server-rendered text that crawlers read. Here only the wrapped part is replaced.
function Fallback() {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center">
      <button
        type="button"
        className="rounded-full border border-current px-6 py-2 text-sm font-semibold uppercase"
        onClick={() => window.location.reload()}
      >
        Reload
      </button>
    </div>
  );
}

export default function ClientChunkBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary fallback={<Fallback />} onError={(error) => Sentry.captureException(error)}>
      {children}
    </ErrorBoundary>
  );
}
