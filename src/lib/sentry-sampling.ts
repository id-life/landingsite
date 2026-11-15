import type { ConsentState } from '@/lib/analytics/consent';

/** The share of consented page loads and navigations that send a performance trace (ENG-08). */
export const TRACE_SAMPLE_RATE = 0.05;

/**
 * DATA-01: a performance trace is analytics, so it needs the visitor's consent; error reports do not. Granted: the
 * usual 5 %. Anything else (no choice yet, Reject, Global Privacy Control, automation, a build without the consent
 * layer): no trace. Decided when each trace starts, from the consent state at that moment.
 */
export function traceSampleRate(consent: Pick<ConsentState, 'analytics'>, refused: boolean): number {
  return consent.analytics === 'granted' && !refused ? TRACE_SAMPLE_RATE : 0;
}

/**
 * A trace that was sampled under consent is sent only if consent still stands when it ends: after a later Reject it is
 * dropped, never sent.
 */
export function mayEndTrace(consent: Pick<ConsentState, 'analytics'>, refused: boolean): boolean {
  return consent.analytics === 'granted' && !refused;
}
