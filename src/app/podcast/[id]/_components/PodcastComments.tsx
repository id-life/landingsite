import PodcastCommentItem from '@/app/podcast/[id]/_components/PodcastCommentItem';
import NoComment from '@/app/podcast/[id]/_components/NoComment';
import { useFetchPodcastComment } from '@/hooks/podcast/fetch';
import SectionLoadError from '@/components/common/SectionLoadError';

type PodcastCommentsProps = {
  id: string;
};

export default function PodcastComments({ id }: PodcastCommentsProps) {
  const { data, isError, isPending, refetch } = useFetchPodcastComment(id);
  if (isError) return <SectionLoadError onRetry={() => void refetch()} />;
  // Still loading (or retrying): no "No comment" until the answer says there are none (ENG-08).
  if (isPending) return <div aria-busy="true" className="h-16" />;

  return (
    <div className="grid gap-7 mobile:gap-5">
      {data && data.length > 0 ? data.map((item) => <PodcastCommentItem key={item.id} data={item} />) : <NoComment />}
    </div>
  );
}
