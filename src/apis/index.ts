import { NewsContent, NewsListItem } from '@/apis/types';
import request, { Response } from '@/apis/request';

export const fetchNewsList = () => request.get<any, Response<NewsListItem[]>>('/geo/list');
export const fetchNewsContent = (id: string) => request.get<any, Response<NewsContent>>('/geo/content', { params: { id } });
