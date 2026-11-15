'use client';

import * as Sentry from '@sentry/nextjs';
import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorState, { ERROR_LINKS, ERROR_MESSAGE, TryAgainButton } from '@/components/common/ErrorState';

// Wraps client-only (ssr: false) parts of a page. Without it, a failed chunk download or a render
// error bubbles to global-error.tsx, which replaces the whole document — including the title,
// canonical and server-rendered text that crawlers read. Here only the wrapped part is replaced, by the
// same frame as the error pages (a failed chunk needs a reload, so that is the recovery).
function Fallback() {
  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <ErrorState
        code="Error"
        title="Something went wrong"
        message={ERROR_MESSAGE}
        links={ERROR_LINKS}
        action={<TryAgainButton onClick={() => window.location.reload()} />}
      />
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
