import * as Sentry from '@sentry/nextjs';
import { sentryBaseOptions } from '@/lib/sentry-options';

Sentry.init({
  ...sentryBaseOptions,
  tracesSampleRate: 0.2,
});
