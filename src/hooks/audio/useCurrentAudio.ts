import { useEffect } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { currentAudioAtom, currentPlayStatusAtom, PlayModeKey, playNextTrackAtom } from '@/atoms/audio-player';
import {
  audioRefAtom,
  canPlayAtom,
  progressAtom,
  currentTimeAtom,
  durationAtom,
  audioControlsAtom,
} from '@/atoms/audio-player';

export default function useCurrentAudio() {
  const currentAudio = useAtomValue(currentAudioAtom);
  const playStatus = useAtomValue(currentPlayStatusAtom);

  const [audioRef, setAudioRef] = useAtom(audioRefAtom);
  const setCanPlay = useSetAtom(canPlayAtom);
  const setProgress = useSetAtom(progressAtom);
  const setCurrentTime = useSetAtom(currentTimeAtom);
  const setDuration = useSetAtom(durationAtom);

  const [controls, dispatch] = useAtom(audioControlsAtom);
  const playNextTrack = useSetAtom(playNextTrackAtom);

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
    setAudioRef(audio);

    audio.oncanplay = () => {
      setCanPlay(true);
    };

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    };

    audio.ondurationchange = () => {
      setDuration(audio.duration);
    };

    audio.onended = () => {
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
        playPromise.catch((error) => {
          console.error('播放失败:', error);
        });
      }
    } else {
      audioRef.pause();
    }
  }, [playStatus, controls.canPlay, audioRef]);

  const seekTo = (value: number) => {
    dispatch({ type: 'SEEK_TO', value });
  };

  const nextTrack = () => {
    dispatch({ type: 'PLAY_NEXT' });
  };

  const setPlayMode = (mode: PlayModeKey) => {
    dispatch({ type: 'SET_PLAY_MODE', value: mode });
  };

  return {
    data: currentAudio,
    ...controls,
    seekTo,
    nextTrack,
    setPlayMode,
  };
}
