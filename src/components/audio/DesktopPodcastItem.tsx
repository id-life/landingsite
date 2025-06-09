import React, { useMemo } from 'react';
import { AudioDataItem } from './audio-data';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useAtomValue } from 'jotai';
import dayjsDuration from 'dayjs/plugin/duration';
import { audioControlsAtom } from '@/atoms/audio-player';

dayjs.extend(dayjsDuration);

type DesktopPodcastItemProps = {
  data: AudioDataItem;
  onClick: () => void;
  currentMusicId?: number;
  onSeekTo?: (value: number) => void;
};

function DesktopPodcastItem({ data, onClick, currentMusicId, onSeekTo }: DesktopPodcastItemProps) {
  const isCurrent = useMemo(() => currentMusicId === data.id, [currentMusicId, data.id]);
  const controls = useAtomValue(audioControlsAtom);

  const handleProgressChange = (event: React.MouseEvent<HTMLDivElement>) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - left;
    const progress = x / width;
    const seekTo = progress * controls.duration;
    onSeekTo?.(seekTo);
  };

  const handleOpenLink = (url?: string) => {
    if (!url) return;
    window.open(url, '_blank');
  };

  return (
    <div className="flex items-start gap-2.5 mobile:w-full mobile:overflow-hidden">
      <img className="size-12.5" src={data.album} alt="" />
      <div className="flex items-start gap-0.5 mobile:w-[calc(100%_-_60px)]">
        {isCurrent ? <img className="w-4" src="/svgs/player/play_status.svg" alt="" /> : null}
        <div className={clsx(isCurrent ? 'w-71 mobile:w-[calc(100%_-_20px)]' : 'w-75 mobile:w-full')}>
          <div
            onClick={onClick}
            className={clsx('w-full cursor-pointer truncate text-xs/5 font-semibold', isCurrent && 'text-red-600')}
          >
            {data.title}
          </div>
          <div className="mt-0.5 line-clamp-2 text-ss/3.5">{data.description}</div>
          {isCurrent ? (
            <>
              <div onClick={handleProgressChange} className="flex h-4 cursor-pointer items-center justify-start">
                <div className="relative h-0.5 w-full bg-[#BDBDBD]">
                  <div style={{ width: `${controls.progress * 100}%` }} className="absolute left-0 top-0 h-0.5 bg-red-600" />
                  <div
                    style={{
                      left: `${controls.progress * 100}%`,
                      background:
                        'linear-gradient(180deg, rgba(193, 17, 17, 0.00) 0%, #C11111 50%, rgba(193, 17, 17, 0.00) 100%)',
                    }}
                    className="absolute top-1/2 h-4 w-0.5 -translate-y-1/2"
                  />
                </div>
              </div>
              <div className="mt-1 flex items-center justify-between text-ss/3.5 font-medium">
                <p>{dayjs.duration(controls.currentTime, 'seconds').format('mm:ss')}</p>
                <p>{dayjs.duration(controls.duration, 'seconds').format('mm:ss')}</p>
              </div>
            </>
          ) : null}
          <div className="mt-2 flex items-center justify-between">
            <div className="text-ss/3.5 font-medium">
              {dayjs.duration(data.duration, 'seconds').format('m')}min {dayjs(data.createdAt).format('YYYY/MM/DD')}
            </div>
            <div className="flex items-center gap-1">
              {data.xyzLink && (
                <img
                  onClick={() => handleOpenLink(data.xyzLink)}
                  className="w-4 cursor-pointer"
                  src="/imgs/player/fm_xiaoyuzhou.png"
                  alt=""
                />
              )}
              {data.podcastLink && (
                <img
                  onClick={() => handleOpenLink(data.podcastLink)}
                  className="w-4 cursor-pointer"
                  src="/imgs/player/fm_podcast.png"
                  alt=""
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(DesktopPodcastItem);
