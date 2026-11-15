'use client';

import { PodcastItem } from '@/apis/types';
import { clsx } from 'clsx';
import OutboundLink from '@/lib/analytics/outbound';
import { safeHref } from '@/utils/safe-href';

type PodcastLinkProps = {
  data: PodcastItem;
};

export default function PodcastLinks({ data }: PodcastLinkProps) {
  // Episode page views are counted by GA4's own page_view; the platform icons are real links (DATA-03).
  const platforms = [
    { id: 'xiaoyuzhou', name: 'Xiaoyuzhou', link: data.xyzLink, icon: '/imgs/podcast/fm_xyz.png' },
    { id: 'spotify', name: 'Spotify', link: data.spotifyLink, icon: '/imgs/podcast/fm_spotify.png' },
    { id: 'apple_podcasts', name: 'Apple Podcasts', link: data.podcastLink, icon: '/imgs/podcast/fm_podcast.png' },
  ];

  return (
    <div className="flex-center gap-2">
      {platforms.map(({ id, name, link, icon }) => {
        const url = safeHref(link);
        const img = (
          <img
            className={clsx('w-7.5 mobile:w-6', url ? 'cursor-pointer' : 'cursor-not-allowed grayscale')}
            src={icon}
            alt=""
          />
        );
        return url ? (
          <OutboundLink
            key={id}
            href={url}
            aria-label={name}
            event="outbound_click"
            params={{ link_type: 'podcast_platform', item_id: id, placement: 'episode_page' }}
          >
            {img}
          </OutboundLink>
        ) : (
          <span key={id}>{img}</span>
        );
      })}
    </div>
  );
}
