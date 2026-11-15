// Security headers of every response (ENG-11), used by next.config.mjs headers().
//
// Content-Security-Policy: a static allowlist (no nonces: they would force every page to render dynamically). It keeps
// 'unsafe-inline' for scripts (Next's inline bootstrap and the analytics head script), so it does not stop an inline
// script injection (ENG-xss-sinks is the fix for those); it limits which hosts can serve scripts and frames and where
// data can be sent. 'wasm-unsafe-eval' and blob: workers are for three's DRACOLoader (WASM decoder in blob workers).
//
// Mode: CSP_MODE=enforce | report-only. Default: report-only on production (enforce after 14 days without
// first-party violations in the Sentry security report stream), enforced on every other build so tests catch a
// missing host.

const SENTRY_ORG_HOST = 'o4509309166616576.ingest.us.sentry.io';
const SENTRY_PROJECT = '4509309184180224';
const SENTRY_KEY = 'da52a0eda21c3287f29a63f9ae3f04af';

export function contentSecurityPolicy({ deployEnv, turnstile = false }) {
  const cloudflare = turnstile ? ['https://challenges.cloudflare.com'] : [];
  const directives = {
    'default-src': ["'self'"],
    'script-src': ["'self'", "'unsafe-inline'", "'wasm-unsafe-eval'", 'https://www.googletagmanager.com', ...cloudflare],
    'style-src': ["'self'", "'unsafe-inline'"],
    // CMS content may embed images from any https host.
    'img-src': ["'self'", 'data:', 'blob:', 'https:'],
    'font-src': ["'self'", 'data:'],
    // blob: and data: because three's GLTFLoader turns embedded textures into blob: URLs and fetches them through
    // ImageBitmapLoader (found by the CSP check on the desktop sections: 31 to 35 violations per page).
    'connect-src': [
      "'self'",
      'blob:',
      'data:',
      'https://id-platform.id.life',
      'https://cdn.id.life',
      'https://resources.id.life',
      'https://*.google-analytics.com',
      'https://*.analytics.google.com',
      'https://*.googletagmanager.com',
      'https://www.google.com',
      'https://*.ingest.us.sentry.io',
      'https://*.ingest.sentry.io',
      ...cloudflare,
    ],
    'media-src': ["'self'", 'blob:', 'https://cdn.id.life', 'https://resources.id.life'],
    'frame-src': ['https://www.youtube-nocookie.com', 'https://www.youtube.com', ...cloudflare],
    'worker-src': ["'self'", 'blob:'],
    'child-src': ["'self'", 'blob:'],
    'manifest-src': ["'self'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
  };
  const reporting = ['production', 'preview'].includes(deployEnv);
  if (reporting) {
    directives['report-uri'] = [sentrySecurityEndpoint(deployEnv)];
    directives['report-to'] = ['csp'];
  }
  return Object.entries(directives)
    .map(([name, values]) => `${name} ${values.join(' ')}`)
    .join('; ');
}

export const sentrySecurityEndpoint = (deployEnv) =>
  `https://${SENTRY_ORG_HOST}/api/${SENTRY_PROJECT}/security/?sentry_key=${SENTRY_KEY}&sentry_environment=${encodeURIComponent(deployEnv)}`;

/**
 * Headers for every response: HSTS, COOP and CORP. A few dozen bytes each, so static files carry them too.
 */
export function securityHeaders() {
  return [
    // www.id.life covers only *.www.id.life; the apex must send this too (see the id.life redirect in next.config).
    // preload is an owner decision (hstspreload.org submission is hard to undo).
    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
    // Popups (YouTube, partner sites) keep working; the opener relationship to other origins is cut.
    { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
    { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
  ];
}

/**
 * Headers for documents: the Content-Security-Policy (about 900 bytes) and, on Vercel, its reporting endpoint. A
 * policy only governs the document (or worker) it arrives with, so next.config.mjs keeps it off the hashed
 * /_next/static chunks, optimised images and 3D models, where it added about 21 kB to a content page's first
 * visit (PERF-09 budget) and protected nothing. Workers the site starts from blob: URLs inherit the page's policy.
 */
export function documentSecurityHeaders({ deployEnv, cspMode, turnstile }) {
  const mode = cspMode || (deployEnv === 'production' ? 'report-only' : 'enforce');
  const csp = contentSecurityPolicy({ deployEnv, turnstile });
  const headers = [{ key: mode === 'enforce' ? 'Content-Security-Policy' : 'Content-Security-Policy-Report-Only', value: csp }];
  if (['production', 'preview'].includes(deployEnv)) {
    headers.push({ key: 'Reporting-Endpoints', value: `csp="${sentrySecurityEndpoint(deployEnv)}"` });
  }
  return headers;
}
