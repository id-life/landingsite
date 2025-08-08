'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { PodcastItem } from '@/apis/types';
import dayjsDuration from 'dayjs/plugin/duration';
import { useEventBus } from '@/components/event-bus/useEventBus';
import { MessageType } from '@/components/event-bus/messageType';
import PlaySVG from '@/../public/svgs/player/play.svg?component';
import PauseSVG from '@/../public/svgs/player/pause.svg?component';
import PodcastSiriWave from '@/app/podcast/[id]/_components/PodcastSiriWave';
import { useGA } from '@/hooks/useGA';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';

dayjs.extend(dayjsDuration);

type PodcastPlayerProps = {
  data: PodcastItem;
};

export default function PodcastPlayer({ data }: PodcastPlayerProps) {
  const { trackEvent } = useGA();
  const [playStatus, setPlayStatus] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const episode = useMemo(() => `${data.category.split('_')[1]}_${data.title}`, [data]);

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
      trackEvent({
        name: GA_EVENT_NAMES.EPISODE_PLAY,
        label: GA_EVENT_LABELS.EPISODE_PLAY.START,
        podcast_episode: episode,
      });
      audio.play().then();
      setPlayStatus(true);
    } else {
      trackEvent({
        name: GA_EVENT_NAMES.EPISODE_PLAY,
        label: GA_EVENT_LABELS.EPISODE_PLAY.PAUSE,
        podcast_episode: episode,
      });
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
    trackEvent({
      name: GA_EVENT_NAMES.EPISODE_END,
      label: episode,
    });
    setPlayStatus(false);
  }, [episode, trackEvent]);

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
    <div className="fixed bottom-7.5 left-1/2 w-full max-w-136 -translate-x-1/2 px-3 mobile:bottom-3">
      <div className="flex-center h-10 rounded-full bg-gray-750">
        <audio autoPlay={false} className="hidden" ref={audioRef}>
          <source src={data.url} />
        </audio>
        <PodcastSiriWave status={playStatus} />
        <div onClick={handlePlayClick} className="size-7.5 cursor-pointer">
          {playStatus ? <PauseSVG className="size-full fill-white" /> : <PlaySVG className="size-full fill-white" />}
        </div>
        <div
          onClick={handleProgressChange}
          className="mx-3 flex h-4 w-full max-w-75 flex-1 cursor-pointer items-center justify-start mobile:h-3"
        >
          <div className="relative h-0.5 w-full bg-[#57595C]">
            <div style={{ width: `${progress * 100}%` }} className="absolute left-0 top-0 h-0.5 bg-red-800" />
            <div
              style={{
                left: `${progress * 100}%`,
                background: 'linear-gradient(180deg, rgba(193, 17, 17, 0) 0%, #FF1717 50%, rgba(193, 17, 17, 0) 100%)',
              }}
              className="absolute top-1/2 h-4 w-0.5 -translate-y-1/2"
            />
          </div>
        </div>
        <div className="mr-3 flex items-center justify-between text-xs/3.5 font-medium text-gray-350">
          <p className="w-9 text-white">{dayjs.duration(audioRef.current?.currentTime ?? 0, 'seconds').format('mm:ss')}</p>
          <p>/&nbsp;{dayjs.duration(data.duration, 'seconds').format('mm:ss')}</p>
        </div>
      </div>
    </div>
  );
}
