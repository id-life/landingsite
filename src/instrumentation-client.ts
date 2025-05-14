import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://da52a0eda21c3287f29a63f9ae3f04af@o4509309166616576.ingest.us.sentry.io/4509309184180224',

  integrations: [Sentry.replayIntegration(), Sentry.browserTracingIntegration(), Sentry.browserProfilingIntegration()],

  tracesSampleRate: 0.2,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 0.1,
  profilesSampleRate: 0.5,
  // tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],

  debug: false,
  enabled: process.env.NODE_ENV !== 'development',
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
