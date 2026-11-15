// SEO-09: the Long Talk show has a path of its own, the old query URL answers 308, and the sitemap lists only
// canonical query-free URLs with dates that come from the content (never the build time).
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { NextRequest } from 'next/server';

const apis = vi.hoisted(() => ({
  fetchNewsList: vi.fn(),
  fetchInsightsWithGeo: vi.fn(),
  fetchPodcastList: vi.fn(),
}));
vi.mock('@/apis', () => apis);
vi.mock('@sentry/nextjs', () => ({ captureException: vi.fn(), captureMessage: vi.fn() }));

const { proxy, config } = await import('@/proxy');
const { default: sitemap, revalidate } = await import('@/app/sitemap');

const ok = (data) => Promise.resolve({ code: 200, data });

describe('/podcast?c=lt', () => {
  test('answers 308 to /podcast/long-talk without the c parameter', () => {
    const res = proxy(new NextRequest('https://www.id.life/podcast?c=lt'));
    expect(res.status).toBe(308);
    expect(res.headers.get('location')).toBe('https://www.id.life/podcast/long-talk');
  });

  test('keeps any other parameter', () => {
    const res = proxy(new NextRequest('https://www.id.life/podcast?utm_source=x&c=lt'));
    expect(res.headers.get('location')).toBe('https://www.id.life/podcast/long-talk?utm_source=x');
  });

  test('runs only for that URL, so /podcast stays a static page', () => {
    expect(config.matcher).toEqual([{ source: '/podcast', has: [{ type: 'query', key: 'c', value: 'lt' }] }]);
    expect(proxy(new NextRequest('https://www.id.life/podcast')).headers.get('location')).toBeNull();
  });
});

describe('sitemap.xml', () => {
  beforeEach(() => {
    apis.fetchNewsList.mockImplementation(() =>
      ok([{ id: 7, createdAt: '2026-01-02T00:00:00Z', updatedAt: '2026-03-04T00:00:00Z' }]),
    );
    apis.fetchInsightsWithGeo.mockImplementation(() =>
      ok([
        { contentType: 'insights', publishDate: '2026-05-01' },
        { contentType: 'insights', publishDate: '2026-06-09' },
        { contentType: 'geo', publishDate: '2026-07-20' },
      ]),
    );
    apis.fetchPodcastList.mockImplementation((category) =>
      ok(
        category === 'podcast_lt'
          ? [{ id: 30, createdAt: '2026-08-01T00:00:00Z' }]
          : [
              { id: 56, createdAt: '2026-10-01T00:00:00Z' },
              { id: 55, createdAt: '2026-09-01T00:00:00Z' },
            ],
      ),
    );
  });
  afterEach(() => vi.clearAllMocks());

  const byPath = (entries) => Object.fromEntries(entries.map((e) => [new URL(e.url).pathname, e]));

  test('regenerates every hour', () => {
    expect(revalidate).toBe(3600);
  });

  test('lists only canonical URLs without a query string', async () => {
    const entries = await sitemap();
    expect(entries.filter((e) => e.url.includes('?'))).toEqual([]);
    expect(byPath(entries)['/podcast/long-talk']).toBeDefined();
  });

  test('hub pages carry their newest item date; static pages carry none', async () => {
    const e = byPath(await sitemap());
    expect(e['/podcast'].lastModified).toEqual(new Date('2026-10-01T00:00:00Z'));
    expect(e['/podcast/long-talk'].lastModified).toEqual(new Date('2026-08-01T00:00:00Z'));
    expect(e['/news'].lastModified).toEqual(new Date('2026-06-09'));
    expect(e['/insights'].lastModified).toEqual(new Date('2026-07-20'));
    expect(e['/news/7'].lastModified).toEqual(new Date('2026-03-04T00:00:00Z'));
    expect(e['/podcast/56'].lastModified).toEqual(new Date('2026-10-01T00:00:00Z'));
    expect(e['/'].lastModified).toBeUndefined();
    expect(e['/portfolio'].lastModified).toBeUndefined();
  });

  test('an API failure at runtime throws, so Next keeps the last good sitemap', async () => {
    apis.fetchPodcastList.mockImplementation(() => Promise.reject(new Error('API down')));
    await expect(sitemap()).rejects.toThrow('API down');
  });
});
