import React, { cache } from 'react';
import { fetchPodcastDetail } from '@/apis';
import { isApiNotFound } from '@/apis/request';
import PodcastContentTab from '@/app/podcast/[id]/_components/PodcastContentTab';
import Markdown from 'react-markdown';
import { markdownRehypePlugins, markdownRemarkPlugins, remarkTimeline } from '@/utils/markdown';
import '@/styles/components/markdown-timeline.css';
import PodcastLinks from '@/app/podcast/[id]/_components/PodcastLinks';
import PodcastPlayer from '@/app/podcast/[id]/_components/PodcastPlayer';
import {
  PODCAST_COVER,
  PODCAST_NAV_LIST,
  PODCAST_SHARE_IMAGE,
  podcastFeedAlternate,
  podcastShowWords,
} from '@/app/podcast/_components/constant';
import { categoryOf, podcastEpisodeJsonLd } from '@/app/podcast/_components/jsonLd';
import { ORG_REF, breadcrumbJsonLd } from '@/constants/entity';
import type { Metadata } from 'next';
import { buildMetadata, NOT_FOUND_TITLE } from '@/lib/seo/metadata';
import { readImageInfo } from '@/lib/seo/image-info';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/seo/JsonLd';
import ReadDepth from '@/lib/analytics/ReadDepth';
import { zhLang } from '@/utils/lang';

export const revalidate = 300; // 5min
export const dynamicParams = true;
export const dynamic = 'force-static';

// Episode ids are numbers. Anything else (/podcast/abc, /podcast/56abc, /podcast/1.5, /podcast/feed) is a 404
// without asking the API, which answers those with HTTP 400 (that used to surface as a 500).
const EPISODE_ID = /^\d+$/;

// @[timeline](mm:ss) markers become clickable spans as syntax-tree nodes (remarkTimeline), then the shared
// sanitiser runs: transcript markup can no longer add script, handlers or attributes.
const transcriptRemarkPlugins = [...markdownRemarkPlugins, remarkTimeline];

const getCachePodcastDetail = cache(async (id: string) => {
  if (!EPISODE_ID.test(id)) return null;
  try {
    const res = await fetchPodcastDetail(id);
    return res.data ?? null;
  } catch (error) {
    // 400/404: no such episode. Anything else (API down) still throws, so ISR keeps the last good page.
    if (isApiNotFound(error)) return null;
    throw error;
  }
});

/** /podcast/056 and /podcast/56 are the same episode; the canonical URL has no leading zeros. */
const canonicalId = (id: string) => id.replace(/^0+(?=\d)/, '');

type Params = { id: string };
type PodcastPlayerProps = {
  params: Promise<Params>;
};

export async function generateMetadata(props: PodcastPlayerProps): Promise<Metadata> {
  const params = await props.params;
  const { id } = params;
  const data = await getCachePodcastDetail(id);
  if (!data) {
    return {
      title: { absolute: NOT_FOUND_TITLE },
      description: 'Immortal Dragons is a purpose-driven longevity fund headquartered in Biopolis, Singapore.',
    };
  }

  // The meta description is the episode's own notes, whole, as the owner's site serves them (2026-11-18).
  const metadata = buildMetadata({
    path: `/podcast/${canonicalId(id)}`,
    title: data.title,
    description: data.description,
    // The episode's own keywords, as his site serves them.
    keywords: data.keywords ?? [],
    // The episode's own picture, as his site declares it (same address and file), with its size and type read from
    // the file; an episode without one gets its show's picture, made 1200x630 (the lead's ruling of 2026-11-21).
    // Its alt is the episode's title (its h1), or the show's words with the show's picture.
    image: data.detailMedia
      ? { url: data.detailMedia, ...(await readImageInfo(data.detailMedia, revalidate)), alt: data.title }
      : { ...PODCAST_SHARE_IMAGE[categoryOf(data)], alt: podcastShowWords(categoryOf(data)) },
    type: 'article',
  });
  // An episode of the main show names the show's feed, as the show page does (question 22).
  const types = podcastFeedAlternate(categoryOf(data));
  return types ? { ...metadata, alternates: { ...metadata.alternates, types } } : metadata;
}

export default async function PodcastContentPage(props: PodcastPlayerProps) {
  const params = await props.params;
  const { id } = params;
  const data = await getCachePodcastDetail(id);
  // The API answers an unknown id with code 200 and data null; that is a 404, not a server error.
  if (!data) notFound();

  const category = categoryOf(data);
  const nav = PODCAST_NAV_LIST.find((item) => item.id === category) ?? PODCAST_NAV_LIST[0];
  const jsonLd = [
    { '@context': 'https://schema.org', ...podcastEpisodeJsonLd(data), publisher: ORG_REF },
    breadcrumbJsonLd([
      { name: `${PODCAST_COVER[category].title} ${PODCAST_COVER[category].enTitle}`, path: nav.link },
      { name: data.title, path: `/podcast/${canonicalId(id)}` },
    ]),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <ReadDepth itemId={String(params.id)} />
      <div className="pb-24 mobile:pb-16">
        <img className="mx-auto aspect-square w-24 rounded-lg object-cover mobile:w-21" src={data.album} alt="" />
        <div className="flex-center mb-7.5 mt-6 flex-col gap-3 mobile:my-6 mobile:mt-5 mobile:flex-col">
          <h1 lang={zhLang(data.title)} className="text-center text-xl font-semibold mobile:text-base">
            {data.title}
          </h1>
          <PodcastLinks data={data} />
        </div>
        {data?.detailMedia ? <img className="mx-auto h-75 object-cover mobile:h-45" alt="" src={data.detailMedia} /> : null}
        <div
          lang={zhLang(data.description)}
          className="my-9 mt-7.5 text-sm font-medium mobile:mb-7.5 mobile:mt-6 mobile:text-xs/4.5"
        >
          {data.description}
        </div>
        <PodcastContentTab id={data.id.toString()} transcriptLang={zhLang(data.transcript)}>
          <Markdown remarkPlugins={transcriptRemarkPlugins} rehypePlugins={markdownRehypePlugins}>
            {data.transcript}
          </Markdown>
        </PodcastContentTab>
        <PodcastPlayer data={data} />
      </div>
    </>
  );
}
