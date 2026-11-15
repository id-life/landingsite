'use client';

import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { isAnalyticsRefused } from './consent';

/**
 * Vercel Web Analytics and Speed Insights, rendered only when NEXT_PUBLIC_VERCEL_INSIGHTS=1 (paid beyond the plan's
 * quota, off by default). Both are cookieless; events are dropped after an opt-out or with Global Privacy Control.
 */
export default function VercelInsights() {
  return (
    <>
      <Analytics beforeSend={(event) => (isAnalyticsRefused() ? null : event)} />
      <SpeedInsights beforeSend={(event) => (isAnalyticsRefused() ? null : event)} />
    </>
  );
}
