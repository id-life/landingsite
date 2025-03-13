import * as THREE from 'three';

export enum ModelType {
  Skin = 0,
  Anatomy = 1,
}

export enum SkinType {
  Skin = 0,
  Cloth = 1,
}

export type ModelRef = {switchModelShow: (type: ModelType, onlySkinShow?: boolean) => void };