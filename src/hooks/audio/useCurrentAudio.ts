import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  AUDIO_DISPATCH,
  audioControlsAtom,
  audioRefAtom,
  currentAudioAtom,
  currentPlayStatusAtom,
  currentTimeAtom,
  determineNextTrackAtom,
  durationAtom,
  playNextTrackAtom,
  progressAtom,
} from '@/atoms/audio-player';
import { GA_EVENT_LABELS, GA_EVENT_NAMES } from '@/constants/ga';
import { useGA } from '@/hooks/useGA';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { eventBus } from '@/components/event-bus/eventBus';
import { MessageType } from '@/components/event-bus/messageType';
import { useEventBus } from '@/components/event-bus/useEventBus';
import { useIsMobile } from '@/hooks/useIsMobile';

// Created on first use, not at import: an AudioContext made before any user gesture starts
// suspended and logs an autoplay warning on every page load.
let sharedAudioContext: AudioContext | null = null;
let sharedAnalyser: AnalyserNode | null = null;
export function getAudioContext() {
  sharedAudioContext ??= new (window.AudioContext || window.webkitAudioContext)();
  return sharedAudioContext;
}
function getAnalyser() {
  sharedAnalyser ??= getAudioContext().createAnalyser();
  return sharedAnalyser;
}
const approxVisualisationUpdateFrequency = 5;

const RA = (f: number) =>
  (12194 ** 2 * f ** 4) /
  ((f ** 2 + 20.6 ** 2) * Math.sqrt((f ** 2 + 107.7 ** 2) * (f ** 2 + 737.9 ** 2)) * (f ** 2 + 12194 ** 2));
const A = (f: number) => 20 * Math.log10(RA(f)) + 2.0;

const uint8TodB = (byteLevel: number) => {
  const analyser = getAnalyser();
  return (byteLevel / 255) * (analyser.maxDecibels - analyser.minDecibels) + analyser.minDecibels;
};

