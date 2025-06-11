import request, { Response } from '@/apis/request';
import { AudioDataItem } from '@/apis/types';

export const fetchAudioData = () => request.get<any, Response<AudioDataItem[]>>('/music-player/list');
