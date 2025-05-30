import { CHARACTER_RELATION_IMPRESSION } from '@/constants/character-relation';

export type BaseResponse<T = any> = {
  code: number;
  message: string;
  data: T;
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
