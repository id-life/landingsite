import React, { useMemo } from 'react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useAtomValue } from 'jotai';
import { AudioDataItem } from '@/apis/types';
import dayjsDuration from 'dayjs/plugin/duration';
import { currentTimeAtom, durationAtom, progressAtom } from '@/atoms/audio-player';
import { jotaiStore } from '@/atoms';
import OutboundLink from '@/lib/analytics/outbound';
import { safeHref } from '@/utils/safe-href';

dayjs.extend(dayjsDuration);

type DesktopPodcastItemProps = {
  data: AudioDataItem;
  onClick: () => void;
  currentMusicId?: number;
  onSeekTo?: (value: number) => void;
  className?: string;
};

/**
 * The current episode's progress bar and times: the only part of a row that changes as the episode plays, so the only
 * part that reads the playing time (about four updates a second). The rest of the list does not re-render with it.
 */
function EpisodeProgress({
  onSeek,
  onSeekTo,
}: {
  onSeek: (event: React.MouseEvent<HTMLDivElement>) => void;
  onSeekTo?: (value: number) => void;
}) {
  const progress = useAtomValue(progressAtom);
  const currentTime = useAtomValue(currentTimeAtom);
  const duration = useAtomValue(durationAtom);
  // A slider for assistive technology and the keyboard (ENG-03): the arrow keys step 5 s, Home and End go to the ends.
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5 }[event.key];
    let to: number | null = step === undefined ? null : Math.min(duration, Math.max(0, currentTime + step));
    if (event.key === 'Home') to = 0;
    if (event.key === 'End') to = duration;
    if (to === null) return;
    event.preventDefault();
    onSeekTo?.(to);
  };
  return (
    <>
      <div
        role="slider"
        tabIndex={0}
        aria-label="Episode position"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(currentTime)}
        aria-valuetext={`${dayjs.duration(currentTime, 'seconds').format('mm:ss')} of ${dayjs.duration(duration, 'seconds').format('mm:ss')}`}
        onClick={onSeek}
        onKeyDown={onKeyDown}
        className="mt-[6px] flex h-[16px] cursor-pointer items-center justify-start mobile:mt-[0.375rem] mobile:h-[1rem]"
      >
        <div className="relative h-[2px] w-full bg-tone-650 mobile:h-[0.125rem]">
          <div
            style={{ width: `${progress * 100}%` }}
            className="absolute left-0 top-0 h-[2px] bg-accent mobile:h-[0.125rem]"
          />
          <div
            style={{
              left: `${progress * 100}%`,
              background:
                'linear-gradient(180deg, rgba(193, 17, 17, 0) 0%, var(--color-accent) 50%, rgba(193, 17, 17, 0) 100%)',
            }}
            className="absolute top-1/2 h-[16px] w-[2px] -translate-y-1/2 mobile:h-[1rem] mobile:w-[0.125rem]"
          />
        </div>
      </div>
      <div className="mt-[4px] flex items-center justify-between text-xs/[16px] font-medium text-tone-350 mobile:mt-[0.25rem] mobile:text-xs/[1rem]">
        <p>{dayjs.duration(currentTime, 'seconds').format('mm:ss')}</p>
        <p>{dayjs.duration(duration, 'seconds').format('mm:ss')}</p>
      </div>
    </>
  );
}
EpisodeProgress.displayName = 'EpisodeProgress';

function DesktopPodcastItem({ data, onClick, currentMusicId, onSeekTo, className }: DesktopPodcastItemProps) {
  const isCurrent = useMemo(() => currentMusicId === data.id, [currentMusicId, data.id]);

  const handleProgressChange = (event: React.MouseEvent<HTMLDivElement>) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - left;
    const progress = x / width;
    const seekTo = progress * jotaiStore.get(durationAtom);
    onSeekTo?.(seekTo);
  };

  const xyzUrl = safeHref(data.xyzLink);
  const appleUrl = safeHref(data.podcastLink);

  return (
    <div className={clsx('flex items-start gap-[10px] mobile:w-full mobile:gap-[0.625rem] mobile:overflow-hidden', className)}>
      <img className="size-[50px] mobile:size-[3.125rem]" src={data.album} alt="" />
      <div className="flex flex-1 items-start gap-[2px] overflow-hidden mobile:w-[calc(100%_-_3.75rem)] mobile:gap-[0.125rem]">
        {isCurrent ? <img className="w-[16px] mobile:w-[1rem]" src="/svgs/player/play_status.svg" alt="" /> : null}
        <div className="w-full overflow-hidden">
          {/* A button (Tab stop, Enter and Space), drawn as the block of text it was: block, left-aligned. */}
          <button
            type="button"
            onClick={onClick}
            className={clsx(
              'block w-full cursor-pointer truncate text-left text-[12px]/[20px] font-semibold hover:text-accent mobile:text-[0.75rem]/[1.25rem]',
              isCurrent && 'text-accent',
            )}
          >
            {data.title}
          </button>
          <div className="mt-[2px] line-clamp-2 text-xs/[16px] text-tone-350 mobile:mt-[0.125rem] mobile:text-xs/[1rem]">
            {data.description}
          </div>
          {isCurrent ? <EpisodeProgress onSeek={handleProgressChange} onSeekTo={onSeekTo} /> : null}
          <div className="mt-[8px] flex items-center justify-between mobile:mt-[0.5rem]">
            <div className="flex-center gap-[4px] text-xs/[16px] font-medium text-tone-500 mobile:gap-[0.25rem] mobile:text-xs/[1rem]">
              <span>{dayjs.duration(data.duration, 'seconds').format('m')}min</span>
              <span>·</span>
              <span>{dayjs(data.createdAt).format('YYYY/MM/DD')}</span>
            </div>
            <div className="flex items-center gap-[4px] mobile:gap-[0.25rem]">
              {xyzUrl && (
                <OutboundLink
                  href={xyzUrl}
                  aria-label="Xiaoyuzhou"
                  event="outbound_click"
                  params={{ link_type: 'podcast_platform', item_id: 'xiaoyuzhou', placement: 'site_player' }}
                >
                  <img className="w-[16px] cursor-pointer mobile:w-[1rem]" src="/imgs/player/fm_xiaoyuzhou.png" alt="" />
                </OutboundLink>
              )}
              {appleUrl && (
                <OutboundLink
                  href={appleUrl}
                  aria-label="Apple Podcasts"
                  event="outbound_click"
                  params={{ link_type: 'podcast_platform', item_id: 'apple_podcasts', placement: 'site_player' }}
                >
                  <img className="w-[16px] cursor-pointer mobile:w-[1rem]" src="/imgs/player/fm_podcast.png" alt="" />
                </OutboundLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(DesktopPodcastItem);
