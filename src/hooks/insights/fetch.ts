import { fetchInsights } from '@/apis';
import { InsightsCategory, InsightsItem } from '@/apis/types';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export function useFetchInsights() {
  return useQuery({
    queryKey: ['fetch_insights'],
    queryFn: () => fetchInsights(),
    select: (res) => (res.code === 200 ? res.data : undefined),
  });
}

function extractYouTubeVideoId(url: string): string | null {
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
