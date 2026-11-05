import type { MetadataRoute } from 'next';
import { fetchNewsList, fetchPodcastList } from '@/apis';
import { absoluteUrl } from '@/constants/site';

// Static pages carry no `lastModified`: a build-time `new Date()` would claim every page
// changed on every deploy, which teaches Google to ignore the sitemap's dates entirely.
// `changeFrequency` / `priority` are omitted because Google ignores them.
const STATIC_PATHS = [
  '/',
  '/portfolio',
  '/spectrum',
  '/spectrum/disease-management',
  '/spectrum/influence-network',
  '/digitaltwin',
  '/presence',
  '/insights',
  '/connect',
  '/podcast',
  '/podcast?c=lt',
  '/news',
  '/news/immortal-dragons-news-and-updates',
  '/news/immortal-dragons-milestones-and-portfolio',
];

// Timeout wrapper for API calls during build
function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 5000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Request timeout')), timeoutMs)),
  ]);
}

async function getNewsEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    // Skip if API URL is not configured
    if (!process.env.NEXT_PUBLIC_API_PREFIX) {
      console.warn('Sitemap: NEXT_PUBLIC_API_PREFIX not configured, skipping news entries');
      return [];
    }

    const res = await withTimeout(fetchNewsList(), 5000);
    if (res.code === 200 && Array.isArray(res.data)) {
      return res.data.map((item) => ({
        url: absoluteUrl(`/news/${item.id}`),
        lastModified: new Date(item.updatedAt || item.createdAt),
      }));
    }
    return [];
  } catch (error) {
    console.warn('Sitemap: Failed to fetch news entries:', error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

async function getPodcastEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    // Skip if API URL is not configured
    if (!process.env.NEXT_PUBLIC_API_PREFIX) {
      console.warn('Sitemap: NEXT_PUBLIC_API_PREFIX not configured, skipping podcast entries');
      return [];
    }

    const results = await Promise.all([
      withTimeout(fetchPodcastList('podcast_id'), 5000),
      withTimeout(fetchPodcastList('podcast_lt'), 5000),
    ]);

    return results.flatMap((res) =>
      res.code === 200 && Array.isArray(res.data)
        ? res.data.map((item) => ({
            url: absoluteUrl(`/podcast/${item.id}`),
            lastModified: new Date(item.createdAt),
          }))
        : [],
    );
  } catch (error) {
    console.warn('Sitemap: Failed to fetch podcast entries:', error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({ url: absoluteUrl(path) }));
  const [newsEntries, podcastEntries] = await Promise.all([getNewsEntries(), getPodcastEntries()]);

  return [...staticEntries, ...podcastEntries, ...newsEntries];
}
