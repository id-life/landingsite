'use client';

import { PODCAST_COVER, PodcastCategory } from '@/app/podcast/_components/constant';
import { useMemo } from 'react';
import OutboundLink from '@/lib/analytics/outbound';
import { safeHref } from '@/utils/safe-href';

type PodcastCoverProps = {
  category: PodcastCategory;
};

export default function PodcastCover({ category }: PodcastCoverProps) {
  const data = useMemo(() => PODCAST_COVER[category], [category]);

  // The /podcast page view is GA4's own page_view; the platform icons are real links (DATA-03).
  const platforms = [
    { id: 'xiaoyuzhou', name: 'Xiaoyuzhou', link: data.xyzLink, icon: '/imgs/podcast/fm_xyz.png' },
    { id: 'spotify', name: 'Spotify', link: data.spotifyLink, icon: '/imgs/podcast/fm_spotify.png' },
    { id: 'apple_podcasts', name: 'Apple Podcasts', link: data.podcastLink, icon: '/imgs/podcast/fm_podcast.png' },
  ];

  return (
    <div>
      <div className="flex gap-8.5 mobile:gap-4">
        <img className="aspect-square w-45 shrink-0 self-start rounded-xl object-cover mobile:w-30" src={data.cover} alt="" />
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <h1 className="whitespace-nowrap text-[1.625rem]/[2.5rem] font-semibold mobile:text-xl/6">
              {/* The show is named after the company; say what this page is for readers that only get the heading. */}
              <span className="sr-only">Podcast 播客: </span>
              <span>{data.title}</span>&nbsp;
              <span className="mobile:block">{data.enTitle}</span>
            </h1>
            <p className="mt-4 text-read-sm font-medium mobile:hidden">{data.description}</p>
          </div>
          <div className="flex items-center justify-start gap-2">
            {platforms.map(({ id, name, link, icon }) => {
              const url = safeHref(link);
              if (!url) return null;
              return (
                <OutboundLink
                  key={id}
                  href={url}
                  aria-label={name}
                  event="outbound_click"
                  params={{ link_type: 'podcast_platform', item_id: id, placement: 'podcast_page' }}
                >
                  <img className="w-7.5 cursor-pointer mobile:w-6" src={icon} alt="" />
                </OutboundLink>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-7.5 hidden text-read-sm font-medium mobile:block">{data.description}</div>
    </div>
  );
}
