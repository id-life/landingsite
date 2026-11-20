'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

type Where = 'route' | 'section' | 'global';

/**
 * Test hook for the error states, compiled only into non-production builds: with ?force-error=<where> in the address,
 * the copy of this component placed at <where> throws while rendering in the browser, on a first load and on a client
 * navigation alike (it reads the address the router is rendering, not window.location, which still holds the previous
 * address while a navigation renders). So a test reaches the same error page every time:
 * - route: placed under the route's layout, inside app/error.tsx (the route error page: the site header and Reload);
 * - section: placed inside the experience's ClientChunkBoundary (its Reload, the experience header kept);
 * - global: placed in the root layout, outside app/error.tsx (app/global-error.tsx).
 * Each placement imports it only when NEXT_PUBLIC_DEPLOY_ENV is not 'production' (a compile-time constant), so a
 * production build has no chunk, module or string of it; the check below is a second guard.
 */
export default function ForcedError({ where }: { where: Where }) {
  if (process.env.NEXT_PUBLIC_DEPLOY_ENV === 'production') return null;
  // A static page's server render does not know the query, so the hook is rendered in the browser only (the Suspense
  // boundary keeps that to this empty subtree).
  return (
    <Suspense fallback={null}>
      <Thrower where={where} />
    </Suspense>
  );
}

function Thrower({ where }: { where: Where }) {
  if (useSearchParams()?.get('force-error') === where) throw new Error(`force-error test hook: ${where}`);
  return null;
}
