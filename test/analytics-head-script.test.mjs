// DATA-01, DATA-15: the inline head script parses, and it marks the unmeasured draft review page (CON-10) so the
// load_abandon beacon stays off there, like automated browsers and Global Privacy Control.
import { describe, expect, test, vi } from 'vitest';
import { analyticsHeadScript } from '@/lib/analytics/head-script';

function run(pathname) {
  const listeners = {};
  const w = {
    location: { pathname, href: `https://example.invalid${pathname}` },
    addEventListener: (type, fn) => (listeners[type] = fn),
    sessionStorage: { getItem: () => 'SG', setItem: () => {} },
  };
  const d = { referrer: '', title: 'T', cookie: '', visibilityState: 'visible', addEventListener: () => {} };
  const n = { userAgent: 'Mozilla/5.0', webdriver: false, sendBeacon: vi.fn(() => true) };
  const body = analyticsHeadScript().replace('var w=window,d=document,n=navigator;', '');

  new Function('w', 'd', 'n', 'location', 'performance', 'sessionStorage', 'Blob', body)(
    w,
    d,
    n,
    w.location,
    { now: () => 1 },
    w.sessionStorage,
    class {
      constructor(p) {
        this.p = p;
      }
    },
  );
  listeners.pagehide?.();
  return { idl: w.__idl, beacons: n.sendBeacon.mock.calls.length };
}

describe('analytics head script', () => {
  test('a page left before the experience is ready sends one load_abandon beacon (opt-out region)', () => {
    expect(run('/').beacons).toBe(1);
  });
  test('/content-review is marked off and sends nothing', () => {
    const r = run('/content-review');
    expect(r.idl.off).toBe(true);
    expect(r.beacons).toBe(0);
  });
});
