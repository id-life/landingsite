'use client';

import { captureException } from '@/lib/sentry-client';
import { useRouter } from 'next/navigation';
import { startTransition, useEffect } from 'react';
import SiteHeader from '@/components/site/SiteHeader';
import ErrorState, { ERROR_LINKS, ERROR_MESSAGE, TryAgainButton } from '@/components/common/ErrorState';

// Route-level error page. It renders inside the root layout, so the document keeps its title,
// canonical and metadata; global-error.tsx (which replaces the whole document) stays as the last resort.
export default function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    captureException(error);
  }, [error]);

  // The failed part may be server-rendered: fetch it again, then re-render this segment.
  const retry = () =>
    startTransition(() => {
      router.refresh();
      reset();
    });

  return (
    <>
      <SiteHeader variant="solid" className="absolute left-0 top-0 z-20 px-10 mobile:px-5" />
      <ErrorState
        code="Error"
        title="Something went wrong"
        message={ERROR_MESSAGE}
        links={ERROR_LINKS}
        action={<TryAgainButton onClick={retry} />}
      />
    </>
  );
}
