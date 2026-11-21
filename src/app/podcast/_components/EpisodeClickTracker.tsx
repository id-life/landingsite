'use client';

import Link from 'next/link';
import { ReactNode } from 'react';
import { PodcastItem } from '@/apis/types';
import { track } from '@/lib/analytics/track';

/**
 * The episode row's link and its click event (episode_item_click), the only script a row of the server-rendered list
 * needs. The event is on the link itself, so it is sent for a press by mouse, touch or keyboard alike (it was on a div
 * inside the link, which a keyboard activation of the link never reached). A new tab, as on the owner's site (his
 * answer of 2026-11-18, "open new tab"); his links lacked noopener.
 */
export default function EpisodeClickTracker({
  episodeId,
  channel,
  href,
  children,
}: {
  episodeId: string;
  channel: PodcastItem['category'];
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      className="overflow-hidden"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('episode_item_click', { episode_id: episodeId, channel })}
    >
      {children}
    </Link>
  );
}
