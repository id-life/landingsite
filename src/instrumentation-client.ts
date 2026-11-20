import { onRouterTransitionStart as forwardRouterTransition, startSentry } from '@/lib/sentry-client';
import { retryFailedServerChunks } from '@/lib/server-chunk-retry';

declare const __webpack_require__: Parameters<typeof retryFailedServerChunks>[0];

// PERF-10: the Sentry browser SDK is no longer in every route's first-load JavaScript. This file (which Next runs
// before hydration, and into which the Sentry build plugin injects the release and tunnel values) only queues uncaught
// errors and schedules the SDK for when the page is idle; the init itself is src/lib/sentry-init.ts.
startSentry();

// A chunk the HTML listed whose download failed reaches the route's error page every time, not only when the failure
// lands after the runtime starts waiting for it (src/lib/server-chunk-retry.ts). Before hydration, so before any chunk
// is asked for.
retryFailedServerChunks(typeof __webpack_require__ === 'undefined' ? undefined : __webpack_require__, document, performance);

export const onRouterTransitionStart = forwardRouterTransition;
