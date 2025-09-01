import { PlayListKey } from '@/atoms/audio-player';
import { CHARACTER_RELATION_IMPRESSION } from '@/constants/character-relation';

export type AudioDataItem = {
  id: number;
  title: string;
  artist: string;
  duration: number;
  url: string;
  category: PlayListKey;
  sequence: number;
  album?: string;
  description?: string;
  createdAt?: string;
  xyzLink?: string;
  podcastLink?: string;
};

export interface CharacterRelationData {
  character: string;
  relation: CharacterRelation[];
}

export type CharacterRelationImpression = (typeof CHARACTER_RELATION_IMPRESSION)[keyof typeof CHARACTER_RELATION_IMPRESSION];

export interface CharacterRelation {
  character: string;
  impression: CharacterRelationImpression;
}

export type CharacterRelationDataResponse = ({ id: number } & CharacterRelationData)[];

export type AddCharacterRelationData = Omit<CharacterRelationData, 'relation'> & {
  relation: CharacterRelation[];
};

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
  description: string;
  keyWords: string;
  createdAt: string;
  updatedAt: string;
};

export type PodcastItem = {
  id: number;
  album: string;
  artist?: string;
  category: string;
  description: string;
  duration: number;
  podcastLink: string;
  sequence: number;
  title: string;
  detailMedia: string;
  url: string;
  xyzLink: string;
  createdAt: string;
  spotifyLink: string;
  transcript: string;
  keywords: string[];
};

export type PodcastCommentItemType = {
  audioDataId: number;
  avatar: string;
  content: string;
  createdAt: string;
  id: number;
  nickName: string;
  source: string;
  xyzCommentId: string;
};
