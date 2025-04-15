import * as THREE from 'three';

export const VALUE_GL_CONFIG = [
  // Page 1
  {
    from: {
      camera: {
        position: { x: 3.064, y: -12.494, z: -3.926 },
        rotation: {
          x: THREE.MathUtils.degToRad(122.89),
          y: THREE.MathUtils.degToRad(-17.75),
          z: THREE.MathUtils.degToRad(167.34),
        },
      },
      model: { position: { x: 15, y: -20, z: -10 }, rotation: { x: 0.785, y: 0.785, z: 0.785 } },
    },
    to: {
      camera: {
        position: { x: -3.211, y: -12.187, z: -4.946 },
        rotation: {
          x: THREE.MathUtils.degToRad(147.49),
          y: THREE.MathUtils.degToRad(-30.75),
          z: THREE.MathUtils.degToRad(167.34),
        },
      },
      model: {
        position: { x: 0, y: -10, z: 0 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
      },
    },
  },
  // Page 2
  {
    from: {
      camera: {
        position: { x: -3.211, y: -10.187, z: -4.946 },
        rotation: {
          x: THREE.MathUtils.degToRad(147.49),
          y: THREE.MathUtils.degToRad(-30.75),
          z: THREE.MathUtils.degToRad(167.34),
        },
      },
      model: { position: { x: 0, y: -10, z: 0 } },
    },
    to: {
      camera: {
        position: { x: 5.982, y: -9.655, z: -4.286 },
        rotation: {
          x: THREE.MathUtils.degToRad(179.39),
          y: THREE.MathUtils.degToRad(54.19),
          z: THREE.MathUtils.degToRad(177.06),
        },
      },
      model: {
        position: { x: 0.5, y: -11, z: 4 },
        rotation: { x: -0.4, y: -2, z: 0 },
      },
    },
  },
  // Page 3
  {
    from: {
      camera: {
        position: { x: 5.982, y: -9.655, z: -4.286 },
        rotation: {
          x: THREE.MathUtils.degToRad(179.39),
          y: THREE.MathUtils.degToRad(54.19),
          z: THREE.MathUtils.degToRad(177.06),
        },
      },
      model: {
        position: { x: 0.5, y: -11, z: 4 },
        rotation: { x: -0.4, y: -2, z: 0 },
      },
    },
    to: {
      camera: {
        position: { x: 3.342, y: -0.815, z: -3.146 },
        rotation: {
          x: THREE.MathUtils.degToRad(-112.81),
          y: THREE.MathUtils.degToRad(20.19),
          z: THREE.MathUtils.degToRad(127.66),
        },
        model: {
          position: { x: 1, y: -12, z: -2 },
          rotation: { x: 0, y: 0, z: 0 },
        },
      },
    },
  },
] as const;
