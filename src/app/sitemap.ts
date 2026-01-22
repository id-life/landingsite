import type { MetadataRoute } from 'next';
import { fetchNewsList, fetchPodcastList } from '@/apis';

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
        url: `https://www.id.life/news/${item.id}`,
        lastModified: new Date(item.updatedAt || item.createdAt),
        changeFrequency: 'monthly' as const,
        priority: 0.4,
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

    const [idRes, ltRes] = await Promise.all([
      withTimeout(fetchPodcastList('podcast_id'), 5000),
      withTimeout(fetchPodcastList('podcast_lt'), 5000),
    ]);

    const entries: MetadataRoute.Sitemap = [];

    if (idRes.code === 200 && Array.isArray(idRes.data)) {
      idRes.data.forEach((item) => {
        entries.push({
          url: `https://www.id.life/podcast/${item.id}`,
          lastModified: new Date(item.createdAt),
          changeFrequency: 'monthly' as const,
          priority: 0.4,
        });
      });
    }

    if (ltRes.code === 200 && Array.isArray(ltRes.data)) {
      ltRes.data.forEach((item) => {
        entries.push({
          url: `https://www.id.life/podcast/${item.id}`,
          lastModified: new Date(item.createdAt),
          changeFrequency: 'monthly' as const,
          priority: 0.4,
        });
      });
    }

    return entries;
  } catch (error) {
    console.warn('Sitemap: Failed to fetch podcast entries:', error instanceof Error ? error.message : 'Unknown error');
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: 'https://www.id.life/',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://www.id.life/presence',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://www.id.life/insights',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://www.id.life/portfolio',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://www.id.life/spectrum',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://www.id.life/spectrum/disease-management',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://www.id.life/spectrum/influence-network',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://www.id.life/digitaltwin',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://www.id.life/connect',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://www.id.life/podcast',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://www.id.life/podcast?c=lt',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: 'https://www.id.life/news',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: 'https://www.id.life/about',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  const [newsEntries, podcastEntries] = await Promise.all([getNewsEntries(), getPodcastEntries()]);

  return [...staticRoutes, ...podcastEntries, ...newsEntries];
}
