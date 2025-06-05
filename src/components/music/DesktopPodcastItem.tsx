import React, { useMemo } from 'react';
import { MusicDataItem } from './music-data';
import clsx from 'clsx';
import dayjs from 'dayjs';
import dayjsDuration from 'dayjs/plugin/duration';

dayjs.extend(dayjsDuration);

type DesktopPodcastItemProps = {
  data: MusicDataItem;
  onClick: () => void;
  currentMusicId?: number;
};

function DesktopPodcastItem({ data, onClick, currentMusicId }: DesktopPodcastItemProps) {
  const isCurrent = useMemo(() => currentMusicId === data.id, [currentMusicId, data.id]);

  return (
    <div className={clsx('')}>
      <div className="flex items-start gap-2.5">
        <img className="size-12.5" src={data.album} alt="" />
        <div className="flex items-start gap-0.5">
          {isCurrent ? <img className="w-4" src="/svgs/player/play_status.svg" alt="" /> : null}
          <div className={clsx(isCurrent ? 'w-71' : 'w-75')}>
            <div
              onClick={onClick}
              className={clsx('w-full cursor-pointer truncate text-xs/5 font-semibold', isCurrent && 'text-red-600')}
            >
              {data.title}
            </div>
            <div className="mt-0.5 line-clamp-2 text-ss/3.5">{data.description}</div>
            <div className="mt-4">
              <div className="relative h-0.5 w-full bg-[#BDBDBD]">
                <div className="absolute left-0 top-0 h-0.5 w-[30%] bg-red-600" />
                <div className="absolute left-[30%] top-1/2 h-4 w-0.5 -translate-y-1/2 bg-red-600" />
              </div>
              <div className="mt-1 flex items-center justify-between text-ss/3.5 font-medium">
                <p>12:12</p>
                <p>{dayjs.duration(data.duration, 'seconds').format('mm:ss')}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-ss/3.5 font-medium">
                {dayjs.duration(data.duration, 'seconds').format('m')}min {dayjs(data.createdAt).format('YYYY/MM/DD')}
              </div>
              <div className="flex items-center gap-1">
                <img className="w-4 cursor-pointer" src="/imgs/player/fm_xiaoyuzhou.png" alt="" />
                <img className="w-4 cursor-pointer" src="/imgs/player/fm_podcast.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(DesktopPodcastItem);
