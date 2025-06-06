import React, { useMemo } from 'react';
import clsx from 'clsx';
import { useAtomValue } from 'jotai';
import { AudioDataItem } from './audio-data';
import { downloadFile } from '@/utils/download';
import { audioControlsAtom } from '@/atoms/audio-player';

type DesktopMusicItemProps = {
  onClick?: () => void;
  data: AudioDataItem;
  currentMusicId?: number;
  onProgressChange?: (value: number) => void;
};

function DesktopMusicItem({ onClick, data, currentMusicId, onProgressChange }: DesktopMusicItemProps) {
  const controls = useAtomValue(audioControlsAtom);
  const isCurrent = useMemo(() => currentMusicId === data.id, [currentMusicId, data.id]);

  const handleDownload = () => {
    if (!data) return;
    downloadFile(data.url, `${data.title}-${data.artist}`);
  };

  const handleProgressChange = (event: React.MouseEvent<HTMLDivElement>) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - left;
    const progress = x / width;
    onProgressChange?.(progress);
  };

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
        {isCurrent ? (
          <img onClick={handleDownload} className="w-4 cursor-pointer" src="/svgs/player/play_download.svg" alt="" />
        ) : null}
      </div>
      {isCurrent ? (
        <div onClick={handleProgressChange} className="relative mt-1 cursor-pointer overflow-hidden">
          <img
            style={{ clipPath: `inset(0 calc(100% - ${controls.progress * 100}%) 0 0)` }}
            className="absolute left-0 top-0 w-full object-cover"
            src="/imgs/player/play_bg_red.png"
            alt=""
          />
          <img className="w-full object-cover" src="/imgs/player/play_bg_gray.png" alt="" />
        </div>
      ) : null}
    </div>
  );
}
export default React.memo(DesktopMusicItem);
