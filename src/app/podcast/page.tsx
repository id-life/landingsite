import React from 'react';
import PodcastList from '@/app/podcast/_components/PodcastList';
import PodcastCover from '@/app/podcast/_components/PodcastCover';
import { PODCAST_COVER, PODCAST_METADATA, PODCAST_NAV_LIST, PodcastCategory } from '@/app/podcast/_components/constant';
import { fetchPodcastList } from '@/apis';
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

// JSON-LD failures must not break the page, so a failed episode fetch just yields an empty series.
async function seriesJsonLd(category: PodcastCategory) {
  const nav = PODCAST_NAV_LIST.find((item) => item.id === category) ?? PODCAST_NAV_LIST[0];
  let episodes: Awaited<ReturnType<typeof fetchPodcastList>>['data'] = [];
  try {
    const res = await fetchPodcastList(`podcast_${nav.id}`);
    if (res.code === 200 && Array.isArray(res.data)) episodes = res.data;
  } catch {}
  return [
    { '@context': 'https://schema.org', ...podcastSeriesJsonLd(nav.id, episodes) },
    breadcrumbJsonLd([{ name: `${PODCAST_COVER[nav.id].title} ${PODCAST_COVER[nav.id].enTitle}`, path: nav.link }]),
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
