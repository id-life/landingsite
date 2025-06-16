import request, { Response } from '@/apis/request';
import { NewsContent, NewsListItem, AudioDataItem } from '@/apis/types';

export const fetchAudioData = () => request.get<any, Response<AudioDataItem[]>>('/music-player/list');

export const fetchNewsList = () => request.get<any, Response<NewsListItem[]>>('/geo/list');
export const fetchNewsContent = (id: string) => request.get<any, Response<NewsContent>>('/geo/content', { params: { id } });
