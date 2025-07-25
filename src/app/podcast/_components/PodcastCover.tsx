'use client';

import { PODCAST_COVER, PodcastCategory } from '@/app/podcast/_components/constant';
import { useMemo } from 'react';

type PodcastCoverProps = {
  category: PodcastCategory;
};

export default function PodcastCover({ category }: PodcastCoverProps) {
  const data = useMemo(() => PODCAST_COVER[category], [category]);

  const handleLinkClick = (url?: string) => {
    if (!url) return;
    window.open(url, '_blank');
  };

  return (
    <div className="flex gap-8.5">
      <img className="w-45 rounded-xl" src={data.cover} alt="" />
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h2 className="text-[1.625rem]/[2.5rem] font-semibold">{data.title}</h2>
          <p className="mt-4 text-sm font-medium">{data.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex-center gap-4">
            {data.op.map((item) => (
              <div className="flex-center gap-1.5" key={item.name}>
                <img className="size-7.5 rounded-full" src={item.avatar} alt="" />
                {item.name}
              </div>
            ))}
          </div>
          <div className="flex-center gap-2">
            {data.xyzLink ? (
              <img
                onClick={() => handleLinkClick(data.xyzLink)}
                className="w-7.5 cursor-pointer"
                src="/imgs/podcast/fm_xyz.png"
                alt=""
              />
            ) : null}
            {data.spotifyLink ? (
              <img
                onClick={() => handleLinkClick(data.spotifyLink)}
                className="w-7.5 cursor-pointer"
                src="/imgs/podcast/fm_spotify.png"
                alt=""
              />
            ) : null}
            {data.appleLink ? (
              <img
                onClick={() => handleLinkClick(data.appleLink)}
                className="w-7.5 cursor-pointer"
                src="/imgs/podcast/fm_podcast.png"
                alt=""
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
