import request from '@/apis/request';
import { AddCharacterRelationData, BaseResponse, CharacterRelattionDataResponse } from '@/apis/types';

export const fetchCharacterRelationData = () =>
  request.get<any, BaseResponse<CharacterRelattionDataResponse>>('/official/character-relation');

export const addCharacterRelationData = (data: AddCharacterRelationData) =>
  request.post<any, Omit<BaseResponse, 'data'>>('/official/character-relation', data);
