import type { InsightsWithGeoItem, NewsPageItem } from '@/apis/types';

function extractYouTubeVideoId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}

export function transformToNewsPageItems(items: InsightsWithGeoItem[]): NewsPageItem[] {
  // Sort: isTop first, then by sequence ascending
  const sortedItems = [...items].sort((a, b) => {
    if (a.isTop && !b.isTop) return -1;
    if (!a.isTop && b.isTop) return 1;
    return a.sequence - b.sequence;
  });

  return sortedItems.map((item) => {
    const videoId = item.url ? extractYouTubeVideoId(item.url) : null;

    return {
      id: item.id ?? 0,
      title: item.title,
      brief: null,
      cover: item.imageUrl,
      source: item.publisher,
      publishDate: item.publishDate,
      url: item.url,
      videoId,
      isExternal: !!(item.url && !item.url.startsWith('/')),
    };
  });
}
