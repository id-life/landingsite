'use client';

import { captureException } from '@/lib/sentry-client';
import { useRouter } from 'next/navigation';
import { startTransition, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ReloadButton } from '@/components/common/ErrorState';

// Loaded only when a route fails: this boundary is in every route's initial JavaScript, the header and the popup
// are not (PERF-10).
const SiteHeader = dynamic(() => import('@/components/site/SiteHeader'));
const SubscribePopup = dynamic(() => import('@/components/layout/footer/SubscribePopup'));

// Route-level error page. It renders inside the root layout, so the document keeps its title, canonical and
// metadata; global-error.tsx (which replaces the whole document) stays as the last resort.
//
// It draws what the owner's site draws when a route fails: one "Reload" button, nothing else (his rule: no text he has
// not shown). Above it, the site's header as the content pages have it (his logo and SUBSCRIBE): the way home his
// page lacked, a defect fix.
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
      <div className="mx-auto w-[80rem] mobile:w-auto mobile:px-5">
        <SiteHeader variant="solid" currentId={null} className="relative py-5" />
        <main
          id="content-start"
          tabIndex={-1}
          className="flex min-h-[60svh] items-center justify-center text-black outline-none"
        >
          <ReloadButton onClick={retry} />
        </main>
      </div>
      <SubscribePopup />
    </>
  );
}
