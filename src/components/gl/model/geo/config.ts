import * as THREE from 'three';

export enum GeoLabel {
  Intervention,
  Supplement,
  Biomarker,
}

export type GeoData = {
  id: GeoLabel;
  title: string;
  position: THREE.Vector3;
  groupPosition: THREE.Vector3;
  cameraPosition: THREE.Vector3;
};

export const GEO_DATA: GeoData[] = [
  {
    id: GeoLabel.Intervention,
    title: 'Vetted & Novel Interventions',
    position: new THREE.Vector3(1, 1, 0),
    groupPosition: new THREE.Vector3(0, -1.4, 0),
    cameraPosition: new THREE.Vector3(1.82, -0.72, -0.37),
  },
  {
    id: GeoLabel.Supplement,
    title: 'Supplements',
    position: new THREE.Vector3(-0.5 - 0.5, 0.87),
    groupPosition: new THREE.Vector3(0, -1.4, 0),
    cameraPosition: new THREE.Vector3(-1.72, -0.99, 0.17),
  },
  {
    id: GeoLabel.Biomarker,
    title: 'Biomarker Tracking',
    position: new THREE.Vector3(-0.5 - 0.5, -0.87),
    groupPosition: new THREE.Vector3(1, -0.4, -0.1),
    cameraPosition: new THREE.Vector3(-0.06, -1.99, 0.01),
  },
];
