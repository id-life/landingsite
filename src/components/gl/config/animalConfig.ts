import { useFBO } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

type Mesh = {
  name: string;
  reflectivity: number;
  anisotropy: number;
};

type AnimalConfig = {
  path: string;
  scale: number;
  animation: number;
  resolution: number;
  mesh: Mesh[];
};
export const ANIMAL_CONFIG: AnimalConfig[] = [
  {
    path: 'https://cdn.id.life/animal2.glb',
    scale: 1,
    animation: 1,
    resolution: 32,
    mesh: [{ name: 'JF_skin_in', reflectivity: 0.04, anisotropy: 0.5 }],
  },
  {
    path: 'https://cdn.id.life/animal3.glb',
    scale: 1.1,
    animation: 2,
    resolution: 32,
    mesh: [{ name: 'Object_12', reflectivity: 0.04, anisotropy: 0.5 }],
  },
  {
    path: 'https://cdn.id.life/animal4.glb',
    scale: 55,
    animation: 0,
    resolution: 32,
    mesh: [{ name: 'Object_11', reflectivity: 0.04, anisotropy: 0.5 }],
  },
] as const;

export const MODEL_CONFIG = [
  {
    init: [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -10, 0), new THREE.Vector3(-10, -10, -10)],
    pos1: [new THREE.Vector3(0, 0, -12), new THREE.Vector3(0, 0, 0), new THREE.Vector3(-10, -10, -10)],
    pos2: [new THREE.Vector3(0, 0, -12), new THREE.Vector3(0, 0, -12), new THREE.Vector3(0, 0, 0)],
  },
  {
    init: [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -10, 0), new THREE.Vector3(-10, -10, -10)],
    pos1: [new THREE.Vector3(0, 0, -12), new THREE.Vector3(0, -10, -10), new THREE.Vector3(0, 0, 0)],
    pos2: [new THREE.Vector3(0, 0, -12), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -12)],
  },
  {
    init: [new THREE.Vector3(0, -10, 10), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -10, 10)],
    pos1: [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -12), new THREE.Vector3(0, -10, 10)],
    pos2: [new THREE.Vector3(0, 0, -12), new THREE.Vector3(0, 0, -12), new THREE.Vector3(1, 0.01, 0)],
  },
  {
    init: [new THREE.Vector3(0, -10, -5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -10, 10)],
    pos1: [new THREE.Vector3(0, -10, -5), new THREE.Vector3(0, 0, -12), new THREE.Vector3(0, 0, 0)],
    pos2: [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -12), new THREE.Vector3(0, 0, -12)],
  },
  {
    init: [new THREE.Vector3(0, -10, 10), new THREE.Vector3(0, -10, 0), new THREE.Vector3(0, 0, 0)],
    pos1: [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -12), new THREE.Vector3(0, 0, -12)],
    pos2: [new THREE.Vector3(0, 0, -12), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -12)],
  },
  {
    init: [new THREE.Vector3(0, -10, 10), new THREE.Vector3(0, -10, 0), new THREE.Vector3(0, 0, 0)],
    pos1: [new THREE.Vector3(0, -10, -5), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -12)],
    pos2: [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -12), new THREE.Vector3(0, 0, -12)],
  },
];
