import type { InsightsWithGeoItem } from '@/apis/types';

/** The YouTube video id in a watch or short link, or null. */
export function extractYouTubeVideoId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}

/** Cards on one page of the NEWS & TALKS row on the laptop version (a 4 x 2 grid). */
export const NEWS_ROW_PAGE_LAPTOP = 8;

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

/**
 * The NEWS & TALKS row's cards from /insights/with-geo, in the row's order: no geo items, pinned first, then by
 * sequence. Pure, so the row (useInsightsWithGeoData) and the route's text without JavaScript (RouteNoScript) read
 * the same list.
 */
export function toInsightItems(data: InsightsWithGeoItem[]): InsightItem[] {
  return (
    data
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
      })
  );
}
