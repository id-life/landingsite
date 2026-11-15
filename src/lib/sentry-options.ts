/**
 * Options shared by the browser, server and edge Sentry configs (ENG-08): errors only (no Replay, no profiling),
 * reported from Vercel production and preview builds, tagged with the environment and the release, without the
 * noise of browser extensions and ResizeObserver warnings.
 */
const deployEnv = process.env.NEXT_PUBLIC_DEPLOY_ENV ?? 'local';

export const SENTRY_DSN = 'https://da52a0eda21c3287f29a63f9ae3f04af@o4509309166616576.ingest.us.sentry.io/4509309184180224';

export const sentryBaseOptions = {
  dsn: SENTRY_DSN,
  debug: false,
  environment: deployEnv,
  // The deployed commit (VERCEL_GIT_COMMIT_SHA, see next.config.mjs); undefined keeps the release the build injects.
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE || undefined,
  enabled: process.env.NODE_ENV !== 'development' && ['production', 'preview'].includes(deployEnv),
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications',
    'Non-Error promise rejection captured',
  ],
  denyUrls: [/^chrome-extension:\/\//i, /^moz-extension:\/\//i, /^safari(-web)?-extension:\/\//i, /extensions\//i],
};
