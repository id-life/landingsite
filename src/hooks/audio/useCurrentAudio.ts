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
  PLAY_TRIGGER,
  progressAtom,
} from '@/atoms/audio-player';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { eventBus } from '@/components/event-bus/eventBus';
import { MessageType } from '@/components/event-bus/messageType';
import { useEventBus } from '@/components/event-bus/useEventBus';
import { useIsMobile } from '@/hooks/useIsMobile';
import type { AudioDataItem } from '@/apis/types';

// Created on first use, not at import: an AudioContext made before any user gesture starts
// suspended and logs an autoplay warning on every page load.
let sharedAudioContext: AudioContext | null = null;
let sharedAnalyser: AnalyserNode | null = null;
export function getAudioContext() {
  // Safari before 14.1 only has the prefixed constructor.
  const AudioContextClass =
    window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext!;
  sharedAudioContext ??= new AudioContextClass();
  return sharedAudioContext;
}
function getAnalyser() {
  sharedAnalyser ??= getAudioContext().createAnalyser();
  return sharedAnalyser;
}
const approxVisualisationUpdateFrequency = 5;

// Play pressed before the player list has arrived (it is fetched only on intent). iOS lets a media element play
// later, outside the gesture, only if play() or load() ran on it inside a gesture, so the element is created and
// primed in the press and adopted for the first track once the list is in.
let primedAudio: HTMLAudioElement | null = null;
let playWhenReady = false;
export function requestPlayWhenReady() {
  playWhenReady = true;
  if (primedAudio) return;
  const audio = new Audio();
  audio.crossOrigin = 'anonymous';
  audio.preload = 'none';
  audio.load();
  primedAudio = audio;
}
/** Pressed again before the list arrived: the visitor changed their mind, so nothing starts when it does. */
export function cancelPlayWhenReady() {
  playWhenReady = false;
}
export const isPlayWhenReadyPending = () => playWhenReady;

// Where the player was when its element was last let go: the player unmounts when the visitor goes to another page of
// the site (and when it moves between the laptop and phone layouts), and the next player to mount picks up the same
// track at the same place, playing only if it was playing. hasLoadedTrack: the first track the page loads stays
// silent and undownloaded until the visitor presses play.
let leftAt: { id: AudioDataItem['id']; time: number; playing: boolean } | null = null;
let hasLoadedTrack = false;

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
      // Its pause event arrives after the next track is current and would pause that one.
      audioRef.onpause = null;
      audioRef.onplay = null;
    }

    if (!currentAudio) return;

    // The same track as when the player was let go (the visitor back from another page, or the layout changed):
    // it resumes where it was, and plays only if it was playing. Any other change of track after the first one is the
    // visitor's choice (a playlist row) or the next track at the end of one, and plays at once, as the player always
    // has. The very first track waits for the play button: sound is opt-in.
    const resume = leftAt && leftAt.id === currentAudio.id ? leftAt : null;
    const startOnLoad = resume ? resume.playing : hasLoadedTrack;
    hasLoadedTrack = true;
    leftAt = null;

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
    } else if (primedAudio) {
      audio = primedAudio;
      primedAudio = null;
      audio.src = currentAudio.url;
    } else {
      // preload 'none': nothing is downloaded until the visitor presses play (the first track is 5.6 MB).
      audio = new Audio();
      audio.crossOrigin = 'anonymous';
      audio.preload = 'none';
      audio.src = currentAudio.url;
    }

    audio.volume = 0.3;
    if (resume && resume.time > 0) {
      // Honoured once the element loads (the default playback start position), so nothing is downloaded early.
      audio.currentTime = resume.time;
      setCurrentTime(resume.time);
    }
    // Set when the visitor pauses this track; the start-on-ready below must not undo it. (A pause between
    // pressing play and the metadata arriving used to be overridden when the metadata came in.)
    let pausedByVisitor = false;
    setAudioRef(audio);
    if (playWhenReady) {
      playWhenReady = false;
      dispatch({ type: AUDIO_DISPATCH.PLAY, value: PLAY_TRIGGER.TOGGLE });
    } else if (startOnLoad) {
      // play() starts the download of a preload="none" element; waiting for its metadata instead never ends, because
      // such an element fetches nothing until it is asked to play.
      dispatch({ type: AUDIO_DISPATCH.PLAY, value: PLAY_TRIGGER.AUTO });
    }

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
      if (!pausedByVisitor) dispatch({ type: AUDIO_DISPATCH.PLAY, value: PLAY_TRIGGER.AUTO });
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
      const total = audio.duration;
      setProgress(total ? audio.currentTime / total : 0);

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
      playNextTrack();
    };

    audio.onplay = () => {
      pausedByVisitor = false;
    };

    audio.onpause = () => {
      // The pause that precedes 'ended' is the track finishing, not the visitor.
      if (!audio.ended) pausedByVisitor = true;
      dispatch({ type: AUDIO_DISPATCH.PAUSE });
    };

    return () => {
      if (audio) {
        leftAt = { id: currentAudio.id, time: audio.currentTime, playing: !audio.paused };
        audio.pause();
        audio.src = '';
        audio.oncanplay = null;
        audio.ontimeupdate = null;
        audio.ondurationchange = null;
        audio.onpause = null;
        audio.onplay = null;
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAudio, isMobile]);

  // Sound is opt-in: music starts only from the player's own play control. (It used to start on
  // the visitor's first click anywhere on the page, which counts as autoplay under WCAG 1.4.2.)
  // The first-click user_interact event was noise and is gone (DATA-11).

  // Pause while the tab is hidden; resume on return only if it was playing.
  const audioRefRef = useRef(audioRef);
  audioRefRef.current = audioRef;
  useEffect(() => {
    let resumeOnShow = false;
    const onVisibilityChange = () => {
      const audio = audioRefRef.current;
      if (document.hidden) {
        if (audio && !audio.paused) {
          resumeOnShow = true;
          dispatch({ type: AUDIO_DISPATCH.PAUSE });
        }
      } else if (resumeOnShow) {
        resumeOnShow = false;
        dispatch({ type: AUDIO_DISPATCH.PLAY, value: 'resume' });
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, [dispatch]);

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
