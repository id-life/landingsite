// DATA-05: the commands that start the GA4 stream. config carries nothing page-specific (it sticks to every later
// hit), the landing page_view carries the landing URL, title and referrer, and a section change made before the tag's
// history listener existed is counted once when gtag/js has loaded.
import { beforeEach, describe, expect, test, vi } from 'vitest';

const LANDING = { href: 'https://example.invalid/?utm_source=t', referrer: 'https://ref.invalid/', title: 'Landing' };

beforeEach(() => {
  vi.resetModules();
  globalThis.window = { gtag: vi.fn(), location: { pathname: '/', href: 'https://example.invalid/' } };
  globalThis.document = { title: 'Landing' };
});

const load = () => import('@/lib/analytics/stream');
const calls = () => window.gtag.mock.calls;
const pageViews = () =>
  calls()
    .filter(([cmd, name]) => cmd === 'event' && name === 'page_view')
    .map((c) => c[2]);

describe('startStream()', () => {
  test('config holds no page_location, page_title or page_referrer and sends no page_view itself', async () => {
    const { startStream } = await load();
    startStream(LANDING, { layout: 'mobile', internal: false, debug: false, gaId: 'G-TEST' });
    const config = calls().find(([cmd]) => cmd === 'config');
    expect(config[1]).toBe('G-TEST');
    expect(config[2]).toEqual({ send_page_view: false });
  });

  test('the landing page_view names the landing URL, title and referrer', async () => {
    const { startStream } = await load();
    startStream(LANDING, { internal: true, debug: false, gaId: 'G-TEST' });
    expect(pageViews()).toEqual([
      { page_location: LANDING.href, page_title: 'Landing', page_referrer: LANDING.referrer, traffic_type: 'internal' },
    ]);
  });

  test('no second page_view when the visitor is still on the landing section when the tag loads', async () => {
    const { startStream } = await load();
    const onTagLoaded = startStream(LANDING, { internal: false, debug: false, gaId: 'G-TEST' });
    window.location.href = 'https://example.invalid/';
    onTagLoaded();
    expect(pageViews()).toHaveLength(1);
  });

  test('a section change before the tag loaded is counted once, with its own URL and title', async () => {
    const { startStream } = await load();
    const onTagLoaded = startStream(LANDING, { internal: false, debug: false, gaId: 'G-TEST' });
    window.location = { pathname: '/portfolio', href: 'https://example.invalid/portfolio' };
    document.title = 'Portfolio';
    onTagLoaded();
    expect(pageViews().slice(1)).toEqual([{ page_location: 'https://example.invalid/portfolio', page_title: 'Portfolio' }]);
  });
});
