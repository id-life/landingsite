'use client';

import { ReactNode } from 'react';
import { PodcastItem } from '@/apis/types';
import { track } from '@/lib/analytics/track';

/** The episode row's click event (episode_item_click), the only script a row of the server-rendered list needs. */
export default function EpisodeClickTracker({
  episodeId,
  channel,
  children,
}: {
  episodeId: string;
  channel: PodcastItem['category'];
  children: ReactNode;
}) {
  return (
    <div
      onClick={() => track('episode_item_click', { episode_id: episodeId, channel })}
      className="group flex cursor-pointer gap-4"
    >
      {children}
    </div>
  );
}