export default function useCurrentAudio() {
  const hasInteractedRef = useRef(false);
  const currentAudio = useAtomValue(currentAudioAtom);
  const playStatus = useAtomValue(currentPlayStatusAtom);
  const waveFormRef = useRef<Uint8Array>(new Uint8Array(0));
  const spectrumRef = useRef<Uint8Array>(new Uint8Array(0));
  const dBASpectrumRef = useRef<Float32Array>(new Float32Array(0));
  const lastExecutionTimeRef = useRef<number>(0);
  const weightingsRef = useRef<number[]>([-100]);
  const nextAudioRef = useRef<HTMLAudioElement | null>(null);
  const isPreloadingRef = useRef<boolean>(false);
  const isMobile = useIsMobile();

  const [audioRef, setAudioRef] = useAtom(audioRefAtom);
  const setProgress = useSetAtom(progressAtom);
  const setCurrentTime = useSetAtom(currentTimeAtom);
  const setDuration = useSetAtom(durationAtom);

  const [controls, dispatch] = useAtom(audioControlsAtom);
  const playNextTrack = useSetAtom(playNextTrackAtom);
  const determineNextTrack = useSetAtom(determineNextTrackAtom);

  const { trackEvent } = useGA();

  const preloadNextTrack = useCallback(() => {
    if (isPreloadingRef.current) return;

    const nextTrackToPlay = determineNextTrack();
    if (!nextTrackToPlay) return;

    isPreloadingRef.current = true;

    if (nextAudioRef.current) {
      nextAudioRef.current.src = '';
      nextAudioRef.current = null;
    }

    const nextAudio = new Audio();
    nextAudio.crossOrigin = 'anonymous';
    nextAudio.preload = 'auto';
    nextAudio.src = nextTrackToPlay.url;
    nextAudio.load();

    nextAudioRef.current = nextAudio;
  }, [determineNextTrack]);

  useEffect(() => {
    if (audioRef) {
      audioRef.pause();
      audioRef.src = '';
      audioRef.oncanplay = null;
      audioRef.ontimeupdate = null;
      audioRef.ondurationchange = null;
    }

    if (!currentAudio) return;

    isPreloadingRef.current = false;

    setProgress(0);
    setCurrentTime(0);
    setDuration(0);

    let audio;
    let isPreloaded = false;
    if (nextAudioRef.current && nextAudioRef.current.src === currentAudio.url) {
      audio = nextAudioRef.current;
      nextAudioRef.current = null;
      isPreloaded = true;
    } else {
      // preload 'none': nothing is downloaded until the visitor presses play (the first track is 5.6 MB).
      audio = new Audio();
      audio.crossOrigin = 'anonymous';
      audio.preload = 'none';
      audio.src = currentAudio.url;
    }

    audio.volume = 0.3;
    setAudioRef(audio);

    const setupAudio = () => {
      if (!isMobile) {
        const audioContext = getAudioContext();
        const analyser = getAnalyser();
        const source = audioContext.createMediaElementSource(audio);
        const sampleRate = audioContext.sampleRate;
        const totalNumberOfSamples = sampleRate / approxVisualisationUpdateFrequency;

        analyser.fftSize = 2 ** Math.floor(Math.log2(totalNumberOfSamples));

        for (let i = 1; i < analyser.frequencyBinCount; i++) {
          weightingsRef.current[i] = A((i * sampleRate) / 2 / analyser.frequencyBinCount);
        }

        waveFormRef.current = new Uint8Array(analyser.frequencyBinCount);
        spectrumRef.current = new Uint8Array(analyser.frequencyBinCount);
        dBASpectrumRef.current = new Float32Array(analyser.frequencyBinCount);

        source.connect(analyser);
        analyser.connect(audioContext.destination);
      }
      dispatch({ type: AUDIO_DISPATCH.PLAY, value: GA_EVENT_LABELS.MUSIC_AUTO_PLAY.AUTO });
    };

    if (isPreloaded && audio.readyState >= 1) {
      setupAudio();
      setDuration(audio.duration);
    } else {
      audio.onloadedmetadata = () => {
        setupAudio();
      };
    }

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? audio.currentTime / audio.duration : 0);

      if (audio.duration && audio.currentTime >= audio.duration - 20 && !isPreloadingRef.current) {
        preloadNextTrack();
      }

      if (isMobile) {
        eventBus.next({ type: MessageType.SIRI_WAVE_CONFIG, payload: { amplitude: 1.5, speed: 0.2 } });
        return;
      }

      const now = Date.now();
      if (now - lastExecutionTimeRef.current < 1000 / approxVisualisationUpdateFrequency) return;
      lastExecutionTimeRef.current = now;
      if (!spectrumRef.current.length) return;
      const audioContext = getAudioContext();
      const analyser = getAnalyser();
      const spectrum = spectrumRef.current;
      const waveForm = waveFormRef.current;
      const dBASpectrum = dBASpectrumRef.current;
      const sampleRate = audioContext.sampleRate;
      analyser.getByteFrequencyData(spectrum as Uint8Array<ArrayBuffer>);
      spectrum.forEach((byteLevel, idx) => {
        dBASpectrum[idx] = uint8TodB(byteLevel) + weightingsRef.current[idx];
      });
      const highestPowerBin = dBASpectrum.reduce(
        ([maxPower, iMax], y, idx) => (y > maxPower ? [y, idx] : [maxPower, iMax]),
        [-120, 0],
      )[1];
      const maxPowerFrequency = highestPowerBin * (sampleRate / 2 / analyser.frequencyBinCount);
      analyser.getByteTimeDomainData(waveForm as Uint8Array<ArrayBuffer>);
      const result = waveForm.reduce((acc, y) => Math.max(acc, y), 128) - 128;
      eventBus.next({
        type: MessageType.SIRI_WAVE_CONFIG,
        payload: { amplitude: (result / 128) * 10, speed: maxPowerFrequency / 2000 },
      });
    };

    audio.ondurationchange = () => {
      setDuration(audio.duration);
    };

    audio.onended = () => {
      trackEvent({ name: GA_EVENT_NAMES.MUSIC_PLAYER_END, label: currentAudio.title });
      playNextTrack();
    };

    audio.onpause = () => {
      dispatch({ type: AUDIO_DISPATCH.PAUSE });
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
  }, [currentAudio, isMobile]);

  // Sound is opt-in: music starts only from the player's own play control. (It used to start on
  // the visitor's first click anywhere on the page, which counts as autoplay under WCAG 1.4.2.)
  // The first interaction is still reported for analytics.
  useEffect(() => {
    const reportInteraction = () => {
      if (hasInteractedRef.current) return;
      hasInteractedRef.current = true;
      trackEvent({ name: GA_EVENT_NAMES.USER_INTERACT });
    };
    document.addEventListener('click', reportInteraction, { once: true });
    return () => document.removeEventListener('click', reportInteraction);
  }, [trackEvent]);

  // 清理预加载的资源
  useEffect(() => {
    return () => {
      if (nextAudioRef.current) {
        nextAudioRef.current.src = '';
        nextAudioRef.current = null;
      }
      isPreloadingRef.current = false;
    };
  }, []);

  useEventBus(MessageType.CHANGE_PLAY_STATUS, () => (hasInteractedRef.current = true));

  return useMemo(
    () => ({
      data: currentAudio,
      dispatch,
      // A getter, so the AudioContext is created when a control first reads it (inside a click handler).
      get audioContext() {
        return getAudioContext();
      },
      ...controls,
    }),
    [controls, currentAudio, dispatch],
  );
}
