import { withSentry } from '@/lib/sentry-client';

export type ReportContext = { area: string } & Record<string, string | number | boolean | undefined | null>;

/**
 * Report a caught error (ENG-08): normalise it to an Error and send it to Sentry with an `area` tag and the other
 * context as tags. Use it in every catch that handles a failure, instead of console.error alone. Sentry is enabled
 * only on Vercel production and preview builds; elsewhere this logs to the console in development only.
 */
export function reportError(error: unknown, context: ReportContext) {
  const err =
    error instanceof Error
      ? error
      : new Error(typeof error === 'string' ? error : `Non-Error thrown: ${safeString(error)}`, { cause: error });
  const tags: Record<string, string> = {};
  for (const [key, value] of Object.entries(context)) {
    if (value !== undefined && value !== null) tags[key] = String(value).slice(0, 200);
  }
  // In the browser the SDK loads lazily (./sentry-client.ts: queued until then, PERF-10); on the server it is imported
  // on demand, so the browser bundle never includes it statically.
  if (typeof window === 'undefined') void import('@sentry/nextjs').then((Sentry) => Sentry.captureException(err, { tags }));
  else withSentry((Sentry) => Sentry.captureException(err, { tags }));
  if (process.env.NODE_ENV === 'development') console.error(`[${context.area}]`, err);
}

function safeString(value: unknown) {
  try {
    return JSON.stringify(value)?.slice(0, 200) ?? String(value);
  } catch {
    return String(value);
  }
}

/**
 * A media play() rejection: the autoplay policy (NotAllowedError) and an interrupted load (AbortError) are expected
 * browser behaviour, not bugs; anything else is reported.
 */
export function reportMediaError(error: unknown, context: ReportContext) {
  const name = (error as { name?: string } | null)?.name;
  if (name === 'NotAllowedError' || name === 'AbortError') return;
  reportError(error, context);
}
