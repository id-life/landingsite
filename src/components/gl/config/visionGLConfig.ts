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

/**
 * The six glass looks the hero used to pick from at random on every load (four cold loads gave three visibly
 * different heroes). Kept as the reference set for the owner's choice; the hero now always uses HERO_GLASS.
 */
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
/**
 * The one hero glass look (MOT-06, VIS-03). OWNER DECISION PENDING: which of the six presets ships is the owner's
 * (or the designer's) call; preset 0 is the interim default until then, and changing HERO_GLASS_INDEX is the whole
 * switch. Outside production, ?hero-glass=<0-5> shows any preset for review (the comparison sheet is made that way).
 */
const HERO_GLASS_INDEX = 0;

function reviewIndex() {
  if (process.env.NEXT_PUBLIC_DEPLOY_ENV === 'production' || typeof window === 'undefined') return HERO_GLASS_INDEX;
  const asked = Number(new URLSearchParams(window.location.search).get('hero-glass'));
  return Number.isInteger(asked) && asked >= 0 && asked < TRANSMISSION_KEYFRAMES.length ? asked : HERO_GLASS_INDEX;
}

export const HERO_GLASS = TRANSMISSION_KEYFRAMES[reviewIndex()];
