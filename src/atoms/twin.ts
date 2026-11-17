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

/**
 * The visitor's choices in the Digital Twin (an avatar, skin or anatomy, the reset on leaving), counted. Work that
 * finishes later than the press that started it (the 3D stage applies a model once its camera has come to rest) applies
 * its choice only while no newer choice has been made, so the last press wins whatever the speed of the presses.
 */
let twinChoice = 0;
export const newTwinChoice = () => {
  twinChoice += 1;
  return twinChoice;
};
export const isLatestTwinChoice = (choice: number) => choice === twinChoice;

export const currentModelAtom = atom<PredictionModel | null>(PredictionModel.M0);
export const currentModelTypeAtom = atom<ModelType>(ModelType.Skin);

export const currentAnatomyCameraAtom = atom<AnatomyCamera>(AnatomyCamera.CAMERA0);

/** The Digital Twin model switch being loaded (reported as twin_model_ready once loaded, then cleared). */
export const modelLoadingItemAtom = atom<{ view: string; model: string; at: number } | null>(null);

// Shared border animation controls atom
export const mobileBorderAnimationStateAtom = atom<'idle' | 'scale-up' | 'scale-down'>('idle');
