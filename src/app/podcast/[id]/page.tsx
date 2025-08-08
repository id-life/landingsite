import { cache } from 'react';
import { fetchPodcastDetail } from '@/apis';
import PodcastContentTab from '@/app/podcast/[id]/_components/PodcastContentTab';
import PodcastLinks from '@/app/podcast/[id]/_components/PodcastLinks';
import PodcastPlayer from '@/app/podcast/[id]/_components/PodcastPlayer';
import type { Metadata } from 'next';

export const revalidate = 300; // 5min
export const dynamicParams = true;
export const dynamic = 'force-static';

const getCachePodcastDetail = cache(async (id: string) => {
  const res = await fetchPodcastDetail(id);
  return res.data;
});

type Params = { id: string };
type PodcastPlayerProps = {
  params: Params;
};

export async function generateMetadata({ params }: PodcastPlayerProps): Promise<Metadata> {
  const { id } = params;
  const data = await getCachePodcastDetail(id);
  if (!data) {
    return {
      title: 'Immortal Dragons',
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
    title: `${data.title} | Immortal Dragons`,
    description: data.description,
    keywords: data.keywords,
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

  return (
    <div className="pb-24 mobile:pb-16">
      <img className="mx-auto w-24 rounded-lg mobile:w-21" src={data.album} alt="" />
      <div className="flex-center mb-7.5 mt-6 flex-col gap-3 mobile:my-6 mobile:mt-5 mobile:flex-col">
        <h1 className="text-center text-xl font-semibold mobile:text-base">{data.title}</h1>
        <PodcastLinks data={data} />
      </div>
      <img className="mx-auto h-75 object-cover mobile:h-45" alt="" src={data.detailMedia} />
      <div className="my-9 mt-7.5 text-sm font-medium mobile:mb-7.5 mobile:mt-6 mobile:text-xs/4.5">{data.description}</div>
      <PodcastContentTab data={data} />
      <PodcastPlayer data={data} />
    </div>
  );
}
