import { atom } from 'jotai';
import { ValueOf } from '@/constants/config';
import { AudioDataItem } from '@/apis/types';

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

export const currentAudioAtom = atom<AudioDataItem | null>(null);

export const musicListAtom = atom<AudioDataItem[]>([]);
export const podcastIDAtom = atom<AudioDataItem[]>([]);
export const podcastLTAtom = atom<AudioDataItem[]>([]);

export const playlistAtom = atom<AudioDataItem[]>([]);

export const playModeAtom = atom<PlayModeKey>(PlayMode.ORDER);

// audio

export const audioRefAtom = atom<HTMLAudioElement | null>(null);
export const canPlayAtom = atom(false);
export const progressAtom = atom(0);
export const currentTimeAtom = atom(0);
export const durationAtom = atom(0);

export const audioControlsAtom = atom(
  (get) => ({
    audioRef: get(audioRefAtom),
    canPlay: get(canPlayAtom),
    progress: get(progressAtom),
    currentTime: get(currentTimeAtom),
    duration: get(durationAtom),
  }),
  (get, set, { type, value }: { type: string; value?: any }) => {
    const audioRef = get(audioRefAtom);

    switch (type) {
      case 'SEEK_TO':
        if (audioRef && !isNaN(audioRef.duration)) {
          audioRef.currentTime = value;
          set(progressAtom, value / audioRef.duration);
          set(currentTimeAtom, audioRef.currentTime);
        }
        break;
      case 'PLAY_NEXT':
        set(playNextTrackAtom);
        break;
      case 'SET_PLAY_MODE':
        set(playModeAtom, value);
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
