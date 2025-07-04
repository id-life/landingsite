import React, { useMemo } from 'react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useAtomValue } from 'jotai';
import { AudioDataItem } from '@/apis/types';
import dayjsDuration from 'dayjs/plugin/duration';
import { audioControlsAtom } from '@/atoms/audio-player';
import { useGA } from '@/hooks/useGA';
import { GA_EVENT_NAMES } from '@/constants/ga';

dayjs.extend(dayjsDuration);

type DesktopPodcastItemProps = {
  data: AudioDataItem;
  onClick: () => void;
  currentMusicId?: number;
  onSeekTo?: (value: number) => void;
  className?: string;
};

function DesktopPodcastItem({ data, onClick, currentMusicId, onSeekTo, className }: DesktopPodcastItemProps) {
  const isCurrent = useMemo(() => currentMusicId === data.id, [currentMusicId, data.id]);
  const controls = useAtomValue(audioControlsAtom);
  const { trackEvent } = useGA();

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
    <div className={clsx('flex items-start gap-[10px] mobile:w-full mobile:overflow-hidden', className)}>
      <img className="size-[50px]" src={data.album} alt="" />
      <div className="flex flex-1 items-start gap-[2px] overflow-hidden mobile:w-[calc(100%_-_60px)]">
        {isCurrent ? <img className="w-[16px]" src="/svgs/player/play_status.svg" alt="" /> : null}
        <div className="overflow-hidden">
          <div
            onClick={onClick}
            className={clsx(
              'w-full cursor-pointer truncate text-[12px]/[20px] font-semibold hover:text-red-800',
              isCurrent && 'text-red-800',
            )}
          >
            {data.title}
          </div>
          <div className="mt-[2px] line-clamp-2 text-[10px]/[14px] text-gray-350">{data.description}</div>
          {isCurrent ? (
            <>
              <div onClick={handleProgressChange} className="mt-[6px] flex h-[16px] cursor-pointer items-center justify-start">
                <div className="relative h-[2px] w-full bg-[#57595C]">
                  <div style={{ width: `${controls.progress * 100}%` }} className="absolute left-0 top-0 h-[2px] bg-red-800" />
                  <div
                    style={{
                      left: `${controls.progress * 100}%`,
                      background: 'linear-gradient(180deg, rgba(193, 17, 17, 0) 0%, #FF1717 50%, rgba(193, 17, 17, 0) 100%)',
                    }}
                    className="absolute top-1/2 h-[16px] w-[2px] -translate-y-1/2"
                  />
                </div>
              </div>
              <div className="mt-[4px] flex items-center justify-between text-[10px]/[14px] font-medium text-gray-350">
                <p>{dayjs.duration(controls.currentTime, 'seconds').format('mm:ss')}</p>
                <p>{dayjs.duration(controls.duration, 'seconds').format('mm:ss')}</p>
              </div>
            </>
          ) : null}
          <div className="mt-[8px] flex items-center justify-between">
            <div className="flex-center gap-[4px] text-[10px]/[14px] font-medium text-gray-500">
              <span>{dayjs.duration(data.duration, 'seconds').format('m')}min</span>
              <span>·</span>
              <span>{dayjs(data.createdAt).format('YYYY/MM/DD')}</span>
            </div>
            <div className="flex items-center gap-[4px]">
              {data.xyzLink && (
                <img
                  onClick={() => {
                    trackEvent({
                      name: GA_EVENT_NAMES.PODCAST_LINK_XYZ,
                      label: data.title,
                    });
                    handleOpenLink(data.xyzLink);
                  }}
                  className="w-[16px] cursor-pointer"
                  src="/imgs/player/fm_xiaoyuzhou.png"
                  alt=""
                />
              )}
              {data.podcastLink && (
                <img
                  onClick={() => {
                    trackEvent({
                      name: GA_EVENT_NAMES.PODCAST_LINK_APPLE,
                      label: data.title,
                    });
                    handleOpenLink(data.podcastLink);
                  }}
                  className="w-[16px] cursor-pointer"
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
