import * as Sentry from '@sentry/nextjs';
import { sentryBaseOptions } from '@/lib/sentry-options';

// The browser SDK's init, in a chunk of its own that ./sentry-client.ts loads after the page is idle (PERF-10).
// The build-time values the Sentry webpack plugin injects (release, the /monitoring tunnel) are set by
// src/instrumentation-client.ts, which runs first, so the SDK reads them here as it did there.
Sentry.init({
  ...sentryBaseOptions,

  // Errors and light tracing only. No Session Replay: with any replaysOnErrorSampleRate above 0 the SDK buffers
  // every session in memory (a full DOM snapshot each minute), and the 3D routes mutate a ~36,000-node DOM every
  // frame. No browser profiling either (beta, Chromium only, and it needs a Document-Policy header on every
  // response). Initialised after load, browserTracingIntegration still starts the pageload span at the navigation
  // start and reads the buffered web-vitals entries.
  integrations: [Sentry.browserTracingIntegration()],

  tracesSampleRate: 0.05,
  // Errors are reported from Vercel production and preview builds only, tagged by environment and release
  // (src/lib/sentry-options.ts); local and self-hosted UAT builds stay out of the production Sentry project.
});

export { Sentry };
