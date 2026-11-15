/**
 * The first screen's own 3D assets. Kept free of imports so the experience layouts (server
 * components) can preload them without pulling three.js into the server bundle.
 */
export const HERO_MODEL_URL = '/models/logo_v2.glb';

/** Wordmark textures of the desktop and tablet tree (CenterLogo via useLogoTextures). */
export const HERO_TEXTURE_URLS = [
  '/textures/logos/logo-en.png',
  '/textures/logos/logo-cn.png',
  '/textures/logos/main-description.png',
  '/textures/logos/main-description-cn.png',
] as const;

/** Wordmark SVGs of the phone tree (must match the src props in MobileCenterLogo.tsx). */
export const HERO_PHONE_SVG_URLS = ['/svgs/logo-en.svg', '/svgs/main-description.svg'] as const;

/** Same breakpoint as HomeEntry (useMediaQuery maxWidth 768): which tree, so which assets. */
export const PHONE_MEDIA = '(max-width: 768px)';
export const DESKTOP_MEDIA = '(min-width: 769px)';
