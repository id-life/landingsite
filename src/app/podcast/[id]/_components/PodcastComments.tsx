import PodcastCommentItem from '@/app/podcast/[id]/_components/PodcastCommentItem';
import NoComment from '@/app/podcast/[id]/_components/NoComment';
import { useFetchPodcastComment } from '@/hooks/podcast/fetch';

type PodcastCommentsProps = {
  id: string;
};

export default function PodcastComments({ id }: PodcastCommentsProps) {
  const { data } = useFetchPodcastComment(id);

  return (
    <div className="grid gap-7">
      {data && data.length > 0 ? data.map((item) => <PodcastCommentItem key={item.id} data={item} />) : <NoComment />}
    </div>
  );
}
