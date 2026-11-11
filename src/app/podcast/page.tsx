import React from 'react';
import PodcastList from '@/app/podcast/_components/PodcastList';
import PodcastCover from '@/app/podcast/_components/PodcastCover';
import { PODCAST_COVER, PODCAST_METADATA, PODCAST_NAV_LIST, PodcastCategory } from '@/app/podcast/_components/constant';
import { getPodcastEpisodes } from '@/app/podcast/_components/episodes';
import { podcastSeriesJsonLd } from '@/app/podcast/_components/jsonLd';
import { breadcrumbJsonLd } from '@/constants/entity';
import type { Metadata } from 'next';

export const revalidate = 300; // 5min

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { c } = searchParams;
  const nav = PODCAST_NAV_LIST.find((item) => item.id === c) ?? PODCAST_NAV_LIST[0];
  return { ...PODCAST_METADATA[nav.id], alternates: { canonical: nav.link } };
}

type SearchParams = { [key: string]: PodcastCategory | undefined };

async function seriesJsonLd(category: PodcastCategory) {
  const nav = PODCAST_NAV_LIST.find((item) => item.id === category) ?? PODCAST_NAV_LIST[0];
  const episodes = await getPodcastEpisodes(nav.id);
  return [
    { '@context': 'https://schema.org', ...podcastSeriesJsonLd(nav.id, episodes) },
    // The main show shares the company's name, so its crumb is labelled by what the page is.
    breadcrumbJsonLd([
      {
        name:
          nav.id === PODCAST_NAV_LIST[0].id
            ? 'Podcast 播客'
            : `${PODCAST_COVER[nav.id].title} ${PODCAST_COVER[nav.id].enTitle}`,
        path: nav.link,
      },
    ]),
  ];
}

export default async function PodcastPage({ searchParams }: { searchParams: SearchParams }) {
  const { c } = searchParams;
  const category = c ?? PODCAST_NAV_LIST[0].id;
  const jsonLd = await seriesJsonLd(category);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mt-2">
        <PodcastCover category={category} />
        <div className="mt-8.5 h-px bg-gray-950/20 mobile:mt-7.5" />
        <div className="my-15 mobile:my-9">
          <PodcastList category={category} />
        </div>
      </div>
    </>
  );
}
