export const VALUE_GL_CONFIG = [
  // Page 1
  {
    from: {
      title: { position: { x: 5, y: -20, z: -10 }, rotation: { x: -0.785, y: -0.785, z: 0.785 } },
      camera: { position: { x: 0, y: 0, z: 10 } },
      model: { position: { x: 5, y: -15, z: -10 }, rotation: { x: 0.785, y: 0.785, z: 0.785 } },
    },
    to: {
      title: { position: { x: 0, y: -9.2, z: -4.4 }, rotation: { x: 0, y: 0, z: 0 } },
      camera: { position: { x: 0, y: -10, z: 11 } },
      model: { position: { x: 0, y: -10, z: 0 }, mobilePos: { x: 0, y: -11.5, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, mobileRot: { x: -0.2, y: -2, z: 0 } },
    },
  },
  // Page 2
  {
    from: {
      title: { position: { x: 7.1, y: -9.099, z: 5.619 } },
      prevTitle: { position: { x: 0, y: -9.2, z: -4.4 } },
      camera: { position: { x: 0, y: -10, z: 11 } },
      model: { position: { x: 0, y: -10, z: 0 } },
    },
    to: {
      title: { position: { x: 7.1, y: -9.099, z: 5.619 } },
      prevTitle: { position: { x: 0, y: -9.2, z: -20 } },
      camera: { position: { x: -7.6, y: -10.12, z: -7.52 } },
      model: { position: { x: -1, y: -10, z: 0 }, mobilePos: { x: -1, y: -10, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, mobileRot: { x: 0, y: -2, z: 0 } },
    },
  },
  // Page 3
  {
    from: {
      title: { position: { x: 10.927, y: 8.282, z: -3.465 } },
      prevTitle: { position: { x: 7.1, y: -9.099, z: 5.619 } },
      camera: { position: { x: -7.6, y: -10.12, z: -7.52 } },
      model: { position: { x: -1, y: -10, z: 0 } },
    },
    to: {
      title: { position: { x: 3.896, y: -5.184, z: 7.881 } },
      prevTitle: { position: { x: 39.056, y: -19.551, z: 21.611 } },
      camera: { position: { x: -0.783, y: -15.326, z: -9.022 } },
      model: { position: { x: 1, y: -12, z: -2 }, mobilePos: { x: -1, y: -12, z: -2 }, rotation: { x: 0, y: 0, z: 0 }, mobileRot: { x: -0.5, y: 1, z: 0 }  },
    },
  },
  // Page 4
  {
    from: {
      title: { position: { x: -11.236, y: -34.145, z: 14.849 } },
      prevTitle: { position: { x: 3.896, y: -5.184, z: 7.881 } },
      camera: { position: { x: -0.783, y: -15.326, z: -9.022 } },
      model: { position: { x: 1, y: -12, z: -2 } },
    },
    to: {
      title: { position: { x: -0.794, y: -15.797, z: 3.842 } },
      prevTitle: { position: { x: 11.08, y: 12.395, z: 12.016 } },
      camera: { position: { x: 1.409, y: 0.291, z: -6.821 } },
      model: { position: { x: 0, y: -10, z: 0 }, mobilePos: { x: -0.5, y: -10, z: 0 }, rotation: { x: 0, y: 0, z: 0 }, mobileRot: { x: 1.2, y: 0, z: 0 } },
    },
  },
  // Page 5
  {
    from: {
      prevTitle: { position: { x: -0.794, y: -15.797, z: 3.842 } },
      camera: { position: { x: 1.409, y: 0.291, z: -6.821 } },
    },
    to: {
      prevTitle: { position: { x: -10.236, y: -30.144, z: 13.849 } },
      camera: { position: { x: 2.8, y: -7.863, z: -10.55 } },
    },
  },
  // Page 6
  {
    from: {
      camera: { position: { x: 2.8, y: -7.863, z: -10.55 } },
      model: { position: { x: 0, y: -10, z: 0 } },
    },
    to: {
      camera: { position: { x: 1.84, y: -7.943, z: -6.87 } },
      model: { position: { x: 0, y: -10.5, z: 0 }, mobilePos: { x: -0.5, y: -10.8, z: 2 }, rotation: { x: 0, y: 0, z: 0 }, mobileRot: { x: 0, y: 0, z: 0 } },
    },
  },
] as const;
