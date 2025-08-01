import { useEffect, useMemo, useRef } from 'react';
import {
  AUDIO_DISPATCH,
  audioControlsAtom,
  audioRefAtom,
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
import { eventBus } from '@/components/event-bus/eventBus';
import { MessageType } from '@/components/event-bus/messageType';

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const approxVisualisationUpdateFrequency = 5;

const RA = (f: number) =>
  (12194 ** 2 * f ** 4) /
  ((f ** 2 + 20.6 ** 2) * Math.sqrt((f ** 2 + 107.7 ** 2) * (f ** 2 + 737.9 ** 2)) * (f ** 2 + 12194 ** 2));
const A = (f: number) => 20 * Math.log10(RA(f)) + 2.0;

const uint8TodB = (byteLevel: number) =>
  (byteLevel / 255) * (analyser.maxDecibels - analyser.minDecibels) + analyser.minDecibels;

export default function useCurrentAudio() {
  const hasInteractedRef = useRef(false);
  const currentAudio = useAtomValue(currentAudioAtom);
  const playStatus = useAtomValue(currentPlayStatusAtom);
  const waveFormRef = useRef<Uint8Array>(new Uint8Array(analyser.frequencyBinCount));
  const spectrumRef = useRef<Uint8Array>(new Uint8Array(analyser.frequencyBinCount));
  const dBASpectrumRef = useRef<Float32Array>(new Float32Array(analyser.frequencyBinCount));
  const lastExecutionTimeRef = useRef<number>(0);
  const weightingsRef = useRef<number[]>([-100]);

  const [audioRef, setAudioRef] = useAtom(audioRefAtom);
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

    setProgress(0);
    setCurrentTime(0);
    setDuration(0);

    const audio = new Audio(currentAudio.url);
    audio.crossOrigin = 'anonymous';
    audio.load();
    audio.volume = 0.5;
    setAudioRef(audio);

    audio.onloadedmetadata = () => {
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
      dispatch({ type: AUDIO_DISPATCH.PLAY, value: GA_EVENT_LABELS.MUSIC_AUTO_PLAY.AUTO });
    };

    audio.ontimeupdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress(audio.duration ? audio.currentTime / audio.duration : 0);
      const now = Date.now();
      if (now - lastExecutionTimeRef.current < 1000 / approxVisualisationUpdateFrequency) return;
      lastExecutionTimeRef.current = now;
      const spectrum = spectrumRef.current;
      const waveForm = waveFormRef.current;
      const dBASpectrum = dBASpectrumRef.current;
      const sampleRate = audioContext.sampleRate;
      analyser.getByteFrequencyData(spectrum);
      spectrum.forEach((byteLevel, idx) => {
        dBASpectrum[idx] = uint8TodB(byteLevel) + weightingsRef.current[idx];
      });
      const highestPowerBin = dBASpectrum.reduce(
        ([maxPower, iMax], y, idx) => (y > maxPower ? [y, idx] : [maxPower, iMax]),
        [-120, 0],
      )[1];
      const maxPowerFrequency = highestPowerBin * (sampleRate / 2 / analyser.frequencyBinCount);
      analyser.getByteTimeDomainData(waveForm);
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
    const enableAutoplay = () => {
      if (hasInteractedRef.current) return;
      hasInteractedRef.current = true;
      trackEvent({ name: GA_EVENT_NAMES.USER_INTERACT });
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      if (!playStatus) {
        dispatch({ type: AUDIO_DISPATCH.PLAY, value: GA_EVENT_LABELS.MUSIC_AUTO_PLAY.INTERACT });
      }
    };
    document.addEventListener('click', enableAutoplay, { once: true });

    return () => {
      document.removeEventListener('click', enableAutoplay);
    };
  }, [dispatch, playStatus, trackEvent]);

  return useMemo(
    () => ({
      data: currentAudio,
      dispatch,
      audioContext,
      ...controls,
    }),
    [controls, currentAudio, dispatch],
  );
}
