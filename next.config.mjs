import { withSentryConfig } from '@sentry/nextjs';
import { fileURLToPath } from 'url';
import path from 'path';

// 获取当前文件的目录
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ['three'],
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
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Document-Policy',
            value: 'js-profiling',
          },
        ],
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
});
