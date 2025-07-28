import { cache } from 'react';
import { fetchPodcastDetail } from '@/apis';
import PodcastContentTab from '@/app/podcast/[id]/_components/PodcastContentTab';
import PodcastLinks from '@/app/podcast/[id]/_components/PodcastLinks';
import PodcastPlayer from '@/app/podcast/[id]/_components/PodcastPlayer';

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

export default async function PodcastContentPage({ params }: PodcastPlayerProps) {
  const { id } = params;
  const data = await getCachePodcastDetail(id);

  return (
    <div className="py-10">
      <img className="mx-auto w-24 rounded-lg" src={data.album} alt="" />
      <div className="flex-center my-7.5 mt-6 gap-2.5">
        <h1 className="text-xl font-semibold">{data.title}</h1>
        <PodcastLinks data={data} />
      </div>
      <img className="w-full" alt="" src="/imgs/podcast/podcast-cover.webp" />
      <div className="my-9 mt-7.5 text-sm font-medium">{data.description}</div>
      <PodcastContentTab data={data} />
      <PodcastPlayer data={data} />
    </div>
  );
}
