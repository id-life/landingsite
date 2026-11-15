'use client';

import dynamic from 'next/dynamic';

// PERF-10: the root layout renders these only when their flag is on, but a client component a server layout imports
// ships to every route whether it renders or not. Loaded through next/dynamic, the consent and Google tag boot
// (consent, banner, stream, about 9 kB gzip) and Vercel's two scripts are separate chunks: absent from builds with the
// flag off, and off the first-load bundle in builds with it on (they mount right after hydration).
export const AnalyticsBootLazy = dynamic(() => import('./boot'), { ssr: false });
export const VercelInsightsLazy = dynamic(() => import('./VercelInsights'), { ssr: false });
