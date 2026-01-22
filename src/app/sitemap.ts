import type { MetadataRoute } from 'next';
import { fetchNewsList, fetchPodcastList } from '@/apis';

async function getNewsEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const res = await fetchNewsList();
    if (res.code === 200 && Array.isArray(res.data)) {
      return res.data.map((item) => ({
        url: `https://www.id.life/news/${item.id}`,
        lastModified: new Date(item.updatedAt || item.createdAt),
        changeFrequency: 'monthly' as const,
        priority: 0.4,
      }));
    }
    return [];
  } catch {
    return [];
  }
}

async function getPodcastEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const [idRes, ltRes] = await Promise.all([fetchPodcastList('podcast_id'), fetchPodcastList('podcast_lt')]);

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
  } catch {
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
