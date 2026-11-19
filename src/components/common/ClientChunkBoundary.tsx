'use client';

import { captureException } from '@/lib/sentry-client';
import { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ReloadButton } from '@/components/common/ErrorState';

// Wraps client-only (ssr: false) parts of a page. Without it, a failed chunk download or a render
// error bubbles to global-error.tsx, which replaces the whole document — including the title,
// canonical and server-rendered text that crawlers read. Here only the wrapped part is replaced, by the owner's
// "Reload" button and nothing else, as his route error page draws it (a failed chunk needs a reload).
function Fallback() {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center text-black">
      <ReloadButton onClick={() => window.location.reload()} />
    </div>
  );
}

export default function ClientChunkBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary fallback={<Fallback />} onError={(error) => captureException(error)}>
      {children}
    </ErrorBoundary>
  );
}
