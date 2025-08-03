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

  console.log('data: ', JSON.stringify(data));

  return (
    <div className="pb-24 mobile:pb-16">
      <img className="mx-auto w-24 rounded-lg mobile:w-21" src={data.album} alt="" />
      <div className="flex-center mb-7.5 mt-6 gap-3 mobile:my-6 mobile:mt-5 mobile:flex-col">
        <h1 className="text-center text-xl font-semibold mobile:text-base">{data.title}</h1>
        <PodcastLinks data={data} />
      </div>
      <img className="h-75 w-full object-cover mobile:h-45" alt="" src={data.detailMedia} />
      <div className="my-9 mt-7.5 text-sm font-medium mobile:mb-7.5 mobile:mt-6 mobile:text-xs/4.5">{data.description}</div>
      <PodcastContentTab data={data} />
      <PodcastPlayer data={data} />
    </div>
  );
}
