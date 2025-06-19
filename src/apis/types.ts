import { CHARACTER_RELATION_IMPRESSION } from '@/constants/character-relation';

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
  createdAt: string;
  updatedAt: string;
};
