import React, { useMemo } from 'react';
import { MusicDataItem } from './music-data';
import clsx from 'clsx';

type DesktopMusicItemProps = {
  onClick?: () => void;
  data: MusicDataItem;
  currentMusicId?: number;
};

function DesktopMusicItem({ onClick, data, currentMusicId }: DesktopMusicItemProps) {
  const isCurrent = useMemo(() => currentMusicId === data.id, [currentMusicId, data.id]);

  return (
    <div className="">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-0.5">
          {isCurrent ? <img className="w-4" src="/svgs/player/play_status.svg" alt="" /> : null}

          <div onClick={onClick} className={clsx('cursor-pointer text-xs/5 font-semibold', isCurrent && 'text-red-600')}>
            <div></div>
            {data.title} - {data.artist}
          </div>
        </div>
        {isCurrent ? <img className="w-4 cursor-pointer" src="/svgs/player/play_download.svg" alt="" /> : null}
      </div>
      {isCurrent ? (
        <div className="relative mt-1">
          <div className="absolute left-0 top-0 h-full w-[31%] overflow-hidden bg-[url('/imgs/player/play_bg_red.png')] bg-cover" />
          <img className="w-full" src="/imgs/player/play_bg_gray.png" alt="" />
        </div>
      ) : null}
    </div>
  );
}
export default React.memo(DesktopMusicItem);
