// DATA-05: the commands that start the GA4 stream. config carries nothing page-specific (it sticks to every later
// hit), the landing page_view carries the landing URL, title and referrer, and a section change made before the tag's
// history listener existed is counted once when gtag/js has loaded.
import { beforeEach, describe, expect, test, vi } from 'vitest';

const LANDING = { href: 'https://example.invalid/?utm_source=t', referrer: 'https://ref.invalid/', title: 'Landing' };

beforeEach(() => {
  vi.resetModules();
  vi.useRealTimers();
  globalThis.window = {
    gtag: vi.fn(),
    location: { pathname: '/', href: 'https://example.invalid/' },
    dataLayer: [],
    setTimeout: (...a) => setTimeout(...a),
  };
  globalThis.document = { title: 'Landing' };
});

const load = () => import('@/lib/analytics/stream');
const views = () => import('@/lib/analytics/section-view');
const go = (path) => {
  window.location = { pathname: path, href: `https://example.invalid${path}` };
};
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

  test('section views made before the tag loaded are sent once each, in order, when it has loaded', async () => {
    const { noteSectionView } = await views();
    const { startStream } = await load();
    const onTagLoaded = startStream(LANDING, { internal: false, debug: false, gaId: 'G-TEST' });
    go('/portfolio');
    noteSectionView('Portfolio');
    go('/insights');
    noteSectionView('Insights');
    onTagLoaded();
    expect(pageViews().slice(1)).toEqual([
      { page_location: 'https://example.invalid/portfolio', page_title: 'Portfolio' },
      { page_location: 'https://example.invalid/insights', page_title: 'Insights' },
    ]);
  });

  test('after the tag loaded, a view its history listener recorded is left to it', async () => {
    vi.useFakeTimers();
    window.setTimeout = (...a) => setTimeout(...a);
    const { noteSectionView } = await views();
    const { startStream, VIEW_CHECK_MS } = await load();
    const onTagLoaded = startStream(LANDING, { internal: false, debug: false, gaId: 'G-TEST' });
    onTagLoaded();
    vi.advanceTimersByTime(10);
    go('/spectrum');
    noteSectionView('Spectrum');
    window.dataLayer.push({ event: 'gtm.historyChange-v2', 'gtm.newUrl': 'https://example.invalid/spectrum' });
    vi.advanceTimersByTime(VIEW_CHECK_MS + 10);
    expect(pageViews()).toHaveLength(1);
  });

  test('after the tag loaded, a view its listener never saw (two quick changes) is sent once by hand', async () => {
    vi.useFakeTimers();
    window.setTimeout = (...a) => setTimeout(...a);
    const { noteSectionView } = await views();
    const { startStream, VIEW_CHECK_MS } = await load();
    const onTagLoaded = startStream(LANDING, { internal: false, debug: false, gaId: 'G-TEST' });
    onTagLoaded();
    vi.advanceTimersByTime(10);
    go('/insights');
    noteSectionView('Insights');
    go('/spectrum');
    noteSectionView('Spectrum');
    // The listener saw only the second change.
    window.dataLayer.push({ event: 'gtm.historyChange-v2', 'gtm.newUrl': 'https://example.invalid/spectrum' });
    vi.advanceTimersByTime(VIEW_CHECK_MS + 10);
    expect(pageViews().slice(1)).toEqual([{ page_location: 'https://example.invalid/insights', page_title: 'Insights' }]);
  });
});
