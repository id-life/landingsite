// The owner's decision of 2026-11-20 (question 26, B: "B for now. I can do the compliance later."): every visitor is
// counted without asking, as on his site, whatever the region. The region must not change what loads.
import { afterEach, describe, expect, test, vi } from 'vitest';
import { analyticsHeadScript } from '@/lib/analytics/head-script';

function runHead(region, opts) {
  const listeners = {};
  const fetches = [];
  const w = {
    location: { pathname: '/', href: 'https://example.invalid/' },
    addEventListener: (type, fn) => (listeners[type] = fn),
    sessionStorage: { getItem: () => region, setItem: () => {} },
    fetch: (url) => (fetches.push(url), new Promise(() => {})),
  };
  const d = { referrer: '', title: 'T', cookie: '', visibilityState: 'visible', addEventListener: () => {} };
  const n = { userAgent: 'Mozilla/5.0', webdriver: false, sendBeacon: vi.fn(() => true) };
  const body = analyticsHeadScript(opts).replace('var w=window,d=document,n=navigator;', '');
  new Function('w', 'd', 'n', 'location', 'performance', 'sessionStorage', 'Blob', body)(
    w, d, n, w.location, { now: () => 1 }, w.sessionStorage,
    class { constructor(p) { this.p = p; } },
  ); // prettier-ignore
  listeners.pagehide?.();
  const consentDefault = w.dataLayer.find((args) => args[0] === 'consent' && args[1] === 'default')[2];
  return { consentDefault, beacons: n.sendBeacon.mock.calls.length, fetches };
}

describe('every visitor is counted, whatever the region (question 26, B)', () => {
  afterEach(() => {
    vi.resetModules();
    vi.doUnmock('@/constants/env');
  });

  test('the switch names his decision and is on', async () => {
    const { COUNT_EVERY_VISITOR } = await import('@/lib/analytics/config');
    expect(COUNT_EVERY_VISITOR).toBe(true);
  });

  test('the head script grants analytics storage alike for an EU, a US and an unknown visitor, with no region lookup', () => {
    const results = ['DE', 'US', null].map((region) => runHead(region));
    for (const r of results) {
      expect(r.consentDefault.analytics_storage).toBe('granted');
      expect(r.consentDefault.ad_storage).toBe('denied');
      expect(r.beacons).toBe(1);
      expect(r.fetches).toEqual([]);
    }
  });

  test('with the regional consent switched back on, an EU visitor waits and a US visitor does not (kept, out of the path)', () => {
    expect(runHead('DE', { everyone: false }).consentDefault.analytics_storage).toBe('denied');
    expect(runHead('DE', { everyone: false }).beacons).toBe(0);
    expect(runHead('US', { everyone: false }).beacons).toBe(1);
  });

  for (const country of ['DE', 'US', '']) {
    test(`consent resolves to granted without asking for a visitor from "${country || 'unknown'}"`, async () => {
      vi.doMock('@/constants/env', () => ({ ANALYTICS_ENABLED: true, DEPLOY_ENV: 'production' }));
      const fetch = vi.fn(async () => ({ ok: true, json: async () => ({ country }) }));
      vi.stubGlobal('window', { location: { pathname: '/' }, __idl: { region: country }, fetch });
      vi.stubGlobal('navigator', { userAgent: 'Mozilla/5.0', webdriver: false, globalPrivacyControl: false });
      vi.stubGlobal('document', { cookie: '' });
      vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {} });
      const { startConsent, getConsentState } = await import('@/lib/analytics/consent');
      await startConsent();
      expect(getConsentState()).toMatchObject({ analytics: 'granted', reason: 'everyone', bannerOpen: false });
      expect(fetch).not.toHaveBeenCalled();
      vi.unstubAllGlobals();
    });
  }
});
