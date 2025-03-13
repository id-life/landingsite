import { ModelType } from "@/components/twin/model/type";
import { atom } from "jotai";

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
  }

export const currentModelAtom = atom<PredictionModel|null>(null);
export const currentModelTypeAtom = atom<ModelType>(ModelType.Skin);

export const currentAnatomyM0Atom = atom<AnatomyCamera>(AnatomyCamera.CAMERA0);
export const currentAnatomyM1Atom = atom<AnatomyCamera>(AnatomyCamera.CAMERA0);
export const currentAnatomyM2Atom = atom<AnatomyCamera>(AnatomyCamera.CAMERA0);
export const currentAnatomyM3Atom = atom<AnatomyCamera>(AnatomyCamera.CAMERA0);