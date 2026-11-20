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
import { firstClickStarts, isOnMedia, otherSoundInPage, startAtLoad } from '@/hooks/audio/firstClick';
import { NAV_LIST } from '@/components/nav/nav';
import { controlShowsPause } from '@/hooks/audio/controlState';
import { wakeMotion } from '@/motion/runtime';

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

// The first click anywhere on the home page starts the music (firstClick.ts). Once per page load: the module lives as
// long as the page, so coming back to the home page from another page of the site does not count a new first click.
let firstClickHandled = false;
let playerUsed = false;

/**
 * The visitor came to the home page from another page of the site and had already clicked or typed in this page load
 * (on the news list, an article, an episode): that earlier press was the first click, and the music starts as the
 * home page's player gets its first track, as on the owner's site. Landing on the home page itself (any of its
 * sections) does not count: there only a click starts it, not a key.
 */
function arrivedAfterAPress() {
  if (firstClickHandled || playerUsed) return false;
  const entry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  let landedOn = '';
  try {
    landedOn = entry ? new URL(entry.name).pathname : '';
  } catch {
    return false;
  }
  const landedOnHome = NAV_LIST.some((item) => item.href === landedOn);
  return !!landedOn && !landedOnHome && !!navigator.userActivation?.hasBeenActive;
}

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
  const setPlayStatus = useSetAtom(currentPlayStatusAtom);

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
      audioRef.onerror = null;
    }

    if (!currentAudio) return;

    // The same track as when the player was let go (the visitor back from another page, or the layout changed):
    // it resumes where it was, and plays only if it was playing. Any other change of track after the first one is the
    // visitor's choice (a playlist row) or the next track at the end of one, and plays at once, as the player always
    // has. The very first track waits for the first click (below), unless that click came on another page of the site.
    const resume = leftAt && leftAt.id === currentAudio.id ? leftAt : null;
    const firstOfPageLoad = !resume && !hasLoadedTrack;
    const firstClickBefore = !resume && !hasLoadedTrack && arrivedAfterAPress() && !otherSoundInPage(document);
    if (firstClickBefore) firstClickHandled = true;
    const startOnLoad = resume ? resume.playing : hasLoadedTrack || firstClickBefore;
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
      // The first track of a page load asks only for its metadata (the start of the file), so that the first click can
      // start it at once; nothing more is downloaded until it plays. Any other track is created as it is chosen or
      // reached and plays at once, so it asks for nothing ahead of that.
      audio = new Audio();
      audio.crossOrigin = 'anonymous';
      audio.preload = firstOfPageLoad && !startOnLoad ? 'metadata' : 'none';
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
    const playPressedEarly = playWhenReady;
    if (playWhenReady) {
      playWhenReady = false;
      dispatch({ type: AUDIO_DISPATCH.PLAY, value: PLAY_TRIGGER.TOGGLE });
    } else if (startOnLoad) {
      // play() starts the download of a preload="none" element; waiting for its metadata instead never ends, because
      // such an element fetches nothing until it is asked to play.
      dispatch({ type: AUDIO_DISPATCH.PLAY, value: PLAY_TRIGGER.AUTO });
    }

    // The start at load, as on the owner's site: once per page load, when the first track arrives, the player tries
    // to play. A browser that allows sound without a click (it has played this site for the visitor before) lets it
    // start; the usual browser refuses at once, nothing is downloaded, the button stays on play, nothing retries it,
    // and the first click starts it (above). Never in a tab nobody is looking at (opened in the background): the try
    // waits until the tab is first shown. Never over another sound, and never once the visitor has clicked or used
    // the player.
    let stopWaitingForShow = () => {};
    const atLoad = startAtLoad({ firstOfPageLoad, alreadyStarting: startOnLoad || playPressedEarly, hidden: document.hidden });
    if (atLoad !== 'never') {
      const attempt = () => {
        const allowed = firstClickStarts({
          handled: firstClickHandled,
          playerUsed,
          musicPlaying: !audio.paused || isPlayWhenReadyPending(),
          otherMediaPlaying: otherSoundInPage(document),
          onMedia: false,
        });
        if (!allowed) return;
        const started = audio.play();
        // A browser that allows it unpauses the element at once (the file may still be loading); one that refuses
        // leaves it paused. The control follows at once, not when the sound begins.
        if (controlShowsPause(audio)) {
          firstClickHandled = true;
          setPlayStatus(true);
        }
        started.catch(() => {
          // Refused (no permission to play without a click): the first click starts it.
          setPlayStatus(controlShowsPause(audio));
        });
      };
      if (atLoad === 'now') attempt();
      else {
        const onShow = () => {
          if (document.hidden) return;
          stopWaitingForShow();
          attempt();
        };
        document.addEventListener('visibilitychange', onShow);
        stopWaitingForShow = () => document.removeEventListener('visibilitychange', onShow);
      }
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
      // Only an element that was asked to play goes on playing here (metadata now arrives for the first track before
      // any input, and must not start it).
      if (!pausedByVisitor && !audio.paused) dispatch({ type: AUDIO_DISPATCH.PLAY, value: PLAY_TRIGGER.AUTO });
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

    // A track starting or stopping changes what the player shows, also when no input caused it (the next track of
    // the playlist, a hardware media key): the experience's idle pause wakes for it (MOT-03).
    audio.onplay = () => {
      pausedByVisitor = false;
      // Whatever started it (a press, a hardware media key, the next track), the control shows it.
      setPlayStatus(controlShowsPause(audio));
      wakeMotion();
    };

    audio.onpause = () => {
      wakeMotion();
      // The pause that precedes 'ended' is the track finishing, not the visitor.
      if (!audio.ended) pausedByVisitor = true;
      dispatch({ type: AUDIO_DISPATCH.PAUSE });
    };

    // The file cannot be loaded (network, blocked, missing): nothing can play, so the control goes back to play.
    audio.onerror = () => {
      dispatch({ type: AUDIO_DISPATCH.PAUSE });
    };

    return () => {
      stopWaitingForShow();
      if (audio) {
        leftAt = { id: currentAudio.id, time: audio.currentTime, playing: !audio.paused };
        audio.pause();
        audio.src = '';
        audio.oncanplay = null;
        audio.ontimeupdate = null;
        audio.ondurationchange = null;
        audio.onpause = null;
        audio.onplay = null;
        audio.onerror = null;
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAudio, isMobile]);

  const audioRefRef = useRef(audioRef);
  audioRefRef.current = audioRef;

  // The music starts at the visitor's first click anywhere on the page, as the owner's site does (his answer 5a): a
  // press on empty page, a link, the menu or the playlist button (the play button starts it by itself). Keys, the
  // wheel and swipes are not clicks. The first-click user_interact event was noise and stays gone (DATA-11).
  useEffect(() => {
    const onFirstClick = (event: MouseEvent) => {
      if (firstClickHandled) return;
      firstClickHandled = true;
      const audio = audioRefRef.current;
      const start = firstClickStarts({
        handled: false,
        playerUsed,
        musicPlaying: (!!audio && !audio.paused) || isPlayWhenReadyPending(),
        otherMediaPlaying: otherSoundInPage(document),
        onMedia: isOnMedia(event.target),
      });
      if (!start) return;
      const audioContext = getAudioContext();
      if (audioContext.state === 'suspended') void audioContext.resume();
      if (audio) dispatch({ type: AUDIO_DISPATCH.PLAY, value: PLAY_TRIGGER.INTERACT });
      else {
        // The list has not arrived yet: the element is primed inside this click and plays when it does.
        requestPlayWhenReady();
        setPlayStatus(true);
      }
    };
    document.addEventListener('click', onFirstClick);
    return () => document.removeEventListener('click', onFirstClick);
  }, [dispatch, setPlayStatus]);

  // Pause while the tab is hidden; resume on return only if it was playing (the owner's answer 5f). A pause by the
  // visitor is kept: nothing resumes it, neither showing the tab again nor a later click.
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

  useEventBus(MessageType.CHANGE_PLAY_STATUS, () => {
    hasInteractedRef.current = true;
    playerUsed = true;
  });

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
