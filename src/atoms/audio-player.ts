import { atom } from 'jotai';
import { ValueOf } from '@/constants/config';
import { AudioDataItem } from '@/apis/types';
import { atomWithStorage } from 'jotai/utils';
import { STORAGE_KEY } from '@/constants/storage';

export const PlayList = {
  MUSIC: 'music',
  PODCAST_ID: 'podcast_id',
  PODCAST_LT: 'podcast_lt',
} as const;
export type PlayListKey = ValueOf<typeof PlayList>;

export const PlayMode = {
  ORDER: 'order', // 顺序播放
  REPEAT_ONE: 'repeat_one', // 单曲循环
  REPEAT_ALL: 'repeat_all', // 列表循环
  SHUFFLE: 'shuffle', // 随机播放
} as const;
export type PlayModeKey = ValueOf<typeof PlayMode>;

export type PlayPodcastKey = Exclude<PlayListKey, 'music'>;

export const currentPlayListAtom = atom<PlayListKey>(PlayList.MUSIC);

export const currentPlayPodcastAtom = atom<PlayPodcastKey>(PlayList.PODCAST_ID);

export const currentPlayStatusAtom = atom<boolean>(false);
export const lastPlayStatusAtom = atomWithStorage<boolean>(STORAGE_KEY.LAST_AUDIO_PLAY, true);

export const currentAudioAtom = atom<AudioDataItem | null>(null);

export const musicListAtom = atom<AudioDataItem[]>([]);
export const podcastIDAtom = atom<AudioDataItem[]>([]);
export const podcastLTAtom = atom<AudioDataItem[]>([]);
export const hasInteractedAtom = atom<boolean>(false);

export const playlistAtom = atom<AudioDataItem[]>([]);

export const playModeAtom = atom<PlayModeKey>(PlayMode.REPEAT_ALL);

// audio

export const audioRefAtom = atom<HTMLAudioElement | null>(null);
export const canPlayAtom = atom(false);
export const progressAtom = atom(0);
export const currentTimeAtom = atom(0);
export const durationAtom = atom(0);

export const AUDIO_DISPATCH = {
  SEEK_TO: 'SEEK_TO',
  PLAY_NEXT: 'PLAY_NEXT',
  SET_PLAY_MODE: 'SET_PLAY_MODE',
  TOGGLE_PLAY: 'TOGGLE_PLAY',
  PLAY: 'PLAY',
  PAUSE: 'PAUSE',
} as const;
export type AudioDispatchKey = ValueOf<typeof AUDIO_DISPATCH>;

export const audioControlsAtom = atom(
  (get) => ({
    audioRef: get(audioRefAtom),
    canPlay: get(canPlayAtom),
    progress: get(progressAtom),
    currentTime: get(currentTimeAtom),
    duration: get(durationAtom),
    isPlaying: get(currentPlayStatusAtom),
  }),
  (get, set, { type, value }: { type: AudioDispatchKey; value?: any }) => {
    const audioRef = get(audioRefAtom);

    switch (type) {
      case AUDIO_DISPATCH.SEEK_TO:
        if (audioRef && !isNaN(audioRef.duration)) {
          audioRef.currentTime = value;
          set(progressAtom, value / audioRef.duration);
          set(currentTimeAtom, audioRef.currentTime);
          audioRef
            .play()
            .then(() => set(currentPlayStatusAtom, true))
            .catch(() => set(currentPlayStatusAtom, false));
        }
        break;
      case AUDIO_DISPATCH.PLAY_NEXT:
        set(playNextTrackAtom);
        break;
      case AUDIO_DISPATCH.SET_PLAY_MODE:
        set(playModeAtom, value);
        break;
      case AUDIO_DISPATCH.TOGGLE_PLAY:
        set(togglePlayAtom);
        break;
      case AUDIO_DISPATCH.PLAY:
        if (audioRef) {
          audioRef
            .play()
            .then(() => set(currentPlayStatusAtom, true))
            .catch((error) => {
              console.log('error: ', error);
              set(currentPlayStatusAtom, false);
            });
        }
        break;
      case AUDIO_DISPATCH.PAUSE:
        if (audioRef) {
          audioRef.pause();
          set(currentPlayStatusAtom, false);
        }
        break;
    }
  },
);

export const playNextTrackAtom = atom(null, (get, set) => {
  const currentMusic = get(currentAudioAtom);
  const playlist = get(playlistAtom);
  const playMode = get(playModeAtom);
  const audioRef = get(audioRefAtom);

  if (!currentMusic || playlist.length === 0) return;

  const currentIndex = playlist.findIndex((track) => track.id === currentMusic.id);
  if (currentIndex === -1) return;

  let nextIndex = -1;

  switch (playMode) {
    case PlayMode.ORDER:
      nextIndex = currentIndex + 1 < playlist.length ? currentIndex + 1 : -1;
      break;

    case PlayMode.REPEAT_ONE:
      nextIndex = currentIndex;
      break;

    case PlayMode.REPEAT_ALL:
      nextIndex = (currentIndex + 1) % playlist.length;
      break;

    case PlayMode.SHUFFLE:
      if (playlist.length > 1) {
        let randomIndex;
        do {
          randomIndex = Math.floor(Math.random() * playlist.length);
        } while (randomIndex === currentIndex);
        nextIndex = randomIndex;
      } else {
        nextIndex = 0;
      }
      break;
  }

  if (nextIndex !== -1) {
    set(currentAudioAtom, playlist[nextIndex]);
    set(currentPlayStatusAtom, true);
    if (nextIndex === currentIndex) {
      audioRef?.play();
    }
  } else {
    set(currentPlayStatusAtom, false);
  }
});

export const togglePlayAtom = atom(null, (get, set) => {
  const isPlaying = get(currentPlayStatusAtom);
  const audioRef = get(audioRefAtom);
  const currentAudio = get(currentAudioAtom);

  if (!audioRef || !currentAudio) return;

  if (isPlaying) {
    audioRef.pause();
    set(currentPlayStatusAtom, false);
    set(lastPlayStatusAtom, false);
  } else {
    audioRef
      .play()
      .then(() => {
        set(currentPlayStatusAtom, true);
        set(lastPlayStatusAtom, true);
      })
      .catch((error) => {
        console.log('error: ', error);
        set(currentPlayStatusAtom, false);
        set(lastPlayStatusAtom, false);
      });
  }
});
