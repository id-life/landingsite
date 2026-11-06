import Link from 'next/link';
import { PodcastCategory } from '@/app/podcast/_components/constant';
import PodcastListItem from '@/app/podcast/_components/PodcastListItem';
import { getPodcastEpisodes } from '@/app/podcast/_components/episodes';

type PodcastListProps = {
  category: PodcastCategory;
};

export default async function PodcastList(props: PodcastListProps) {
  const { category } = props;
  const list = await getPodcastEpisodes(category);

  return (
    <div className="grid gap-12 mobile:gap-9">
      {list.map((item) => (
        <Link className="overflow-hidden" key={item.id} target="_blank" href={`/podcast/${item.id}`}>
          <PodcastListItem key={item.id} data={item} />
        </Link>
      ))}
    </div>
  );
}
