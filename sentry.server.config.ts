import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://da52a0eda21c3287f29a63f9ae3f04af@o4509309166616576.ingest.us.sentry.io/4509309184180224',
  tracesSampleRate: 0.2,
  debug: false,
  enabled: process.env.NODE_ENV !== 'development',
});
