import MODELS from './models-manifest.json';

/**
 * The first screen's own 3D assets. Kept free of code imports (the model manifest is JSON) so the experience layouts
 * (server components) can preload them without pulling three.js into the server bundle.
 */
export const HERO_MODEL_URL = MODELS.hero;

/**
 * The wordmark and tagline SVGs, the same two files on both trees (VIS-03): the phone tree draws them as merged meshes
 * (MobileCenterLogo), the desktop tree rasterises them at the screen's resolution (useLogoTextures). Both load them
 * with a fetch (three's FileLoader), so one preload serves either tree.
 */
export const HERO_SVG_URLS = ['/svgs/logo-en.svg', '/svgs/main-description.svg'] as const;
