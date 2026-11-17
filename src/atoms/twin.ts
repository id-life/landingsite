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

/**
 * The avatar the visitor chose last. currentModelAtom follows it only once the stage applies it (from anatomy, when the
 * camera has come back), so a skin or anatomy press in between must not read currentModelAtom: it read the avatar before
 * (C01, then ORG pressed in anatomy, then anatomy again 0.1 s later asked the stage for C01's anatomy, under ORG's text).
 */
let chosenTwinModel: PredictionModel = PredictionModel.M0;
export const chooseTwinModel = (model: PredictionModel) => {
  chosenTwinModel = model;
};
export const chosenModel = () => chosenTwinModel;

/**
 * Whether the visitor has pressed a Twin control since the section last showed its opening arrangement: the start of
 * the section is not kept in the history entry, a pressed avatar (ORG included, which hides DEMO) is (NAV-02).
 */
let twinPressed = false;
export const markTwinPressed = () => {
  twinPressed = true;
};
export const forgetTwinPress = () => {
  twinPressed = false;
};
export const twinWasPressed = () => twinPressed;

/**
 * The anatomy view the camera was last framed for, or null when it has not been framed since anatomy was entered. A
 * view's framing depends on where the camera starts (a fit from the first view's camera differs from a fit from another
 * view's), so the late framing after the anatomy models mount is applied only when the marked view has not been framed
 * yet: once, from the same camera a slow press starts from.
 */
let fittedView: AnatomyCamera | null = null;
export const setFittedTwinView = (view: AnatomyCamera | null) => {
  fittedView = view;
};
export const fittedTwinView = () => fittedView;

export const currentModelAtom = atom<PredictionModel | null>(PredictionModel.M0);
export const currentModelTypeAtom = atom<ModelType>(ModelType.Skin);

export const currentAnatomyCameraAtom = atom<AnatomyCamera>(AnatomyCamera.CAMERA0);

/** The Digital Twin model switch being loaded (reported as twin_model_ready once loaded, then cleared). */
export const modelLoadingItemAtom = atom<{ view: string; model: string; at: number } | null>(null);

// Shared border animation controls atom
export const mobileBorderAnimationStateAtom = atom<'idle' | 'scale-up' | 'scale-down'>('idle');
