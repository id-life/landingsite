import PodcastCommentItem from '@/app/podcast/[id]/_components/PodcastCommentItem';

export default function PodcastComments() {
  return (
    <div className="grid gap-7">
      <PodcastCommentItem />
      <PodcastCommentItem />
      <PodcastCommentItem />
      <PodcastCommentItem />
      <PodcastCommentItem />
      <PodcastCommentItem />
    </div>
  );
}
