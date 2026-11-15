'use client';

import { ANALYTICS_ENABLED } from '@/lib/analytics/config';
import { canRenderConsentCopy, CONSENT_COPY } from '@/lib/analytics/consent-copy';
import { openPrivacyChoices } from '@/lib/analytics/consent';

// Its own module (PERF-10): the footers import it on every page, and from ConsentBanner.tsx it brought the whole banner.
/** "Privacy choices" link for the footers: reopens the banner. Renders nothing while its text may not be shown. */
export function PrivacyChoicesLink({ className }: { className?: string }) {
  if (!ANALYTICS_ENABLED || !canRenderConsentCopy()) return null;
  return (
    <button type="button" className={className ?? 'underline opacity-70 hover:opacity-100'} onClick={openPrivacyChoices}>
      {CONSENT_COPY.en.link} · {CONSENT_COPY.zh.link}
    </button>
  );
}
