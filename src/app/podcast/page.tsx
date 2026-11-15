import React from 'react';
import PodcastShowPage, { podcastShowMetadata } from '@/app/podcast/_components/PodcastShowPage';
import { PODCAST_NAV_LIST } from '@/app/podcast/_components/constant';

// Static, regenerated at most every 5 minutes. The page reads no searchParams, so it is cached at the edge:
// the Long Talk show moved from /podcast?c=lt to /podcast/long-talk (src/proxy.ts answers the old URL 308).
export const revalidate = 300; // 5min

export const metadata = podcastShowMetadata(PODCAST_NAV_LIST[0].id);

export default function PodcastPage() {
  return <PodcastShowPage category={PODCAST_NAV_LIST[0].id} />;
}
