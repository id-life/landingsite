import request from '@/apis/request';
import { AddCharacterRelationData, BaseResponse, CharacterRelationDataResponse } from '@/apis/types';

export const fetchCharacterRelationData = () =>
  request.get<any, BaseResponse<CharacterRelationDataResponse>>('/official/character-relation');

export const addCharacterRelationData = (data: AddCharacterRelationData) =>
  request.post<any, Omit<BaseResponse, 'data'>>('/official/character-relation', data);
