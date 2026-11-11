'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

// Route-level error page. It renders inside the root layout, so the document keeps its title,
// canonical and metadata; global-error.tsx (which replaces the whole document) stays as the last resort.
export default function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <button
        type="button"
        className="rounded-full border border-current px-6 py-2 text-sm font-semibold uppercase"
        onClick={reset}
      >
        Reload
      </button>
    </div>
  );
}
