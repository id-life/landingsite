import { withSentryConfig } from '@sentry/nextjs/config';
import { securityHeaders } from './security-headers.mjs';

// Which deployment this build is for. Vercel sets VERCEL_ENV (production | preview | development);
// anything else (a local build, the self-hosted UAT server) is 'local'.
const deployEnv = process.env.VERCEL_ENV || process.env.DEPLOY_ENV || 'local';
// Third-party analytics only run in production builds, so previews, UAT and local runs never
// pollute GA4 / Clarity / GTM data. NEXT_PUBLIC_ANALYTICS_ENABLED=1|0 overrides for testing.
const analyticsEnabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED
  ? process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === '1'
  : deployEnv === 'production';

// DATA-15: the GA4 measurement id is not in the repository; each Vercel environment sets its own
// (Production: the production stream; Preview: a QA stream). Without one, analytics builds load no tag.
if (analyticsEnabled && !process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID) {
  console.warn(
    `[analytics] ${deployEnv} build with analytics on but no NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: no GA4 tag will load.`,
  );
}

// PERF-01: who resizes next/image images. Vercel Image Optimization is metered and the owner has not approved it for
// production, so a Vercel build defaults to 'off' (images served as stored: nothing new is billed). A self-hosted
// build (UAT, local) defaults to 'next': the Next server resizes images itself, at no cost.
//   off   images.unoptimized: every next/image serves its source URL, still lazy and sized
//   next  the built-in optimizer (/_next/image); on Vercel this is Vercel Image Optimization (metered)
//   cdn   custom loader (src/lib/image-loader.ts): CMS covers through NEXT_PUBLIC_COVER_LOADER_TEMPLATE, the rest as stored
const imageOptimizer = process.env.NEXT_PUBLIC_IMAGE_OPTIMIZER || (process.env.VERCEL ? 'off' : 'next');
if (!['off', 'next', 'cdn'].includes(imageOptimizer)) {
  throw new Error(`NEXT_PUBLIC_IMAGE_OPTIMIZER must be off, next or cdn (got ${imageOptimizer})`);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Strict Mode stays off until the section effects are idempotent. Under Strict Mode (development only) the five
  // pinned sections get nested pin spacers (the page shrinks from 22,590 to 9,090 px, the URL desyncs and wheel-up
  // stalls) and the particle sketch mounts a second p5 canvas. Turn it on once the section controller replaces them.
  reactStrictMode: false,
  // ENG-11: no x-powered-by: Next.js on any route.
  poweredByHeader: false,
  // src has ~59 debugging console.log calls (one fired on every wheel event). Strip console.log/info/debug
  // from production bundles; keep warn and error so real problems still reach the console and Sentry.
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  env: {
    NEXT_PUBLIC_DEPLOY_ENV: deployEnv,
    NEXT_PUBLIC_ANALYTICS_ENABLED: analyticsEnabled ? '1' : '0',
    // ENG-08: Sentry events carry the deployed commit as their release.
    NEXT_PUBLIC_SENTRY_RELEASE: process.env.VERCEL_GIT_COMMIT_SHA || '',
    // Public, non-secret defaults (they ship in the HTML and the client bundle anyway). They used to come from a
    // committed .env; an environment variable of the same name (Vercel project settings, a local .env) wins.
    NEXT_PUBLIC_API_PREFIX: process.env.NEXT_PUBLIC_API_PREFIX || 'https://id-platform.id.life',
    // DATA-15: set per Vercel environment, never committed (see the warning above).
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || '',
    NEXT_PUBLIC_GOOGLE_ANALYTICS_DEBUG_MODE: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_DEBUG_MODE || 'false',
    NEXT_PUBLIC_IMAGE_OPTIMIZER: imageOptimizer,
    NEXT_PUBLIC_COVER_LOADER_TEMPLATE: process.env.NEXT_PUBLIC_COVER_LOADER_TEMPLATE || '',
  },
  images: {
    // CMS covers are uploaded at full camera resolution (single files up to 11 MB); serve them
    // resized and in modern formats instead of as originals.
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.id.life' },
      { protocol: 'https', hostname: 'resources.id.life' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 640, 828, 1080, 1440, 1920, 2560],
    imageSizes: [64, 128, 256, 384],
    minimumCacheTTL: 2678400,
    ...(imageOptimizer === 'off' && { unoptimized: true }),
    ...(imageOptimizer === 'cdn' && { loader: 'custom', loaderFile: './src/lib/image-loader.ts' }),
  },
  // Turbopack (Next 16's default; used by `next dev` and `npm run build:turbopack`). Same two rules as the webpack
  // config below: `*.svg?component` imports become React components through SVGR (.svgrrc applies), and GLSL sources
  // import as strings (no shader uses a glslify pragma, so raw text is what glslify-loader produced).
  turbopack: {
    rules: {
      '*.svg': {
        condition: { query: /[?&]component(?=&|$)/ },
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
      '*.{glsl,vert,frag}': { type: 'raw' },
    },
  },
  // Production bundler (`npm run build` = `next build --webpack`, the opt-out in the Next 16 upgrade guide): with
  // Turbopack 16.4 the first screen appeared about 270 ms later on fast 4G (one 1.8 MB lazy chunk holds three, swiper
  // and the GL code). Re-measure with `npm run build:turbopack` before switching.
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'));
    config.module.rules = [
      ...config.module.rules.filter((rule) => rule !== fileLoaderRule),
      { ...fileLoaderRule, exclude: /\.svg$/i },
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: {
          ...fileLoaderRule.resourceQuery,
          not: [
            ...fileLoaderRule.resourceQuery.not,
            /component/, // *.svg?component
          ],
        },
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: '@svgr/webpack',
        resourceQuery: /component/, // *.svg?component
      },
      // 添加 GLSL 文件的处理规则
      {
        test: /\.(glsl|vert|frag)$/,
        use: ['raw-loader', 'glslify-loader'],
      },
      // n8ao comes in through @react-three/postprocessing 3's index for its <N8AO> effect, which the site does not use.
      // The package declares no sideEffects flag, so webpack kept all of it (about 70 kB, mostly an inlined noise
      // texture) on the path to the first canvas.
      { test: /[\\/]node_modules[\\/]n8ao[\\/]/, sideEffects: false },
    ];
    return config;
  },
  async redirects() {
    return [
      // ENG-11: when the apex is attached to this project, its redirect carries the headers above (HSTS with
      // includeSubDomains must come from id.life itself to cover the other id.life hosts).
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'id.life' }],
        destination: 'https://www.id.life/:path*',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [{ source: '/.well-known/security.txt', destination: '/api/security-txt' }];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // 防止点击劫持
          { key: 'X-Frame-Options', value: 'DENY' },
          // 防止 MIME 类型嗅探
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // 控制 Referer 信息
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // 限制不需要的浏览器功能
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // ENG-11: CSP, HSTS with includeSubDomains, COOP and CORP (security-headers.mjs).
          ...securityHeaders({
            deployEnv,
            cspMode: process.env.CSP_MODE,
            turnstile: Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY),
          }),
        ],
      },
      {
        // Unhashed public assets: cache for a day, serve stale while revalidating for a week.
        // (Hashed /_next/static files are already immutable; /models and /assets are set in vercel.json.)
        source: '/:dir(imgs|svgs|textures)/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }],
      },
    ];
  },
};

// Make sure adding Sentry options is the last code to run before exporting
export default withSentryConfig(nextConfig, {
  org: 'immortal-dragons',
  project: 'id-landingsite',
  // Only print logs for uploading source maps in CI
  // Set to `true` to suppress logs
  silent: !process.env.CI,
  widenClientFileUpload: true,
  // ENG-08: send browser events through this site (/monitoring) so content blockers do not drop them.
  tunnelRoute: '/monitoring',
  // Tree-shake the SDK's debug logging, and keep Replay's optional parts out of the bundle (Replay is not used in the
  // browser, src/instrumentation-client.ts). Applies to webpack and Turbopack builds.
  bundleSizeOptimizations: {
    excludeDebugStatements: true,
    excludeReplayIframe: true,
    excludeReplayShadowDom: true,
    excludeReplayWorker: true,
  },
});
