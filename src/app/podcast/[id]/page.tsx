import React, { cache } from 'react';
import { fetchPodcastDetail } from '@/apis';
import { isApiNotFound } from '@/apis/request';
import PodcastContentTab from '@/app/podcast/[id]/_components/PodcastContentTab';
import PodcastLinks from '@/app/podcast/[id]/_components/PodcastLinks';
import PodcastPlayer from '@/app/podcast/[id]/_components/PodcastPlayer';
import { PODCAST_COVER, PODCAST_NAV_LIST } from '@/app/podcast/_components/constant';
import { categoryOf, podcastEpisodeJsonLd } from '@/app/podcast/_components/jsonLd';
import { ORG_REF, breadcrumbJsonLd } from '@/constants/entity';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/seo/JsonLd';

export const revalidate = 300; // 5min
export const dynamicParams = true;
export const dynamic = 'force-static';

// Episode ids are numbers. Anything else (/podcast/abc, /podcast/56abc, /podcast/1.5, /podcast/rss) is a 404
// without asking the API, which answers those with HTTP 400 (that used to surface as a 500).
const EPISODE_ID = /^\d+$/;

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
  params: Params;
};

export async function generateMetadata({ params }: PodcastPlayerProps): Promise<Metadata> {
  const { id } = params;
  const data = await getCachePodcastDetail(id);
  if (!data) {
    return {
      title: { absolute: 'Episode not found | Immortal Dragons 不朽真龙' },
      description: 'Immortal Dragons is a purpose-driven longevity fund headquartered in Biopolis, Singapore.',
      keywords: [
        'Longevity',
        'anti-aging',
        'life extension',
        'investment fund',
        'innovation',
        'biotech',
        'pharmaceutical',
        'healthcare',
        'Immortal Dragons',
      ],
    };
  }

  return {
    title: { absolute: `${data.title} | Immortal Dragons` },
    description: data.description,
    keywords: data.keywords,
    alternates: { canonical: `/podcast/${canonicalId(id)}` },
    openGraph: {
      title: `${data.title} | Immortal Dragons`,
      siteName: 'Immortal Dragons',
      description: data.description,
      images: [
        {
          url: data.detailMedia,
        },
      ],
    },
  };
}

export default async function PodcastContentPage({ params }: PodcastPlayerProps) {
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
      <div className="pb-24 mobile:pb-16">
        <img className="mx-auto w-24 rounded-lg mobile:w-21" src={data.album} alt="" />
        <div className="flex-center mb-7.5 mt-6 flex-col gap-3 mobile:my-6 mobile:mt-5 mobile:flex-col">
          <h1 className="text-center text-xl font-semibold mobile:text-base">{data.title}</h1>
          <PodcastLinks data={data} />
        </div>
        {data?.detailMedia ? <img className="mx-auto h-75 object-cover mobile:h-45" alt="" src={data.detailMedia} /> : null}
        <div className="my-9 mt-7.5 text-sm font-medium mobile:mb-7.5 mobile:mt-6 mobile:text-xs/4.5">{data.description}</div>
        <PodcastContentTab data={data} />
        <PodcastPlayer data={data} />
      </div>
    </>
  );
}
