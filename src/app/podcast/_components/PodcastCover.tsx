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
    <div>
      <div className="flex gap-8.5">
        <img className="w-45 rounded-xl mobile:w-30" src={data.cover} alt="" />
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <h2 className="text-[1.625rem]/[2.5rem] font-semibold mobile:text-xl/6">
              <span>{data.title}</span>&nbsp;
              <span className="mobile:block">{data.enTitle}</span>
            </h2>
            <p className="mt-4 text-sm font-medium mobile:hidden">{data.description}</p>
          </div>
          <div className="flex items-center justify-start gap-2">
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
            {data.appleLink ? (
              <img
                onClick={() => handleLinkClick(data.appleLink)}
                className="w-7.5 cursor-pointer mobile:w-6"
                src="/imgs/podcast/fm_podcast.png"
                alt=""
              />
            ) : null}
          </div>
        </div>
      </div>
      <div className="mt-7.5 hidden text-xs/5 font-medium mobile:block">{data.description}</div>
    </div>
  );
}
