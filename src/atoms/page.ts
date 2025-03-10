import { MapDotData, WORLD_MAP_DOTS } from '@/constants/engagement';
import { atom } from 'jotai';

export const selectEngagementDotDataAtom = atom<MapDotData>(WORLD_MAP_DOTS[0]);
