import { ANALYTICS_ENABLED, DEPLOY_ENV } from '@/constants/env';

export { ANALYTICS_ENABLED };

/** GA4 measurement id. Production uses the production stream; previews and QA builds set their own. */
export const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ?? '';
export const GA_DEBUG_MODE = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_DEBUG_MODE === 'true';

/**
 * Vercel Web Analytics and Speed Insights are paid beyond the plan's quota, so they are OFF unless
 * NEXT_PUBLIC_VERCEL_INSIGHTS=1 is set for the deployment (an owner decision). While Speed Insights runs, the GA4
 * web_vital stream is not sent, so a page view carries exactly one Core Web Vitals stream.
 */
export const VERCEL_INSIGHTS_ENABLED = ANALYTICS_ENABLED && process.env.NEXT_PUBLIC_VERCEL_INSIGHTS === '1';
/** Mirror the key events to Vercel Web Analytics custom events (a Vercel Pro feature): NEXT_PUBLIC_VERCEL_EVENTS=1. */
export const VERCEL_EVENTS_ENABLED = VERCEL_INSIGHTS_ENABLED && process.env.NEXT_PUBLIC_VERCEL_EVENTS === '1';

/**
 * The owner's decision of 2026-11-20 (question 26, answer B, his words: "B for now. I can do the compliance later."):
 * every visitor is counted without asking, as on his site, whatever the region. No banner is drawn and the region
 * changes nothing. The regional consent below (DATA-01) and its banner stay in the code, out of the path: set this
 * to false, and approve the banner text (consent-copy.ts), to bring them back.
 */
export const COUNT_EVERY_VISITOR = true;

/**
 * Countries where analytics waits for an explicit Accept (Consent Mode v2 basic mode): the EEA (EU 27, Iceland,
 * Liechtenstein, Norway), the UK, Switzerland and mainland China. An unknown country counts as opt-in.
 */
export const OPT_IN_COUNTRIES = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT',
  'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH', 'CN',
] as const; // prettier-ignore

export const isOptInRegion = (country: string | null | undefined) =>
  !country || (OPT_IN_COUNTRIES as readonly string[]).includes(country.toUpperCase());

/** First-party consent record (180 days): {"v":1,"id":<random uuid>,"a":"g"|"d","t":<ms>,"p":<policy version>}. */
export const CONSENT_COOKIE = 'idl_consent';
export const CONSENT_MAX_AGE_S = 180 * 24 * 60 * 60;
/** Bump when the consent text changes in a way that needs a new answer. */
export const POLICY_VERSION = '2026-11-15-draft';
/** Test-only region override, honoured by /api/geo outside production builds. */
export const REGION_OVERRIDE_COOKIE = 'idl_region';
export const REGION_OVERRIDE_ALLOWED = DEPLOY_ENV !== 'production';
/** ?internal=1 sets it, ?internal=0 clears it: events then carry traffic_type=internal. */
export const INTERNAL_FLAG_KEY = 'idl_internal';

/** Query parameters removed from the address bar once the first page_view has its landing URL. */
export const TRACKING_PARAMS = /^(utm_[a-z_]+|gclid|fbclid|msclkid|internal)$/i;
