import { atom } from 'jotai';
import { GeoData } from '@/components/model/config';

export const geoLabelAtom = atom<GeoData | undefined>(undefined);
export const isChartOpenAtom = atom<boolean>(false);
