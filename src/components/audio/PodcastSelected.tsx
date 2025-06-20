import React, { useState } from 'react';
import { clsx } from 'clsx';
import { useAtom, useSetAtom } from 'jotai';
import { currentPlayListAtom, currentPlayPodcastAtom, PlayList, PlayPodcastKey } from '@/atoms/audio-player';
import ArrowSVG from '@/../public/svgs/player/arrow.svg?component';

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
      setCurrentPlayList(PlayList.PODCAST_ID);
    }
    if (key === PlayList.PODCAST_LT) {
      setCurrentPlayList(PlayList.PODCAST_LT);
    }
  };

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'flex cursor-pointer items-center justify-center gap-[4px] rounded-full bg-audio-order p-[8px] text-[12px]/[14px] font-semibold',
          className,
        )}
      >
        {PodcastCategoryMap[selected]}
        <ArrowSVG className={clsx('w-[18px] fill-foreground', isOpen && 'rotate-180')} />
      </div>
      {isOpen && (
        <div className="absolute left-0 top-10 z-10 w-[216px] bg-audio-order text-[12px]/[12px] font-semibold shadow-lg">
          {PodcastCategoryList.map((key) => (
            <div
              key={key}
              className="cursor-pointer text-nowrap px-[8px] py-[14px] hover:bg-audio-border"
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
