import React, { useState } from 'react';
import { clsx } from 'clsx';
import { useAtom, useSetAtom } from 'jotai';
import { currentPlayListAtom, currentPlayPodcastAtom, PlayList, PlayPodcastKey } from '@/atoms/audio-player';
import ArrowSVG from '@/../public/svgs/player/arrow.svg?component';
import { useGA } from '@/hooks/useGA';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';

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
  const { trackEvent } = useGA();

  const handleChangePodcast = (key: PlayPodcastKey) => {
    setSelected(key);
    setIsOpen(false);
    if (key === PlayList.PODCAST_ID) {
      trackEvent({
        name: GA_EVENT_NAMES.PODCAST_MENU,
        label: GA_EVENT_LABELS.PODCAST_MENU.IMMORTAL_DRAGONS,
      });
      setCurrentPlayList(PlayList.PODCAST_ID);
    }
    if (key === PlayList.PODCAST_LT) {
      trackEvent({
        name: GA_EVENT_NAMES.PODCAST_MENU,
        label: GA_EVENT_LABELS.PODCAST_MENU.LONG_TALK,
      });
      setCurrentPlayList(PlayList.PODCAST_LT);
    }
  };

  return (
    <div className="relative w-full">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'relative cursor-pointer gap-[4px] rounded-full bg-audio-order p-[8px] text-center text-[12px]/[14px] font-semibold',
          className,
        )}
      >
        {PodcastCategoryMap[selected]}
        <ArrowSVG className={clsx('absolute right-[8px] top-[6px] w-[18px] fill-foreground', isOpen && 'rotate-180')} />
      </div>
      {isOpen && (
        <div className="absolute left-0 top-[38px] z-10 w-full bg-audio-order text-center text-[12px]/[12px] font-semibold shadow-lg">
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
