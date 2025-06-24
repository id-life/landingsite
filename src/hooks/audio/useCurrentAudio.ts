import { useEffect, useMemo, useState } from 'react';
import {
  AUDIO_DISPATCH,
  audioControlsAtom,
  audioRefAtom,
  canPlayAtom,
  currentAudioAtom,
  currentPlayStatusAtom,
  currentTimeAtom,
  durationAtom,
  lastPlayStatusAtom,
  playNextTrackAtom,
  progressAtom,
} from '@/atoms/audio-player';
import { GA_EVENT_NAMES } from '@/constants/ga';
import { useGA } from '@/hooks/useGA';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

export default function useCurrentAudio() {
  const [hasInteracted, setHasInteracted] = useState(false);
  const currentAudio = useAtomValue(currentAudioAtom);
  const [playStatus, setPlayStatus] = useAtom(currentPlayStatusAtom);
  const [lastPlayStatus, setLastPlayStatus] = useAtom(lastPlayStatusAtom);

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
      if (!lastPlayStatus) return;
      dispatch({ type: AUDIO_DISPATCH.PLAY });
    };

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
    };

    audio.ondurationchange = () => {
      setDuration(audio.duration);
    };

    audio.onended = () => {
      trackEvent({ name: GA_EVENT_NAMES.MUSIC_PLAYER_END, label: currentAudio.title });
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
    if (!audioRef || !controls.canPlay || !lastPlayStatus) return;
    if (playStatus) {
      const playPromise = audioRef.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setLastPlayStatus(true)).catch(() => setPlayStatus(false));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playStatus, controls.canPlay, audioRef, setPlayStatus, lastPlayStatus]);

  useEffect(() => {
    const savePlayStatus = () => setLastPlayStatus(playStatus);
    window.addEventListener('beforeunload', savePlayStatus);
    return () => {
      window.removeEventListener('beforeunload', savePlayStatus);
    };
  }, [playStatus, setLastPlayStatus]);

  useEffect(() => {
    const enableAutoplay = () => {
      if (hasInteracted || !lastPlayStatus || playStatus) return;
      setPlayStatus(true);
      setHasInteracted(true);
    };
    document.addEventListener('click', enableAutoplay);
    return () => {
      document.removeEventListener('click', enableAutoplay);
    };
  }, [hasInteracted, lastPlayStatus, playStatus, setPlayStatus]);

  return useMemo(() => ({ data: currentAudio, dispatch, ...controls }), [controls, currentAudio, dispatch]);
}
