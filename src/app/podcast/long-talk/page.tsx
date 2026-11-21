import React from 'react';
import PodcastShowPage, { podcastShowMetadata } from '@/app/podcast/_components/PodcastShowPage';
import { PODCAST_NAV_LIST } from '@/app/podcast/_components/constant';

// The Long Talk show (龙门阵). A static segment, so it wins over /podcast/[id] and is cached like /podcast.
export const revalidate = 300; // 5min

export const generateMetadata = () => podcastShowMetadata(PODCAST_NAV_LIST[1].id);

export default function LongTalkPage() {
  return <PodcastShowPage category={PODCAST_NAV_LIST[1].id} />;
}
