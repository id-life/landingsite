'use client';

import { PodcastItem } from '@/apis/types';
import { clsx } from 'clsx';
import { useEffect, useMemo } from 'react';
import { useGA } from '@/hooks/useGA';
import { GA_EVENT_NAMES } from '@/constants/ga';

type PodcastLinkProps = {
  data: PodcastItem;
};

export default function PodcastLinks({ data }: PodcastLinkProps) {
  const { trackEvent } = useGA();
  const episode = useMemo(() => `${data.category.split('_')[1]}_${data.title}`, [data]);

  const handleLinkClick = (type: string, url: string) => {
    if (!url) return;
    trackEvent({ name: GA_EVENT_NAMES.SUBSCRIBE_VIEW, label: type, podcast_episode: episode });
    window.open(url, '_blank');
  };

  useEffect(() => {
    trackEvent({ name: GA_EVENT_NAMES.EPISODE_PAGE_VIEW, label: episode });
  }, [data, episode, trackEvent]);

  return (
    <div className="flex-center gap-2">
      <img
        onClick={() => handleLinkClick('xyz', data.xyzLink)}
        className={clsx('w-7.5 mobile:w-6', data.xyzLink ? 'cursor-pointer' : 'cursor-not-allowed grayscale')}
        src="/imgs/podcast/fm_xyz.png"
        alt=""
      />
      <img
        onClick={() => handleLinkClick('spotify', data.spotifyLink)}
        className={clsx('w-7.5 mobile:w-6', data.spotifyLink ? 'cursor-pointer' : 'cursor-not-allowed grayscale')}
        src="/imgs/podcast/fm_spotify.png"
        alt=""
      />
      <img
        onClick={() => handleLinkClick('podcast', data.podcastLink)}
        className={clsx('w-7.5 mobile:w-6', data.podcastLink ? 'cursor-pointer' : 'cursor-not-allowed grayscale')}
        src="/imgs/podcast/fm_podcast.png"
        alt=""
      />
    </div>
  );
}
