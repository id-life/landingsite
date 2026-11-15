import {
  ANALYTICS_ENABLED,
  CONSENT_COOKIE,
  CONSENT_MAX_AGE_S,
  isOptInRegion,
  POLICY_VERSION,
  REGION_OVERRIDE_ALLOWED,
} from './config';
import { canRenderConsentCopy } from './consent-copy';

/**
 * Region-aware consent (DATA-01). Opt-in regions (EEA, UK, Switzerland, mainland China, unknown) get no analytics
 * until Accept; elsewhere analytics runs with a one-tap opt-out. Advertising storage is denied everywhere, Global
 * Privacy Control counts as a refusal everywhere, and automated browsers never load analytics (DATA-15).
 *
 * The answer lives in a first-party cookie (CONSENT_COOKIE, 180 days) under a random consent id, mirrored to
 * localStorage, and each answer is logged by POST /api/consent with that id and no IP, so a visitor's own choice
 * can be demonstrated without identifying anyone.
 */
export type ConsentReason = 'pending' | 'stored' | 'region' | 'gpc' | 'automation' | 'disabled';
export type ConsentState = {
  analytics: 'granted' | 'denied' | 'unset';
  reason: ConsentReason;
  /** Visitor country ('' unknown), null until known. */
  region: string | null;
  optIn: boolean;
  /** The banner (or the preferences opened from "Privacy choices") is on screen. */
  bannerOpen: boolean;
};

type Stored = { v: 1; id: string; a: 'g' | 'd'; t: number; p: string };

let state: ConsentState = { analytics: 'unset', reason: 'pending', region: null, optIn: true, bannerOpen: false };
const listeners = new Set<() => void>();
let started = false;

export const getConsentState = () => state;
export function subscribeConsent(listener: () => void) {
  listeners.add(listener);
  return () => void listeners.delete(listener);
}
function setState(patch: Partial<ConsentState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function readCookie(name: string) {
  try {
    const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return m ? decodeURIComponent(m[1]) : null;
  } catch {
    return null;
  }
}

export function readStoredConsent(): Stored | null {
  let raw = readCookie(CONSENT_COOKIE);
  if (!raw) {
    try {
      raw = localStorage.getItem(CONSENT_COOKIE);
    } catch {
      raw = null;
    }
  }
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed && (parsed.a === 'g' || parsed.a === 'd') && typeof parsed.id === 'string' ? parsed : null;
  } catch {
    return null;
  }
}

function randomId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  }
}

function writeStoredConsent(choice: 'granted' | 'denied') {
  const previous = readStoredConsent();
  const record: Stored = {
    v: 1,
    id: previous?.id ?? randomId(),
    a: choice === 'granted' ? 'g' : 'd',
    t: Date.now(),
    p: POLICY_VERSION,
  };
  const value = JSON.stringify(record);
  try {
    const secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(value)}; Max-Age=${CONSENT_MAX_AGE_S}; Path=/; SameSite=Lax${secure}`;
  } catch {
    // Cookies blocked: the localStorage mirror (if any) still holds the answer for this browser.
  }
  try {
    localStorage.setItem(CONSENT_COOKIE, value);
  } catch {
    // Storage blocked: the answer lasts for this page only.
  }
  return record;
}

/** Log an answer without identifying anyone: the random consent id, the answer, region and policy version. */
function logConsent(record: Stored, region: string | null) {
  try {
    const body = JSON.stringify({
      consentId: record.id,
      choice: record.a === 'g' ? 'granted' : 'denied',
      region: region ?? '',
      policyVersion: record.p,
      ts: record.t,
    });
    if (navigator.sendBeacon) navigator.sendBeacon('/api/consent', new Blob([body], { type: 'application/json' }));
    else void fetch('/api/consent', { method: 'POST', body, keepalive: true, headers: { 'content-type': 'application/json' } });
  } catch {
    // Logging is best effort; the visitor's own cookie still records the answer.
  }
}

async function lookupRegion(): Promise<string> {
  const idl = window.__idl;
  if (typeof idl?.region === 'string') return idl.region;
  if (idl?.geo) return idl.geo;
  try {
    const res = await fetch('/api/geo', { credentials: 'same-origin', cache: 'no-store' });
    const json = res.ok ? await res.json() : {};
    return typeof json.country === 'string' ? json.country.toUpperCase() : '';
  } catch {
    return '';
  }
}

export const isAutomated = () =>
  typeof navigator !== 'undefined' && (navigator.webdriver === true || /Headless/i.test(navigator.userAgent || ''));
export const hasGlobalPrivacyControl = () =>
  typeof navigator !== 'undefined' &&
  (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;

/** Resolve the consent state once per page (idempotent). */
export async function startConsent() {
  if (started || typeof window === 'undefined') return;
  started = true;
  if (!ANALYTICS_ENABLED) return setState({ analytics: 'denied', reason: 'disabled' });
  if (isAutomated()) return setState({ analytics: 'denied', reason: 'automation' });
  const region = await lookupRegion();
  const optIn = isOptInRegion(region);
  if (hasGlobalPrivacyControl()) return setState({ analytics: 'denied', reason: 'gpc', region, optIn });
  const stored = readStoredConsent();
  if (stored) return setState({ analytics: stored.a === 'g' ? 'granted' : 'denied', reason: 'stored', region, optIn });
  if (!optIn) return setState({ analytics: 'granted', reason: 'region', region, optIn });
  // Opt-in region and no answer yet: ask, when the banner text may be shown in this build.
  setState({ analytics: 'unset', reason: 'region', region, optIn, bannerOpen: canRenderConsentCopy() });
}

export function chooseConsent(choice: 'granted' | 'denied') {
  const record = writeStoredConsent(choice);
  logConsent(record, state.region);
  setState({ analytics: choice, reason: 'stored', bannerOpen: false });
}

/** "Privacy choices": reopen the banner with the current answer. */
export function openPrivacyChoices() {
  if (!canRenderConsentCopy()) return;
  setState({ bannerOpen: true });
}

export function closePrivacyChoices() {
  setState({ bannerOpen: false });
}

/** Whether the visitor has opted out or sends GPC (Vercel Analytics' beforeSend drops events then). */
export const isAnalyticsRefused = () => state.analytics === 'denied' || hasGlobalPrivacyControl();

/** Test-only: the region override cookie is honoured by /api/geo outside production. */
export const regionOverrideAllowed = REGION_OVERRIDE_ALLOWED;
