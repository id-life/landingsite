import { sentryBaseOptions } from '@/lib/sentry-options';

/**
 * The browser's Sentry SDK, loaded after the page is idle instead of in every route's first-load bundle (PERF-10:
 * about 50 kB gzip of the 284 kB /news shipped). Until it has loaded, captures wait in a queue, and uncaught errors
 * and rejections are queued by two listeners of our own; the first error loads the SDK at once. Once it has
 * initialised, its own global handlers take over and ours are removed. Builds where Sentry is disabled (local and
 * self-hosted UAT, see ./sentry-options.ts) never download it: captures are dropped there, as the SDK would drop them.
 *
 * Server code keeps importing '@sentry/nextjs' directly; this module is for client code only.
 */
type SentrySDK = typeof import('@sentry/nextjs');

let sdk: SentrySDK | null = null;
let loading: Promise<SentrySDK | null> | null = null;
const pending: ((s: SentrySDK) => void)[] = [];

const SENTRY_ENABLED = sentryBaseOptions.enabled;

function onError(event: ErrorEvent) {
  const error = event.error ?? new Error(event.message);
  withSentry((s) => s.captureException(error, { mechanism: { type: 'onerror', handled: false } }));
}

function onRejection(event: PromiseRejectionEvent) {
  const reason = event.reason;
  withSentry((s) => s.captureException(reason, { mechanism: { type: 'onunhandledrejection', handled: false } }));
}

/** Load and initialise the SDK (once), then run every queued capture. */
export function loadSentry(): Promise<SentrySDK | null> {
  if (!SENTRY_ENABLED || typeof window === 'undefined') return Promise.resolve(null);
  loading ??= import('./sentry-init')
    .then(({ Sentry }) => {
      sdk = Sentry;
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
      for (const fn of pending.splice(0)) fn(Sentry);
      return Sentry;
    })
    .catch(() => {
      // A blocked or failed chunk must never break the page; the queued captures are dropped.
      pending.length = 0;
      return null;
    });
  return loading;
}

/** Run `fn` with the SDK: now if it is loaded, else once it is (and start loading it). No-op where Sentry is off. */
export function withSentry(fn: (s: SentrySDK) => void) {
  if (!SENTRY_ENABLED) return;
  if (sdk) {
    fn(sdk);
    return;
  }
  pending.push(fn);
  void loadSentry();
}

/** Sentry.captureException, through the queue. */
export function captureException(error: unknown) {
  withSentry((s) => s.captureException(error));
}

/**
 * Called once from instrumentation-client.ts: queue uncaught errors from the start, and load the SDK when the browser
 * is idle after the load event (at most 5 s later), so it never competes with the first screen.
 */
export function startSentry() {
  if (!SENTRY_ENABLED || typeof window === 'undefined') return;
  window.addEventListener('error', onError);
  window.addEventListener('unhandledrejection', onRejection);
  const idle = () =>
    'requestIdleCallback' in window
      ? window.requestIdleCallback(() => void loadSentry(), { timeout: 5000 })
      : setTimeout(() => void loadSentry(), 1000);
  if (document.readyState === 'complete') idle();
  else window.addEventListener('load', idle, { once: true });
}

/** Next's router-transition hook: forwarded once the SDK is loaded (earlier transitions are not traced). */
export function onRouterTransitionStart(href: string, navigationType: string) {
  sdk?.captureRouterTransitionStart(href, navigationType);
}
