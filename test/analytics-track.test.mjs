// DATA-11: track() queues while consent and the tag are pending, sends once configured, de-duplicates once-keys and
// drops everything after a refusal. Runs against a minimal window/gtag stand-in.
import { beforeEach, describe, expect, test, vi } from 'vitest';

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv('NEXT_PUBLIC_ANALYTICS_ENABLED', '1');
  const gtag = vi.fn();
  globalThis.window = { gtag, location: { pathname: '/portfolio', href: 'https://example.invalid/portfolio' } };
  globalThis.localStorage = { getItem: () => null };
});

const load = () => import('@/lib/analytics/track');

describe('track()', () => {
  test('queues until the tag is on, then sends with the shared context', async () => {
    const { track, setTrackMode, setTrackLayout } = await load();
    setTrackLayout('desktop');
    track('contact_intent', { method: 'mailto', placement: 'footer' });
    expect(window.gtag).not.toHaveBeenCalled();
    setTrackMode('on');
    expect(window.gtag).toHaveBeenCalledTimes(1);
    const [cmd, name, params] = window.gtag.mock.calls[0];
    expect([cmd, name]).toEqual(['event', 'contact_intent']);
    expect(params).toMatchObject({ method: 'mailto', placement: 'footer', layout: 'desktop', section_id: 'portfolio_page' });
    expect(typeof params.page_load_id).toBe('string');
  });

  test('a once-key is sent once per document', async () => {
    const { track, setTrackMode } = await load();
    setTrackMode('on');
    for (let i = 0; i < 3; i += 1) track('relation_submit', undefined, { once: 'x' });
    expect(window.gtag).toHaveBeenCalledTimes(1);
  });

  test('after a refusal nothing is queued or sent', async () => {
    const { track, setTrackMode } = await load();
    track('relation_submit');
    setTrackMode('off');
    track('relation_submit');
    setTrackMode('on');
    expect(window.gtag).not.toHaveBeenCalled();
  });

  test('an event that belongs to another path (a vital of the landing URL) carries that section', async () => {
    const { track, setTrackMode } = await load();
    setTrackMode('on');
    track('relation_submit', undefined, { at: '/spectrum/' });
    track('relation_submit', undefined, { at: '/news' });
    expect(window.gtag.mock.calls[0][2]).toMatchObject({ section_id: 'spectrum_page' });
    expect(window.gtag.mock.calls[1][2]).not.toHaveProperty('section_id');
  });

  test('internal traffic is tagged', async () => {
    globalThis.localStorage = { getItem: (k) => (k === 'idl_internal' ? '1' : null) };
    const { track, setTrackMode } = await load();
    setTrackMode('on');
    track('relation_submit');
    expect(window.gtag.mock.calls[0][2]).toMatchObject({ traffic_type: 'internal' });
  });
});
