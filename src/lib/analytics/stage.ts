/**
 * Load stage of the page, shared with the inline head script (window.__idl, see ./head-script.ts), which sends
 * one cookieless load_abandon beacon if the visitor leaves before the experience is ready.
 * Stages only move forward: html -> hydrated -> assets -> ready.
 */
export type LoadStage = 'html' | 'hydrated' | 'assets' | 'ready';
const ORDER: LoadStage[] = ['html', 'hydrated', 'assets', 'ready'];

export type IdlRuntime = {
  stage: LoadStage;
  /** The page hosts the 3D experience (its loader mounted). */
  experience?: boolean;
  /** navigator.webdriver or a headless user agent: no third-party analytics at all. */
  bot?: boolean;
  /** navigator.globalPrivacyControl: treated as a refusal everywhere. */
  gpc?: boolean;
  /** Stored consent answer read by the head script. */
  choice?: 'granted' | 'denied' | null;
  /** Visitor country from /api/geo ('' = unknown), once known. */
  region?: string;
  /** The /api/geo request started by the head script. */
  geo?: Promise<string>;
};

declare global {
  interface Window {
    __idl?: IdlRuntime;
    __landing?: { href: string; referrer: string; title: string; t0: number };
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function advanceStage(stage: LoadStage) {
  if (typeof window === 'undefined') return;
  const idl = (window.__idl ??= { stage: 'html' });
  if (ORDER.indexOf(stage) > ORDER.indexOf(idl.stage)) idl.stage = stage;
}

export function markExperiencePage() {
  if (typeof window === 'undefined') return;
  (window.__idl ??= { stage: 'html' }).experience = true;
}
