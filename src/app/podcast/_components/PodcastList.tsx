import Link from 'next/link';
import { PODCAST_NAV_LIST, PodcastCategory } from '@/app/podcast/_components/constant';
import PodcastListItem from '@/app/podcast/_components/PodcastListItem';
import { getPodcastEpisodes } from '@/app/podcast/_components/episodes';

type PodcastListProps = {
  category: PodcastCategory;
};

export default async function PodcastList(props: PodcastListProps) {
  const { category } = props;
  const list = await getPodcastEpisodes(category);

  if (!list) {
    const retry = PODCAST_NAV_LIST.find((item) => item.id === category)?.link ?? '/podcast';
    return (
      <div role="status" className="py-16 text-center font-poppins text-base font-medium text-black/60 mobile:py-12">
        <p>节目列表暂时无法加载。The episode list could not be loaded right now.</p>
        {/* A full reload fetches the page again; it regenerates on the server every 5 minutes. */}
        <a href={retry} className="mt-4 inline-block text-sm font-semibold uppercase text-red-600 underline">
          Try again 重试
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-12 mobile:gap-9">
      {list.map((item) => (
        <Link className="overflow-hidden" key={item.id} href={`/podcast/${item.id}`}>
          <PodcastListItem key={item.id} data={item} />
        </Link>
      ))}
    </div>
  );
}
