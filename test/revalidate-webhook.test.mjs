// SEO-04: the CMS publish webhook regenerates the changed pages and pings IndexNow (and Baidu when configured).
// fetch is mocked: no test ever reaches api.indexnow.org or Baidu.
import { existsSync, readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { NextRequest } from 'next/server';

const revalidatePath = vi.hoisted(() => vi.fn());
vi.mock('next/cache', () => ({ revalidatePath }));

const { POST } = await import('@/app/api/revalidate/route');
const { INDEXNOW_KEY, cleanPaths } = await import('@/lib/indexnow');

const call = (body, auth = 'Bearer s3cret') =>
  POST(
    new NextRequest('https://www.id.life/api/revalidate', {
      method: 'POST',
      headers: auth ? { authorization: auth } : {},
      body: JSON.stringify(body),
    }),
  );

let fetchMock;
beforeEach(() => {
  process.env.REVALIDATE_SECRET = 's3cret';
  delete process.env.BAIDU_PUSH_ENDPOINT;
  fetchMock = vi.fn(async () => new Response('', { status: 202 }));
  vi.stubGlobal('fetch', fetchMock);
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  revalidatePath.mockReset();
});

describe('IndexNow key', () => {
  test('public/<key>.txt holds the key', () => {
    expect(INDEXNOW_KEY).toMatch(/^[a-f0-9]{32}$/);
    const file = `public/${INDEXNOW_KEY}.txt`;
    expect(existsSync(file)).toBe(true);
    expect(readFileSync(file, 'utf8').trim()).toBe(INDEXNOW_KEY);
  });
});

describe('POST /api/revalidate', () => {
  test('does not exist without REVALIDATE_SECRET', async () => {
    delete process.env.REVALIDATE_SECRET;
    expect((await call({ paths: ['/podcast/57'] })).status).toBe(404);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('refuses a missing or wrong secret, and pings nothing', async () => {
    expect((await call({ paths: ['/podcast/57'] }, null)).status).toBe(401);
    expect((await call({ paths: ['/podcast/57'] }, 'Bearer nope')).status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });

  test('regenerates the pages, the sitemap and llms.txt, then pings IndexNow', async () => {
    const res = await call({ paths: ['/podcast/57', '/podcast'] });
    expect(res.status).toBe(200);
    expect(revalidatePath.mock.calls.map((c) => c[0])).toEqual(['/podcast/57', '/podcast', '/sitemap.xml', '/llms.txt']);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.indexnow.org/indexnow');
    expect(JSON.parse(init.body)).toEqual({
      host: 'www.id.life',
      key: INDEXNOW_KEY,
      keyLocation: `https://www.id.life/${INDEXNOW_KEY}.txt`,
      urlList: ['https://www.id.life/podcast/57', 'https://www.id.life/podcast'],
    });
    expect((await res.json()).pings).toEqual([{ service: 'indexnow', status: 202, body: '' }]);
  });

  test('also pushes to Baidu when its endpoint is configured', async () => {
    process.env.BAIDU_PUSH_ENDPOINT = 'http://data.zz.baidu.com/urls?site=https://www.id.life&token=t';
    await call({ paths: ['/news/7'] });
    const baidu = fetchMock.mock.calls.find(([u]) => String(u).startsWith('http://data.zz.baidu.com'));
    expect(baidu[1].body).toBe('https://www.id.life/news/7');
  });

  test('rejects bodies without valid site paths', async () => {
    expect((await call({ paths: ['https://evil.example/x', '//evil.example', 'podcast'] })).status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(cleanPaths(['/a', '/a', '/b?x=1', '/c'])).toEqual(['/a', '/c']);
  });
});
