'use client';

import { PodcastItem } from '@/apis/types';
import { clsx } from 'clsx';

type PodcastLinkProps = {
  data: PodcastItem;
};

export default function PodcastLinks({ data }: PodcastLinkProps) {
  const handleLinkClick = (url: string) => {
    if (!url) return;
    window.open(url, '_blank');
  };

  return (
    <div className="flex-center gap-2">
      <img
        onClick={() => handleLinkClick(data.xyzLink)}
        className={clsx('w-7.5 mobile:w-6', data.xyzLink ? 'cursor-pointer' : 'cursor-not-allowed grayscale')}
        src="/imgs/podcast/fm_xyz.png"
        alt=""
      />
      <img
        onClick={() => handleLinkClick(data.spotifyLink)}
        className={clsx('w-7.5 mobile:w-6', data.spotifyLink ? 'cursor-pointer' : 'cursor-not-allowed grayscale')}
        src="/imgs/podcast/fm_spotify.png"
        alt=""
      />
      <img
        onClick={() => handleLinkClick(data.podcastLink)}
        className={clsx('w-7.5 mobile:w-6', data.podcastLink ? 'cursor-pointer' : 'cursor-not-allowed grayscale')}
        src="/imgs/podcast/fm_podcast.png"
        alt=""
      />
    </div>
  );
}
