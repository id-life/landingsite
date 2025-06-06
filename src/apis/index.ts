import request from '@/apis/request';
import { AddCharacterRelationData, BaseResponse, CharacterRelationDataResponse } from '@/apis/types';

export const fetchCharacterRelationData = () =>
  request.get<any, BaseResponse<CharacterRelationDataResponse>>('/character-relation');

export const addCharacterRelationData = (data: AddCharacterRelationData) =>
  request.post<any, Omit<BaseResponse, 'data'>>('/character-relation', data);
