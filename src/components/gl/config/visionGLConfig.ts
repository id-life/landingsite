export const VISION_GL_CONFIG = {
  mobileLoopAnim: {
    camera: {
      position: [
        { x: -1, y: 2, z: 10 },
        { x: 1, y: 2, z: 10 },
        { x: 2, y: -2, z: 10 },
        { x: -1, y: -2, z: 10 },
      ],
    },
  },
} as const;

/** The six glass looks of the hero; each page load shows one of them, chosen at random (heroGlass). */
const TRANSMISSION_KEYFRAMES = [
  {
    transmission: 1,
    roughness: 0.1,
    thickness: 10,
    ior: 1.5,
    chromaticAberration: 1,
    anisotropy: 0,
    distortion: 1,
    distortionScale: 0.15,
    temporalDistortion: 0.1,
    clearcoat: 1,
    metalness: 0.1,
  },
  {
    transmission: 1,
    roughness: 0.0,
    thickness: 10,
    ior: 1,
    chromaticAberration: 1,
    anisotropy: 1,
    distortion: 1,
    distortionScale: 1,
    temporalDistortion: 0.1,
    clearcoat: 1,
    metalness: 0,
  },
  {
    transmission: 1,
    roughness: 0.0,
    thickness: 10,
    ior: 3.16,
    chromaticAberration: 1,
    anisotropy: 1,
    distortion: 1,
    distortionScale: 0.1,
    temporalDistortion: 0.1,
    clearcoat: 1,
    metalness: 0,
  },
  {
    transmission: 1,
    roughness: 0.0,
    thickness: 10,
    ior: 2.28,
    chromaticAberration: 1,
    anisotropy: 0,
    distortion: 1,
    distortionScale: 0.3,
    temporalDistortion: 0.1,
    clearcoat: 1,
    metalness: 0,
  },
  {
    transmission: 1,
    roughness: 0.0,
    thickness: 10,
    ior: 1,
    chromaticAberration: 1,
    anisotropy: 1,
    distortion: 1,
    distortionScale: 0.5,
    temporalDistortion: 0.1,
    clearcoat: 1,
    metalness: 0,
  },
  {
    transmission: 1,
    roughness: 0,
    thickness: 10,
    ior: 1.5,
    chromaticAberration: 0.5,
    anisotropy: 0.1,
    distortion: 0,
    distortionScale: 0.5,
    temporalDistortion: 0.1,
    clearcoat: 0,
    metalness: 0.1,
  },
] as const;
let configIndex: number | null = null;

/**
 * The hero's glass look for this page load: one of the six, at random, as in the original design (the owner's
 * reference for the hero, 2026-11-16). Drawn the first time the glass dragon renders, which is on the client after
 * hydration (the 3D tree is client-only), and kept for the page load, so React Strict Mode's second mount and a deck
 * change (phone and desktop dragons) reuse the same look instead of drawing again.
 */
export function heroGlass() {
  if (configIndex === null) configIndex = Math.floor(Math.random() * TRANSMISSION_KEYFRAMES.length);
  return TRANSMISSION_KEYFRAMES[configIndex];
}
