import React, { useState } from 'react';
import { clsx } from 'clsx';
import { useAtom, useSetAtom } from 'jotai';
import { currentPlayListAtom, currentPlayPodcastAtom, PlayList, PlayPodcastKey } from '@/atoms/audio-player';
import ArrowSVG from '@/../public/svgs/player/arrow.svg?component';
import { track } from '@/lib/analytics/track';

type PodcastSelectedProps = {
  className?: string;
};

const PodcastCategoryList = [PlayList.PODCAST_ID, PlayList.PODCAST_LT];

const PodcastCategoryMap = {
  [PlayList.PODCAST_ID]: '不朽真龙 Immortal Dragons',
  [PlayList.PODCAST_LT]: '龙门阵 Long Talk',
};

function PodcastSelected({ className }: PodcastSelectedProps) {
  const [isOpen, setIsOpen] = useState(false);
  const setCurrentPlayList = useSetAtom(currentPlayListAtom);
  const [selected, setSelected] = useAtom(currentPlayPodcastAtom);

  const handleChangePodcast = (key: PlayPodcastKey) => {
    setSelected(key);
    setIsOpen(false);
    if (key === PlayList.PODCAST_ID) {
      track('player_control', { control: 'podcast_channel', value: 'immortaldragons' });
      setCurrentPlayList(PlayList.PODCAST_ID);
    }
    if (key === PlayList.PODCAST_LT) {
      track('player_control', { control: 'podcast_channel', value: 'longtalk' });
      setCurrentPlayList(PlayList.PODCAST_LT);
    }
  };

  return (
    <div className="relative w-full">
      {/* A button that opens the two shows (Tab stop, Enter and Space; aria-expanded), drawn as the full-width block it was. */}
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'relative block w-full cursor-pointer select-none gap-[4px] rounded-full bg-white/10 p-[8px] text-center text-[12px]/[14px] font-semibold mobile:gap-[0.25rem] mobile:p-[0.5rem] mobile:text-[0.75rem]/[0.875rem]',
          className,
        )}
      >
        {PodcastCategoryMap[selected]}
        <ArrowSVG
          className={clsx(
            'absolute right-[8px] top-[6px] w-[18px] fill-white mobile:right-[0.5rem] mobile:top-[0.375rem] mobile:w-[1.125rem]',
            isOpen && 'rotate-180',
          )}
        />
      </button>
      {isOpen && (
        <div className="absolute left-0 top-[38px] isolate z-10 w-full bg-white/5 text-center text-[12px]/[12px] font-semibold shadow-lg backdrop-blur-2xl mobile:top-[2.375rem] mobile:text-[0.75rem]/[0.75rem]">
          {PodcastCategoryList.map((key) => (
            <button
              type="button"
              key={key}
              className="block w-full cursor-pointer text-nowrap px-[8px] py-[14px] hover:bg-white/10 mobile:px-[0.5rem] mobile:py-[0.875rem]"
              onClick={() => handleChangePodcast(key)}
            >
              {PodcastCategoryMap[key]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default React.memo(PodcastSelected);
