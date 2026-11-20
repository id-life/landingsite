'use client';

type Where = 'route' | 'section' | 'global';

/**
 * Test hook for the error states: throws while rendering when the address asks for this place
 * (?force-error=route|section|global). Never imported statically: ./ForcedErrorGate loads it only when the address
 * carries "force-error", so a build without the parameter in the address never downloads it, and a production build
 * has none of it (each placement requires the gate behind the compile-time NEXT_PUBLIC_DEPLOY_ENV check).
 * - route: placed under the route's layout, inside app/error.tsx (the route error page: the site header and Reload);
 * - section: placed inside the experience's ClientChunkBoundary (its Reload, the experience header kept);
 * - global: placed in the root layout, outside app/error.tsx (app/global-error.tsx).
 */
export default function ForcedError({ where }: { where: Where }) {
  if (new URLSearchParams(window.location.search).get('force-error') === where) {
    throw new Error(`force-error test hook: ${where}`);
  }
  return null;
}
