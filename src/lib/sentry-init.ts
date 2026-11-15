import { browserTracingIntegration, captureException, captureRouterTransitionStart, init } from '@sentry/nextjs';
import { sentryBaseOptions } from '@/lib/sentry-options';
import { getConsentState, isAnalyticsRefused } from '@/lib/analytics/consent';
import { mayEndTrace, traceSampleRate } from '@/lib/sentry-sampling';

// The browser SDK's init, in a chunk of its own that ./sentry-client.ts loads after the page is idle (PERF-10).
// The build-time values the Sentry webpack plugin injects (release, the /monitoring tunnel) are set by
// src/instrumentation-client.ts, which runs first, so the SDK reads them here as it did there.
init({
  ...sentryBaseOptions,

  // Errors and light tracing only. No Session Replay: with any replaysOnErrorSampleRate above 0 the SDK buffers
  // every session in memory (a full DOM snapshot each minute), and the 3D routes mutate a ~36,000-node DOM every
  // frame. No browser profiling either (beta, Chromium only, and it needs a Document-Policy header on every
  // response). Initialised after load, browserTracingIntegration still starts the pageload span at the navigation
  // start and reads the buffered web-vitals entries.
  integrations: [browserTracingIntegration()],

  // DATA-01: traces only with consent (5 % then), decided when each trace starts; a trace that ends after a Reject is
  // dropped. Error reports need no consent and are unaffected.
  tracesSampler: () => traceSampleRate(getConsentState(), isAnalyticsRefused()),
  beforeSendTransaction: (event) => (mayEndTrace(getConsentState(), isAnalyticsRefused()) ? event : null),
  // Errors are reported from Vercel production and preview builds only, tagged by environment and release
  // (src/lib/sentry-options.ts); local and self-hosted UAT builds stay out of the production Sentry project.
});

// Named imports and a two-function export, never the module namespace: re-exporting `* as Sentry` from a lazy chunk
// kept the whole SDK in it (Replay and Feedback included: 163 kB gzip instead of about 50).
export const Sentry = { captureException, captureRouterTransitionStart };
