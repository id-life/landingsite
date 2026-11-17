import React from 'react';
import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo/metadata';
import PodcastList from '@/app/podcast/_components/PodcastList';
import PodcastCover from '@/app/podcast/_components/PodcastCover';
import { PODCAST_COVER, PODCAST_NAV_LIST, PODCAST_PAGE_ID, PodcastCategory } from '@/app/podcast/_components/constant';
import { pageMeta } from '@/content/pages';
import { getPodcastEpisodes } from '@/app/podcast/_components/episodes';
import { podcastSeriesJsonLd } from '@/app/podcast/_components/jsonLd';
import { breadcrumbJsonLd } from '@/constants/entity';
import JsonLd from '@/components/seo/JsonLd';

const navOf = (category: PodcastCategory) => PODCAST_NAV_LIST.find((item) => item.id === category) ?? PODCAST_NAV_LIST[0];

/** Each show has its own path (/podcast, /podcast/long-talk), so each page is static and its own canonical. */
export function podcastShowMetadata(category: PodcastCategory): Metadata {
  const { title, tabTitle, description } = pageMeta(PODCAST_PAGE_ID[category]);
  return buildMetadata({ path: navOf(category).link, title, tabTitle, description, image: PODCAST_COVER[category].cover });
}

async function seriesJsonLd(category: PodcastCategory) {
  const nav = navOf(category);
  const episodes = (await getPodcastEpisodes(nav.id)) ?? [];
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

/** The episode list of one show: cover, then every episode, newest first. */
export default async function PodcastShowPage({ category }: { category: PodcastCategory }) {
  const jsonLd = await seriesJsonLd(category);

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="mt-2">
        <PodcastCover category={category} />
        <div className="mt-8.5 h-px bg-tone-950/20 mobile:mt-7.5" />
        <div className="my-15 mobile:my-9">
          <PodcastList category={category} />
        </div>
      </div>
    </>
  );
}
