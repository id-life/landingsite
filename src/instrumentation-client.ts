import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://da52a0eda21c3287f29a63f9ae3f04af@o4509309166616576.ingest.us.sentry.io/4509309184180224',

  // Errors and light tracing only, in every route's shared runtime. No Session Replay: with any
  // replaysOnErrorSampleRate above 0 the SDK buffers every session in memory (a full DOM snapshot
  // each minute), and the 3D routes mutate a ~36,000-node DOM every frame. Error-only Replay on the
  // content routes, loaded after idle and consent, is a later item. No browser profiling either
  // (beta, Chromium only, and it needs a Document-Policy header on every response).
  integrations: [Sentry.browserTracingIntegration()],

  tracesSampleRate: 0.05,
  // tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],

  debug: false,
  // Errors are reported from Vercel production and preview builds only, tagged by environment;
  // local and self-hosted UAT builds stay out of the production Sentry project.
  environment: process.env.NEXT_PUBLIC_DEPLOY_ENV,
  enabled:
    process.env.NODE_ENV !== 'development' && ['production', 'preview'].includes(process.env.NEXT_PUBLIC_DEPLOY_ENV ?? ''),
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
