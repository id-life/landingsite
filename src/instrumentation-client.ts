import { onRouterTransitionStart as forwardRouterTransition, startSentry } from '@/lib/sentry-client';

// PERF-10: the Sentry browser SDK is no longer in every route's first-load JavaScript. This file (which Next runs
// before hydration, and into which the Sentry build plugin injects the release and tunnel values) only queues uncaught
// errors and schedules the SDK for when the page is idle; the init itself is src/lib/sentry-init.ts.
startSentry();

export const onRouterTransitionStart = forwardRouterTransition;
