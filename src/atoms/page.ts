import { MapDotData } from '@/constants/engagement';
import { atom } from 'jotai';

export const selectEngagementDotDataAtom = atom<MapDotData | null>(null);
