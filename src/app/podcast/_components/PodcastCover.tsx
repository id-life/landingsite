'use client';

import { PODCAST_COVER, PodcastCategory } from '@/app/podcast/_components/constant';
import { useEffect, useMemo } from 'react';
import { useGA } from '@/hooks/useGA';
import { GA_EVENT_NAMES } from '@/constants/ga';

type PodcastCoverProps = {
  category: PodcastCategory;
};

export default function PodcastCover({ category }: PodcastCoverProps) {
  const { trackEvent } = useGA();
  const data = useMemo(() => PODCAST_COVER[category], [category]);

  const handleLinkClick = (type: string, url?: string) => {
    if (!url) return;
    trackEvent({ name: GA_EVENT_NAMES.SUBSCRIBE_VIEW, label: type, podcast_episode: `${category}_home` });
    window.open(url, '_blank');
  };

  useEffect(() => {
    trackEvent({ name: GA_EVENT_NAMES.PODCAST_PAGE_VIEW, label: `${category}_page` });
  }, [category, trackEvent]);

  return (
    <div>
      <div className="flex gap-8.5 mobile:gap-4">
        <img className="w-45 rounded-xl mobile:w-30" src={data.cover} alt="" />
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <h2 className="whitespace-nowrap text-[1.625rem]/[2.5rem] font-semibold mobile:text-xl/6">
              <span>{data.title}</span>&nbsp;
              <span className="mobile:block">{data.enTitle}</span>
            </h2>
            <p className="mt-4 text-sm font-medium mobile:hidden">{data.description}</p>
          </div>
          <div className="flex items-center justify-start gap-2">
            <img
              onClick={() => handleLinkClick('xyz', data.xyzLink)}
              className="w-7.5 cursor-pointer mobile:w-6"
              src="/imgs/podcast/fm_xyz.png"
              alt=""
            />
            <img
              onClick={() => handleLinkClick('spotify', data.spotifyLink)}
              className="w-7.5 cursor-pointer mobile:w-6"
              src="/imgs/podcast/fm_spotify.png"
              alt=""
            />
            <img
              onClick={() => handleLinkClick('podcast', data.podcastLink)}
              className="w-7.5 cursor-pointer mobile:w-6"
              src="/imgs/podcast/fm_podcast.png"
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="mt-7.5 hidden text-xs/5 font-medium mobile:block">{data.description}</div>
    </div>
  );
}
