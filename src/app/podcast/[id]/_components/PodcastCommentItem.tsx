import dayjs from 'dayjs';
import { PodcastCommentItemType } from '@/apis/types';
import { COMMENTS_TYPE } from '@/app/podcast/_components/constant';

type PodcastCommentItemProps = {
  data: PodcastCommentItemType;
};

export default function PodcastCommentItem({ data }: PodcastCommentItemProps) {
  return (
    <div className="flex gap-2">
      <img src={data.avatar} className="size-10 rounded-full" alt="" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-read-sm text-gray-550">{data.nickName}</div>
            <p className="text-read-xs text-gray-350">{dayjs(data.createdAt).format('YYYY.MM.DD')}</p>
          </div>
          {data.source === COMMENTS_TYPE.XYZ && <div className="text-read-xs text-gray-500">— 来自小宇宙用户</div>}
        </div>
        <p className="mt-2 text-read-sm font-medium">{data.content}</p>
      </div>
    </div>
  );
}
