import * as Sentry from '@sentry/nextjs';
import type { MetadataRoute } from 'next';
import { PHASE_PRODUCTION_BUILD } from 'next/constants';
import { fetchInsightsWithGeo, fetchNewsList, fetchPodcastList } from '@/apis';
import type { InsightsWithGeoItem, NewsListItem, PodcastItem } from '@/apis/types';
import { PODCAST_NAV_LIST } from '@/app/podcast/_components/constant';
import { absoluteUrl } from '@/constants/site';

// Regenerated at most once an hour (ISR), so an episode or article published between deploys is listed
// within the hour. Without this export Next built sitemap.xml once per deploy.
export const revalidate = 3600;

// Only canonical, query-free URLs. `lastModified` is set only where the site has a real date: a hub page
// takes its newest item's date, an article or episode its own. Pages whose copy lives in the code carry none:
// a build-time `new Date()` would claim every page changed on every deploy, which teaches Google to ignore
// the sitemap's dates. `changeFrequency` / `priority` are omitted because Google ignores them.
const STATIC_PATHS = [
  '/',
  '/about',
  '/portfolio',
  '/spectrum',
  '/spectrum/disease-management',
  '/spectrum/influence-network',
  '/digitaltwin',
  '/presence',
  '/connect',
  '/news/immortal-dragons-news-and-updates',
  '/news/immortal-dragons-milestones-and-portfolio',
];

// Timeout wrapper for API calls
function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 5000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Request timeout')), timeoutMs)),
  ]);
}

/** The newest valid date among the values, or undefined. */
function newest(dates: (string | null | undefined)[]): Date | undefined {
  const times = dates.map((d) => (d ? Date.parse(d) : NaN)).filter((t) => Number.isFinite(t));
  return times.length ? new Date(Math.max(...times)) : undefined;
}

const entry = (path: string, lastModified?: Date): MetadataRoute.Sitemap[number] =>
  lastModified ? { url: absoluteUrl(path), lastModified } : { url: absoluteUrl(path) };

/**
 * One API section, or null when it could not be fetched. While building, a failure is reported and the
 * section is left out, so `next build` never fails on the API. At runtime the error is rethrown: Next then
 * keeps serving the last good sitemap instead of replacing it with one that lost every dynamic URL.
 */
async function load<T>(name: string, fetcher: () => Promise<{ code: number; data: T[] }>): Promise<T[] | null> {
  try {
    const res = await withTimeout(fetcher(), 5000);
    if (res.code === 200 && Array.isArray(res.data)) return res.data;
    throw new Error(`sitemap: ${name} answered code ${res.code}`);
  } catch (error) {
    if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) throw error;
    Sentry.captureException(error);
    return null;
  }
}

/** An empty section is not an error the request can see, so it is reported (Sentry runs on Vercel only). */
function reportEmpty(name: string, items: unknown[] | null) {
  if (items && items.length === 0) Sentry.captureMessage(`sitemap: the ${name} section is empty`, 'warning');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, insights, mainShow, longTalk] = await Promise.all([
    load<NewsListItem>('news', fetchNewsList),
    load<InsightsWithGeoItem>('insights', fetchInsightsWithGeo),
    load<PodcastItem>('podcast_id', () => fetchPodcastList(`podcast_${PODCAST_NAV_LIST[0].id}`)),
    load<PodcastItem>('podcast_lt', () => fetchPodcastList(`podcast_${PODCAST_NAV_LIST[1].id}`)),
  ]);
  reportEmpty('news', news);
  reportEmpty('insights', insights);
  reportEmpty('podcast', mainShow);
  reportEmpty('long talk', longTalk);

  // /news lists the insights items that are not GEO articles (src/app/news/page.tsx); /insights shows them all.
  const newsHubItems = (insights ?? []).filter((item) => item.contentType !== 'geo');
  const episodeDate = (item: PodcastItem) => item.createdAt;

  return [
    ...STATIC_PATHS.map((path) => entry(path)),
    entry('/insights', newest((insights ?? []).map((item) => item.publishDate))),
    entry('/news', newest(newsHubItems.map((item) => item.publishDate))),
    entry(PODCAST_NAV_LIST[0].link, newest((mainShow ?? []).map(episodeDate))),
    entry(PODCAST_NAV_LIST[1].link, newest((longTalk ?? []).map(episodeDate))),
    ...[...(mainShow ?? []), ...(longTalk ?? [])].map((item) => entry(`/podcast/${item.id}`, newest([episodeDate(item)]))),
    ...(news ?? []).map((item) => entry(`/news/${item.id}`, newest([item.updatedAt, item.createdAt]))),
  ];
}
