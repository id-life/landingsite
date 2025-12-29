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
  spotifyLink?: string;
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
  cover?: string;
  source?: string;
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

// Insights API Types
export type InsightsCategory = 'news' | 'talk' | 'essay' | 'coverage' | 'podcast';

export type InsightsItem = {
  id: number;
  title: string;
  category: InsightsCategory;
  sequence: number;
  url: string;
  publishDate: string;
  essayPic?: string;
  createdAt: string;
  updatedAt: string;
};

// Insights with Geo API Types (for /insights/with-geo endpoint)
export type InsightsWithGeoItem = {
  id?: number;
  title: string;
  sequence: number;
  contentType: 'insights' | 'geo';
  url: string | null;
  imageUrl: string | null;
  publisher: string | null;
  isTop: boolean;
  publishDate: string | null;
};

// News page item type (combined from insights and geo)
export type NewsPageItem = {
  id: number;
  title: string;
  brief: string | null;
  cover: string | null;
  source: string | null;
  publishDate: string | null;
  url: string | null;
  videoId: string | null;
  isExternal: boolean;
};
