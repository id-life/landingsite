import { ModelType } from '@/components/twin/model/type';
import { atom } from 'jotai';

export enum PredictionModel {
  M0 = 'M0',
  M1 = 'M1',
  M2 = 'M2',
  M3 = 'M3',
}

export enum AnatomyCamera {
  CAMERA0 = 0,
  CAMERA1 = 1,
  CAMERA2 = 2,
  CAMERA3 = 3,
  CAMERA4 = 4,
  CAMERA5 = 5,
  CAMERA6 = 6,
  CAMERA7 = 7,
  CAMERA8 = 8,
  CAMERA9 = 9,
  CAMERA10 = 10,
}

export const currentModelAtom = atom<PredictionModel | null>(PredictionModel.M0);
export const currentModelTypeAtom = atom<ModelType>(ModelType.Skin);

export const currentAnatomyCameraAtom = atom<AnatomyCamera>(AnatomyCamera.CAMERA0);

export const modelLoadingItemAtom = atom<[string, string] | [null, null]>([null, null]);

// Shared border animation controls atom
export const mobileBorderAnimationStateAtom = atom<'idle' | 'scale-up' | 'scale-down'>('idle');
