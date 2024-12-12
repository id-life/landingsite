import { atom } from 'jotai';
import { GeoData } from '@/components/gl/model/geo/config';

export const geoLabelAtom = atom<GeoData | undefined>(undefined);
export const isChartOpenAtom = atom<boolean>(false);

export const isCNAtom = atom<boolean>(false);
