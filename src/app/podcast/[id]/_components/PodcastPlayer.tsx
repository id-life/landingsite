'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { PodcastItem } from '@/apis/types';
import dayjsDuration from 'dayjs/plugin/duration';
import { useEventBus } from '@/components/event-bus/useEventBus';
import { MessageType } from '@/components/event-bus/messageType';
import PlaySVG from '@/../public/svgs/player/play.svg?component';
import PauseSVG from '@/../public/svgs/player/pause.svg?component';
import PodcastSiriWave from '@/app/podcast/[id]/_components/PodcastSiriWave';

dayjs.extend(dayjsDuration);

type PodcastPlayerProps = {
  data: PodcastItem;
};

export default function PodcastPlayer({ data }: PodcastPlayerProps) {
  const [playStatus, setPlayStatus] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);

  const handleProgressChange = (event: React.MouseEvent<HTMLDivElement>) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - left;
    const progress = x / width;
    const seekTo = progress * data.duration;
    handleSeekTo(seekTo);
  };

  const handlePlayClick = () => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    if (audio.paused) {
      audio.play().then();
      setPlayStatus(true);
    } else {
      audio.pause();
      setPlayStatus(false);
    }
  };

  const handleTimeUpdate = useCallback(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;

    const percent = audio.currentTime / audio.duration;
    setProgress(percent);
  }, []);

  const handlePlayEnd = useCallback(() => {
    setPlayStatus(false);
  }, []);

  const handleSeekTo = (time: number) => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    const percent = time / audio.duration;

    audio.currentTime = time;
    setProgress(percent);

    if (audio.paused) {
      audio.play().then();
      setPlayStatus(true);
    }
  };

  useEventBus(MessageType.PODCAST_DURATION, (timeStr: string) => {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    handleSeekTo(minutes * 60 + seconds);
  });

  useEffect(() => {
    if (!audioRef.current) return;
    const audio = audioRef.current;
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handlePlayEnd);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handlePlayEnd);
    };
  }, [handleTimeUpdate, handlePlayEnd]);

  return (
    <div className="fixed bottom-7.5 left-1/2 flex h-[40px] -translate-x-1/2 items-center justify-center rounded-full bg-gray-750">
      <audio autoPlay={false} className="hidden" ref={audioRef}>
        <source src={data.url} />
      </audio>
      <PodcastSiriWave status={playStatus} />
      <div onClick={handlePlayClick} className="size-[30px] cursor-pointer">
        {playStatus ? <PauseSVG className="size-full fill-white" /> : <PlaySVG className="size-full fill-white" />}
      </div>
      <div
        onClick={handleProgressChange}
        className="mx-[12px] flex h-[16px] w-[300px] cursor-pointer items-center justify-start"
      >
        <div className="relative h-[2px] w-full bg-[#57595C]">
          <div style={{ width: `${progress * 100}%` }} className="absolute left-0 top-0 h-[2px] bg-red-800" />
          <div
            style={{
              left: `${progress * 100}%`,
              background: 'linear-gradient(180deg, rgba(193, 17, 17, 0) 0%, #FF1717 50%, rgba(193, 17, 17, 0) 100%)',
            }}
            className="absolute top-1/2 h-[16px] w-[2px] -translate-y-1/2"
          />
        </div>
      </div>
      <div className="mr-3 flex items-center justify-between text-xs/3.5 font-medium text-gray-350">
        <p className="w-[36px] text-white">{dayjs.duration(audioRef.current?.currentTime ?? 0, 'seconds').format('mm:ss')}</p>
        <p>/&nbsp;{dayjs.duration(data.duration, 'seconds').format('mm:ss')}</p>
      </div>
    </div>
  );
}
