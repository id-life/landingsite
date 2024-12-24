import { atom } from 'jotai';
import { GeoData } from '@/components/gl/model/geo/config';

export const geoLabelAtom = atom<GeoData | undefined>(undefined);
export const isChartOpenAtom = atom<boolean>(false);

export const isCNAtom = atom<boolean>(false);

export const model2VisibleAtom = atom<boolean>(true); // 水母 3/4
export const model3VisibleAtom = atom<boolean>(true); // 小精灵 page 1/2
export const model4VisibleAtom = atom<boolean>(true); // 海马 page 4 之后
