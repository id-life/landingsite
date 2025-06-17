import request, { Response } from '@/apis/request';
import { AddCharacterRelationData, CharacterRelationDataResponse, NewsContent, NewsListItem } from '@/apis/types';

export const fetchCharacterRelationData = () =>
  request.get<any, Response<CharacterRelationDataResponse>>('/character-relation');

export const addCharacterRelationData = (data: AddCharacterRelationData) =>
  request.post<any, Omit<Response, 'data'>>('/character-relation', data);

export const fetchNewsList = () => request.get<any, Response<NewsListItem[]>>('/geo/list');
export const fetchNewsContent = (id: string) => request.get<any, Response<NewsContent>>('/geo/content', { params: { id } });
