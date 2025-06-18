import React, { useEffect, useMemo, useRef } from 'react';
import clsx from 'clsx';
import { useAtomValue } from 'jotai';
import WaveSurfer from 'wavesurfer.js';
import { AudioDataItem } from '@/apis/types';
import { downloadFile } from '@/utils/download';
import { audioControlsAtom, currentPlayStatusAtom } from '@/atoms/audio-player';

type DesktopMusicItemProps = {
  onClick?: () => void;
  data: AudioDataItem;
  currentMusicId?: number;
  onSeekTo?: (value: number) => void;
  className?: string;
};

function DesktopMusicItem({ onClick, data, currentMusicId, onSeekTo, className }: DesktopMusicItemProps) {
  const controls = useAtomValue(audioControlsAtom);
  const playStatus = useAtomValue(currentPlayStatusAtom);
  const isCurrent = useMemo(() => currentMusicId === data.id, [currentMusicId, data.id]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  const handleDownload = () => {
    if (!data) return;
    downloadFile(data.url, `${data.title}-${data.artist}`);
  };

  useEffect(() => {
    if (wavesurferRef.current) return;
    if (!containerRef.current || !isCurrent) return;
    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      height: 'auto',
      waveColor: '#BDBDBD',
      progressColor: '#C11111',
      cursorWidth: 0,
      barWidth: 2,
      barGap: 2,
      barAlign: 'bottom',
      url: data.url,
    });
    wavesurfer.setMuted(true);
    wavesurfer.on('interaction', (newTime) => {
      onSeekTo?.(newTime);
    });
    wavesurferRef.current = wavesurfer;
  }, [data.url, isCurrent, onSeekTo]);

  useEffect(() => {
    if (!wavesurferRef.current) return;
    if (playStatus && isCurrent) {
      wavesurferRef.current.setTime(controls.currentTime);
    }
  }, [playStatus, isCurrent, controls.currentTime]);

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-0.5">
          {isCurrent ? <img className="w-4" src="/svgs/player/play_status.svg" alt="" /> : null}
          <div
            onClick={onClick}
            className={clsx('cursor-pointer truncate text-xs/5 font-semibold', isCurrent && 'text-red-600')}
          >
            {data.title} - {data.artist}
          </div>
        </div>
        {isCurrent ? (
          <img onClick={handleDownload} className="w-4 cursor-pointer" src="/svgs/player/play_download.svg" alt="" />
        ) : null}
      </div>
      <div ref={containerRef} className={clsx('relative mt-1 h-5 cursor-pointer overflow-hidden', !isCurrent && 'hidden')} />
    </div>
  );
}

export default React.memo(DesktopMusicItem);
