'use client';

import { PodcastItem } from '@/apis/types';

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
      {data.xyzLink ? (
        <img
          onClick={() => handleLinkClick(data.xyzLink)}
          className="w-7.5 cursor-pointer mobile:w-6"
          src="/imgs/podcast/fm_xyz.png"
          alt=""
        />
      ) : null}
      {data.spotifyLink ? (
        <img
          onClick={() => handleLinkClick(data.spotifyLink)}
          className="w-7.5 cursor-pointer mobile:w-6"
          src="/imgs/podcast/fm_spotify.png"
          alt=""
        />
      ) : null}
      {data.podcastLink ? (
        <img
          onClick={() => handleLinkClick(data.podcastLink)}
          className="w-7.5 cursor-pointer mobile:w-6"
          src="/imgs/podcast/fm_podcast.png"
          alt=""
        />
      ) : null}
    </div>
  );
}
