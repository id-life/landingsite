import { useEffect, useMemo, useState } from 'react';
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
        playPromise
          .then(() => {
            setHasInteracted(true);
          })
          .catch((error) => {
            console.error('播放失败:', error);
            setPlayStatus(false);
          });
      }
    } else {
      audioRef.pause();
    }
  }, [playStatus, controls.canPlay, audioRef, setPlayStatus]);

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
