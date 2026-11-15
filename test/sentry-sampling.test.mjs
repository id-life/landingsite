// DATA-01: Sentry performance traces follow consent; error reports do not depend on it.
import { describe, expect, test } from 'vitest';
import { mayEndTrace, TRACE_SAMPLE_RATE, traceSampleRate } from '@/lib/sentry-sampling';

describe('trace sampling and consent', () => {
  test('granted: the usual 5 %', () => {
    expect(TRACE_SAMPLE_RATE).toBe(0.05);
    expect(traceSampleRate({ analytics: 'granted' }, false)).toBe(0.05);
  });

  test('no choice yet, Reject, or Global Privacy Control: no trace', () => {
    expect(traceSampleRate({ analytics: 'unset' }, false)).toBe(0);
    expect(traceSampleRate({ analytics: 'denied' }, true)).toBe(0);
    expect(traceSampleRate({ analytics: 'granted' }, true)).toBe(0);
  });

  test('a trace sampled under consent is dropped if consent is withdrawn before it ends', () => {
    expect(mayEndTrace({ analytics: 'granted' }, false)).toBe(true);
    expect(mayEndTrace({ analytics: 'denied' }, true)).toBe(false);
    expect(mayEndTrace({ analytics: 'unset' }, false)).toBe(false);
  });
});
