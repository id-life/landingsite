import { PlayListKey } from '@/atoms/audio-player';

export type AudioDataItem = {
  id: number;
  title: string;
  artist: string;
  duration: number;
  url: string;
  category: PlayListKey;
  album?: string;
  description?: string;
  createdAt?: string;
  xyzLink?: string;
  podcastLink?: string;
};
