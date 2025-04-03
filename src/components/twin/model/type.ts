import { AnatomyCamera } from '@/atoms/twin';
import * as THREE from 'three';

export enum ModelType {
  Skin = 0,
  Anatomy = 1,
}

export enum SkinType {
  Skin = 0,
  Cloth = 1,
}

export type ModelRef = {
  scenes?: {
    muscular_system: THREE.Group;
    connective_tissue: THREE.Group;
    organs: THREE.Group;
    lymphatic_system: THREE.Group;
    vascular_system: THREE.Group;
    nervous_system: THREE.Group;
    cartilage_tissue: THREE.Group;
    skeletal_system: THREE.Group;
  };
  switchModelShow: (type: ModelType, index: AnatomyCamera) => void;
};
