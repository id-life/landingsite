import * as Sentry from '@sentry/nextjs';
import { cache } from 'react';
import { fetchPodcastList } from '@/apis';
import type { PodcastItem } from '@/apis/types';
import type { PodcastCategory } from '@/app/podcast/_components/constant';

/**
 * Episodes of one show, newest first. Wrapped in React `cache` so the list and the
 * page's JSON-LD share a single request per render (the Axios client is not deduplicated).
 * null when the API could not be reached: /podcast renders per request, so there is no earlier page to fall
 * back on and the list shows an error state instead of looking empty. The error goes to Sentry.
 */
export const getPodcastEpisodes = cache(async (category: PodcastCategory): Promise<PodcastItem[] | null> => {
  try {
    const res = await fetchPodcastList(`podcast_${category}`);
    if (res.code !== 200 || !Array.isArray(res.data)) return [];
    return [...res.data].sort((a, b) => b.sequence - a.sequence);
  } catch (error) {
    Sentry.captureException(error);
    return null;
  }
});
