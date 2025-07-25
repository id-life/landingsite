import Link from 'next/link';
import { fetchPodcastList } from '@/apis';
import { PodcastCategory } from '@/app/podcast/_components/constant';
import PodcastListItem from '@/app/podcast/_components/PodcastListItem';

type PodcastListProps = {
  category: PodcastCategory;
};

export default async function PodcastList(props: PodcastListProps) {
  const { category } = props;
  const data = await fetchPodcastList(`podcast_${category}`);
  const list = data.code == 200 ? data.data : [];
  list.sort((a, b) => a.sequence - b.sequence);

  return (
    <div className="grid gap-12">
      {list.map((item) => (
        <Link key={item.id} href={`/podcast/${item.id}`}>
          <PodcastListItem key={item.id} data={item} />
        </Link>
      ))}
    </div>
  );
}
