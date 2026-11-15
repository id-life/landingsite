import * as Sentry from '@sentry/nextjs';
import { PHASE_PRODUCTION_BUILD } from 'next/constants';
import { cache } from 'react';
import { fetchPodcastList } from '@/apis';
import type { PodcastItem } from '@/apis/types';
import type { PodcastCategory } from '@/app/podcast/_components/constant';

/**
 * Episodes of one show, newest first. Wrapped in React `cache` so the list and the
 * page's JSON-LD share a single request per render (the Axios client is not deduplicated).
 * The show pages are static and regenerate every 5 minutes (ISR). When the API cannot be reached while
 * building, this returns null, the list shows its error state and the error goes to Sentry; at runtime the
 * error is rethrown, because Next keeps serving the last good page only when a regeneration throws.
 */
export const getPodcastEpisodes = cache(async (category: PodcastCategory): Promise<PodcastItem[] | null> => {
  try {
    const res = await fetchPodcastList(`podcast_${category}`);
    if (res.code !== 200 || !Array.isArray(res.data)) return [];
    return [...res.data].sort((a, b) => b.sequence - a.sequence);
  } catch (error) {
    if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) throw error;
    Sentry.captureException(error);
    return null;
  }
});
