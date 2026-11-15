import * as Sentry from '@sentry/nextjs';
import { sentryBaseOptions } from '@/lib/sentry-options';

Sentry.init({
  ...sentryBaseOptions,

  // Errors and light tracing only, in every route's shared runtime. No Session Replay: with any
  // replaysOnErrorSampleRate above 0 the SDK buffers every session in memory (a full DOM snapshot
  // each minute), and the 3D routes mutate a ~36,000-node DOM every frame. Error-only Replay on the
  // content routes, loaded after idle and consent, is a later item. No browser profiling either
  // (beta, Chromium only, and it needs a Document-Policy header on every response).
  integrations: [Sentry.browserTracingIntegration()],

  tracesSampleRate: 0.05,
  // Errors are reported from Vercel production and preview builds only, tagged by environment and release
  // (src/lib/sentry-options.ts); local and self-hosted UAT builds stay out of the production Sentry project.
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
