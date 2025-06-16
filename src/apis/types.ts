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
}

export type NewsListItem = {
  id: number;
  title: string;
  brief: string;
  category: string;
  createdAt: string;
  updatedAt: string;
};

export type NewsContent = {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  updatedAt: string;
};
