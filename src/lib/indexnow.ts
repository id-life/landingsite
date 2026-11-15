import { absoluteUrl, SITE_URL } from '@/constants/site';

/**
 * IndexNow (Bing, Yandex, Seznam, Naver; shared through api.indexnow.org) and Baidu's link push (SEO-04).
 * The key is public by design: search engines verify it at https://www.id.life/<key>.txt (public/<key>.txt).
 * Pings are sent only from the publish webhook (src/app/api/revalidate/route.ts), never at build or per request.
 */
export const INDEXNOW_KEY = 'ab6643c5854d53f045ecab30cb563b8a';
export const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

export type PingResult = { service: 'indexnow' | 'baidu'; status: number | null; body: string };

/** Site paths from the CMS: root-relative, no scheme, no host, no protocol-relative trick, at most 200. */
export function cleanPaths(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const paths = input.filter((p): p is string => typeof p === 'string' && /^\/(?!\/)[^\s?#]*$/.test(p));
  return paths.filter((p, i) => paths.indexOf(p) === i).slice(0, 200);
}

async function send(service: PingResult['service'], url: string, init: RequestInit): Promise<PingResult> {
  try {
    const res = await fetch(url, { ...init, signal: AbortSignal.timeout(10_000) });
    return { service, status: res.status, body: (await res.text()).slice(0, 500) };
  } catch (error) {
    return { service, status: null, body: error instanceof Error ? error.message : String(error) };
  }
}

/** POST the URLs to IndexNow. A 200 or 202 means accepted. */
export function pingIndexNow(paths: string[]): Promise<PingResult> {
  const host = new URL(SITE_URL).host;
  return send('indexnow', INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host,
      key: INDEXNOW_KEY,
      keyLocation: absoluteUrl(`/${INDEXNOW_KEY}.txt`),
      urlList: paths.map(absoluteUrl),
    }),
  });
}

/**
 * POST the URLs to Baidu's push API. endpoint is the full URL Baidu's console shows for the verified property
 * (http://data.zz.baidu.com/urls?site=...&token=...), kept in the BAIDU_PUSH_ENDPOINT environment variable.
 */
export function pingBaidu(endpoint: string, paths: string[]): Promise<PingResult> {
  return send('baidu', endpoint, {
    method: 'POST',
    headers: { 'content-type': 'text/plain' },
    body: paths.map(absoluteUrl).join('\n'),
  });
}
