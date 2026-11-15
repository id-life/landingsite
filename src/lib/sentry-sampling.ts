import type { ConsentState } from '@/lib/analytics/consent';

/** The share of consented visits that send performance traces (ENG-08). */
export const TRACE_SAMPLE_RATE = 0.05;

/**
 * Whether this visit is one of the 5 % that may send traces, rolled once when the page starts, before the SDK loads,
 * so the other visits need not download it at all (it then loads only for an error).
 */
export const rollTraceSession = (random: () => number = Math.random) => random() < TRACE_SAMPLE_RATE;

/**
 * DATA-01: a performance trace is analytics, so it needs the visitor's consent; error reports do not. Granted, in a
 * trace visit: every trace of the visit. Anything else (no choice yet, Reject, Global Privacy Control, automation, a
 * build without the consent layer, or one of the 95 % of visits): no trace. Asked when each trace starts, so it reads
 * the consent state at that moment.
 */
export function traceSampleRate(consent: Pick<ConsentState, 'analytics'>, refused: boolean, traceVisit: boolean): number {
  return traceVisit && consent.analytics === 'granted' && !refused ? 1 : 0;
}

/**
 * A trace that was sampled under consent is sent only if consent still stands when it ends: after a later Reject it is
 * dropped, never sent.
 */
export function mayEndTrace(consent: Pick<ConsentState, 'analytics'>, refused: boolean): boolean {
  return consent.analytics === 'granted' && !refused;
}
