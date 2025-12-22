import { fetchInsights, fetchInsightsWithGeo } from '@/apis';
import { InsightsCategory, InsightsItem, InsightsWithGeoItem } from '@/apis/types';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export function useFetchInsights() {
  return useQuery({
    queryKey: ['fetch_insights'],
    queryFn: () => fetchInsights(),
    select: (res) => (res.code === 200 ? res.data : undefined),
  });
}

export function extractYouTubeVideoId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}

const filterByCategory = (data: InsightsItem[], categories: InsightsCategory[]) =>
  data.filter((item) => categories.includes(item.category)).sort((a, b) => a.sequence - b.sequence);

// Hook to get filtered and formatted insights data
export function useInsightsData() {
  const { data, isLoading, error } = useFetchInsights();

  const categorizedData = useMemo(() => {
    if (!data) return { news: [], talks: [], podcasts: [] };

    const news = filterByCategory(data, ['news', 'coverage']).map((item) => ({
      id: item.id,
      title: item.title,
      date: item.publishDate,
      tag: item.category === 'coverage' ? ('Coverage' as const) : ('News' as const),
      url: item.url,
      sequence: item.sequence,
    }));

    const talks = filterByCategory(data, ['talk', 'essay']).map((item) => ({
      id: item.id,
      title: item.title,
      description: '',
      videoId: item.url ? extractYouTubeVideoId(item.url) || '' : '',
      url: item.url || '#',
      date: item.publishDate,
      essayPic: item.essayPic,
      category: item.category,
      sequence: item.sequence,
    }));
    const podcasts = filterByCategory(data, ['podcast']).map((item, index) => ({
      id: item.id,
    }));

    return { news, talks, podcasts };
  }, [data]);

  return {
    ...categorizedData,
    isLoading,
    error,
    rawData: data,
  };
}

// New hooks for /insights/with-geo endpoint

export function useFetchInsightsWithGeo() {
  return useQuery({
    queryKey: ['fetch_insights_with_geo'],
    queryFn: () => fetchInsightsWithGeo(),
    select: (res) => (res.code === 200 ? res.data : undefined),
  });
}

// Type for transformed insight items used in NewsAndTalksSection
export type InsightItem = {
  id: number;
  title: string;
  url: string;
  imageUrl: string | null;
  publisher: string | null;
  publishDate: string | null;
  videoId: string | null;
  sequence: number;
  isTop: boolean;
};

// Hook to get formatted insights data for NewsAndTalksSection
export function useInsightsWithGeoData() {
  const { data, isLoading, error } = useFetchInsightsWithGeo();

  const insightItems = useMemo(() => {
    if (!data) return [];

    // Filter out geo items and transform
    const items: InsightItem[] = data
      .filter((item) => item.contentType !== 'geo')
      .map((item, index) => {
        // Construct URL for geo items with null URL (relative path for internal news pages)
        const url = item.url ?? (item.id ? `/news/${item.id}` : '#');
        const videoId = item.url ? extractYouTubeVideoId(item.url) : null;

        return {
          id: item.id ?? index + 1,
          title: item.title,
          url,
          imageUrl: item.imageUrl,
          publisher: item.publisher,
          publishDate: item.publishDate,
          videoId,
          sequence: item.sequence,
          isTop: item.isTop,
        };
      })
      // Sort: isTop first, then by sequence ascending
      .sort((a, b) => {
        if (a.isTop && !b.isTop) return -1;
        if (!a.isTop && b.isTop) return 1;
        return a.sequence - b.sequence;
      });

    return items;
  }, [data]);

  return {
    items: insightItems,
    isLoading,
    error,
  };
}
