import React, { useEffect, useMemo, useRef } from 'react';
import clsx from 'clsx';
import { useAtomValue } from 'jotai';
import WaveSurfer from 'wavesurfer.js';
import { AudioDataItem } from '@/apis/types';
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

  useEffect(() => {
    if (wavesurferRef.current) return;
    if (!containerRef.current || !isCurrent) return;
    const wavesurfer = WaveSurfer.create({
      container: containerRef.current,
      height: 'auto',
      waveColor: '#57595C',
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
      <div className="flex items-center justify-between gap-[2px]">
        {isCurrent ? <img className="w-[16px]" src="/svgs/player/play_status.svg" alt="" /> : null}
        <div
          onClick={onClick}
          className={clsx(
            'flex-1 cursor-pointer truncate text-[12px]/[20px] font-semibold hover:text-red-600',
            isCurrent && 'text-red-600',
          )}
        >
          {data.title} - {data.artist}
        </div>
      </div>
      <div
        ref={containerRef}
        className={clsx('relative mt-[4px] h-[20px] cursor-pointer overflow-hidden', !isCurrent && 'hidden')}
      />
    </div>
  );
}

export default React.memo(DesktopMusicItem);
