import { withSentryConfig } from '@sentry/nextjs';
import { fileURLToPath } from 'url';
import path from 'path';
import { securityHeaders } from './security-headers.mjs';

// 获取当前文件的目录
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Which deployment this build is for. Vercel sets VERCEL_ENV (production | preview | development);
// anything else (a local build, the self-hosted UAT server) is 'local'.
const deployEnv = process.env.VERCEL_ENV || process.env.DEPLOY_ENV || 'local';
// Third-party analytics only run in production builds, so previews, UAT and local runs never
// pollute GA4 / Clarity / GTM data. NEXT_PUBLIC_ANALYTICS_ENABLED=1|0 overrides for testing.
const analyticsEnabled = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED
  ? process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === '1'
  : deployEnv === 'production';

if (analyticsEnabled && deployEnv !== 'production' && !process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID) {
  console.warn(
    `[analytics] ${deployEnv} build with analytics on and no NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: it uses the production GA4 stream. Set a QA stream unless every beacon is answered locally.`,
  );
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // ENG-11: no x-powered-by: Next.js on any route.
  poweredByHeader: false,
  transpilePackages: ['three'],
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
    // DATA-15: previews and QA builds should send to their own stream (NEXT_PUBLIC_GOOGLE_ANALYTICS_ID per Vercel
    // environment). Builds without analytics need no id; a build that forces analytics on without one falls back to
    // the production stream (the e2e suite's analytics build answers every beacon locally) and warns below.
    NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || (analyticsEnabled ? 'G-QZFDSGKKYC' : ''),
    NEXT_PUBLIC_GOOGLE_ANALYTICS_DEBUG_MODE: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_DEBUG_MODE || 'false',
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
  },
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
    ];
    return config;
  },
  cacheHandler: path.join(__dirname, 'cache-handler.mjs'),
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
  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,
  widenClientFileUpload: true,
  // ENG-08: send browser events through this site (/monitoring) so content blockers do not drop them.
  tunnelRoute: '/monitoring',
  // Replay is not used in the browser (src/instrumentation-client.ts): keep its optional parts out
  // of the bundle even if something pulls the integration in.
  bundleSizeOptimizations: {
    excludeDebugStatements: true,
    excludeReplayIframe: true,
    excludeReplayShadowDom: true,
    excludeReplayWorker: true,
  },
});
