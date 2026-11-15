import { sentryBaseOptions } from '@/lib/sentry-options';
import { getConsentState, isAnalyticsRefused, subscribeConsent } from '@/lib/analytics/consent';
import { mayEndTrace, rollTraceSession } from '@/lib/sentry-sampling';

/**
 * The browser's Sentry SDK, never in a route's first-load bundle (PERF-10: about 50 kB gzip of the 284 kB /news
 * shipped), and downloaded only when needed: on the first error, or for a trace visit with consent (startSentry). Until
 * it has loaded, captures wait in a queue, and uncaught errors
 * and rejections are queued by two listeners of our own; the first error loads the SDK at once. Once it has
 * initialised, its own global handlers take over and ours are removed. Builds where Sentry is disabled (local and
 * self-hosted UAT, see ./sentry-options.ts) never download it: captures are dropped there, as the SDK would drop them.
 *
 * Server code keeps importing '@sentry/nextjs' directly; this module is for client code only.
 */
type SentrySDK = typeof import('./sentry-init').Sentry;

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

let traceVisit = false;
/** Whether this visit is one of the few that may send performance traces (see ./sentry-sampling.ts). */
export const isTraceVisit = () => traceVisit;

const consented = () => mayEndTrace(getConsentState(), isAnalyticsRefused());

/** A trace visit loads the SDK once analytics consent is granted (now, or when the visitor accepts later). */
function loadWhenConsented() {
  if (consented()) {
    void loadSentry();
    return;
  }
  const stop = subscribeConsent(() => {
    if (!consented()) return;
    stop();
    void loadSentry();
  });
}

/**
 * Called once from instrumentation-client.ts. Uncaught errors are queued from the start, and the first error loads the
 * SDK. Otherwise only a trace visit (5 %) with analytics consent loads it, when the browser is idle after the load event
 * (at most 5 s later), so it never competes with the first screen; every other visit never downloads it.
 */
export function startSentry() {
  if (!SENTRY_ENABLED || typeof window === 'undefined') return;
  window.addEventListener('error', onError);
  window.addEventListener('unhandledrejection', onRejection);
  traceVisit = rollTraceSession();
  if (!traceVisit) return;
  const idle = () =>
    'requestIdleCallback' in window
      ? window.requestIdleCallback(loadWhenConsented, { timeout: 5000 })
      : setTimeout(loadWhenConsented, 1000);
  if (document.readyState === 'complete') idle();
  else window.addEventListener('load', idle, { once: true });
}

/** Next's router-transition hook: forwarded once the SDK is loaded (earlier transitions are not traced). */
export function onRouterTransitionStart(href: string, navigationType: string) {
  sdk?.captureRouterTransitionStart(href, navigationType);
}
