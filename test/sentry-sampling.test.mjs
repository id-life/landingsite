// DATA-01: Sentry performance traces follow consent; error reports do not depend on it.
import { describe, expect, test } from 'vitest';
import { mayEndTrace, rollTraceSession, TRACE_SAMPLE_RATE, traceSampleRate } from '@/lib/sentry-sampling';

describe('trace sampling and consent', () => {
  test('5 % of visits are trace visits, rolled once', () => {
    expect(TRACE_SAMPLE_RATE).toBe(0.05);
    expect(rollTraceSession(() => 0.049)).toBe(true);
    expect(rollTraceSession(() => 0.05)).toBe(false);
  });

  test('granted, in a trace visit: every trace; outside a trace visit: none', () => {
    expect(traceSampleRate({ analytics: 'granted' }, false, true)).toBe(1);
    expect(traceSampleRate({ analytics: 'granted' }, false, false)).toBe(0);
  });

  test('no choice yet, Reject, or Global Privacy Control: no trace, even in a trace visit', () => {
    expect(traceSampleRate({ analytics: 'unset' }, false, true)).toBe(0);
    expect(traceSampleRate({ analytics: 'denied' }, true, true)).toBe(0);
    expect(traceSampleRate({ analytics: 'granted' }, true, true)).toBe(0);
  });

  test('a trace sampled under consent is dropped if consent is withdrawn before it ends', () => {
    expect(mayEndTrace({ analytics: 'granted' }, false)).toBe(true);
    expect(mayEndTrace({ analytics: 'denied' }, true)).toBe(false);
    expect(mayEndTrace({ analytics: 'unset' }, false)).toBe(false);
  });
});
