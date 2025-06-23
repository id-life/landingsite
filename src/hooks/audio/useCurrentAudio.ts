import {
  audioControlsAtom,
  audioRefAtom,
  canPlayAtom,
  currentAudioAtom,
  currentPlayStatusAtom,
  currentTimeAtom,
  durationAtom,
  playNextTrackAtom,
  progressAtom,
} from '@/atoms/audio-player';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';
import { useGA } from '@/hooks/useGA';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useMemo, useState } from 'react';

export default function useCurrentAudio() {
  const [hasInteracted, setHasInteracted] = useState(false);
  const currentAudio = useAtomValue(currentAudioAtom);
  const [playStatus, setPlayStatus] = useAtom(currentPlayStatusAtom);

  const [audioRef, setAudioRef] = useAtom(audioRefAtom);
  const setCanPlay = useSetAtom(canPlayAtom);
  const setProgress = useSetAtom(progressAtom);
  const setCurrentTime = useSetAtom(currentTimeAtom);
  const setDuration = useSetAtom(durationAtom);

  const [controls, dispatch] = useAtom(audioControlsAtom);
  const playNextTrack = useSetAtom(playNextTrackAtom);

  const { trackEvent } = useGA();

  useEffect(() => {
    // 清除上一个音频实例
    if (audioRef) {
      audioRef.pause();
      audioRef.src = '';
      audioRef.oncanplay = null;
      audioRef.ontimeupdate = null;
      audioRef.ondurationchange = null;
    }

    if (!currentAudio) return;

    setCanPlay(false);
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);

    const audio = new Audio(currentAudio.url);
    audio.load();
    audio.volume = 0.5;
    setAudioRef(audio);

    audio.oncanplay = () => {
      setCanPlay(true);
      setPlayStatus(true);
    };

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    };

    audio.ondurationchange = () => {
      setDuration(audio.duration);
    };

    audio.onended = () => {
      // console.log('播放结束', currentAudio);
      // 播放结束埋点
      trackEvent({
        name: GA_EVENT_NAMES.MUSIC_PLAYER_END,
        label: currentAudio.title,
      });
      playNextTrack();
    };

    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
        audio.oncanplay = null;
        audio.ontimeupdate = null;
        audio.ondurationchange = null;
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAudio]);

  useEffect(() => {
    if (!audioRef || !controls.canPlay) return;
    if (playStatus) {
      const playPromise = audioRef.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setHasInteracted(true);
            // console.log('播放开始', currentAudio);
            trackEvent({
              name: GA_EVENT_NAMES.MUSIC_PLAYER_START,
              label: GA_EVENT_LABELS.MUSIC_PLAYER_START.START,
            });
          })
          .catch((error) => {
            console.error('播放失败:', error);
            setPlayStatus(false);
          });
      }
    } else {
      // console.log('播放暂停', currentAudio);
      audioRef.pause();
      trackEvent({
        name: GA_EVENT_NAMES.MUSIC_PLAYER_END,
        label: GA_EVENT_LABELS.MUSIC_PLAYER_START.PAUSE,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playStatus, controls.canPlay, audioRef, setPlayStatus, currentAudio]);

  useEffect(() => {
    const enableAutoplay = () => setHasInteracted(true);

    document.addEventListener('click', enableAutoplay);
    return () => {
      document.removeEventListener('click', enableAutoplay);
    };
  }, []);

  useEffect(() => {
    if (hasInteracted) {
      setPlayStatus(true);
    }
  }, [hasInteracted, setPlayStatus]);

  return useMemo(() => ({ data: currentAudio, ...controls }), [controls, currentAudio]);
}
