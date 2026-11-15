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
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'relative cursor-pointer select-none gap-[4px] rounded-full bg-white/10 p-[8px] text-center text-[12px]/[14px] font-semibold',
          className,
        )}
      >
        {PodcastCategoryMap[selected]}
        <ArrowSVG className={clsx('absolute right-[8px] top-[6px] w-[18px] fill-white', isOpen && 'rotate-180')} />
      </div>
      {isOpen && (
        <div className="absolute left-0 top-[38px] isolate z-10 w-full bg-white/5 text-center text-[12px]/[12px] font-semibold shadow-lg backdrop-blur-2xl">
          {PodcastCategoryList.map((key) => (
            <div
              key={key}
              className="cursor-pointer text-nowrap px-[8px] py-[14px] hover:bg-white/10"
              onClick={() => handleChangePodcast(key)}
            >
              {PodcastCategoryMap[key]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default React.memo(PodcastSelected);
