'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PodcastItem } from '@/apis/types';
import { useEventBus } from '@/components/event-bus/useEventBus';
import { MessageType } from '@/components/event-bus/messageType';
import PlaySVG from '@/../public/svgs/player/play.svg?component';
import PauseSVG from '@/../public/svgs/player/pause.svg?component';
import PodcastSiriWave from '@/app/podcast/[id]/_components/PodcastSiriWave';
import { useAudioAnalytics } from '@/hooks/audio/useAudioAnalytics';
import { formatPlaybackTime } from '@/utils/podcast';

type PodcastPlayerProps = {
  data: PodcastItem;
};

export default function PodcastPlayer({ data }: PodcastPlayerProps) {
  const [playStatus, setPlayStatus] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  // Listening is counted from the element (DATA-12): the button, the progress bar and a show-notes timestamp alike.
  useAudioAnalytics(audioRef, {
    episode_id: String(data.id),
    show: data.category,
    source: 'episode_page',
    duration: data.duration,
  });

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
    <div className="fixed bottom-7.5 left-1/2 w-full max-w-136 -translate-x-1/2 px-3 mobile:bottom-3">
      <div className="flex-center h-10 rounded-full bg-tone-750">
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
          <div className="relative h-0.5 w-full bg-tone-650">
            <div style={{ width: `${progress * 100}%` }} className="absolute left-0 top-0 h-0.5 bg-accent" />
            <div
              style={{
                left: `${progress * 100}%`,
                background:
                  'linear-gradient(180deg, rgba(193, 17, 17, 0) 0%, var(--color-accent) 50%, rgba(193, 17, 17, 0) 100%)',
              }}
              className="absolute top-1/2 h-4 w-0.5 -translate-y-1/2"
            />
          </div>
        </div>
        <div className="mr-3 flex items-center justify-between text-xs/3.5 font-medium text-tone-350">
          <p className="w-12 text-white">{formatPlaybackTime(audioRef.current?.currentTime ?? 0)}</p>
          <p>/&nbsp;{formatPlaybackTime(data.duration)}</p>
        </div>
      </div>
    </div>
  );
}
