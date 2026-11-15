import { useLoader, useThree } from '@react-three/fiber';
import { useSetAtom } from 'jotai';
import { type PropsWithChildren, useEffect, useState } from 'react';
import { peek } from 'suspend-react';
import * as THREE from 'three';
import { GLTF, GLTFLoader, MeshoptDecoder, SVGLoader } from 'three-stdlib';
import { heroReadyAtom } from '@/atoms/loading';
import { HERO_MODEL_URL, HERO_PHONE_SVG_URLS, HERO_TEXTURE_URLS } from './heroAssetUrls';

/**
 * The first screen's own assets (the dragon model and the four wordmark textures) load through this
 * manager, and only through it, so the loader overlay can follow the hero alone. Everything else
 * (the Digital Twin, the Connect jellyfish) stays on THREE.DefaultLoadingManager and can never hold
 * the first screen back.
 */
export const heroLoadingManager = new THREE.LoadingManager();

// R3F keeps one loader instance per loader class, so the hero gets classes of its own: setting a
// manager on the shared GLTFLoader would also move the twin and jellyfish onto it.
class HeroGLTFLoader extends GLTFLoader {
  constructor() {
    super(heroLoadingManager);
  }
}

class HeroTextureLoader extends THREE.TextureLoader {
  constructor() {
    super(heroLoadingManager);
  }
}

// The hero model is Meshopt-compressed (scripts/encode-hero-model.mjs): its decoder ships inside
// three-stdlib, so the first screen fetches no Draco decoder.
const heroGLTFExtensions = (loader: GLTFLoader) => {
  loader.setMeshoptDecoder(typeof MeshoptDecoder === 'function' ? MeshoptDecoder() : MeshoptDecoder);
};

/** The dragon model (same result shape as drei's useGLTF: nodes and materials included). */
export function useHeroGLTF() {
  return useLoader(HeroGLTFLoader, HERO_MODEL_URL, heroGLTFExtensions) as GLTF & {
    nodes: Record<string, THREE.Object3D>;
  };
}

/**
 * Rendered last inside the hero's Suspense boundary: it commits only once every hero asset has
 * loaded and parsed, and flags the hero ready on the next frame, when the scene has been drawn.
 */
export function HeroReady() {
  const setHeroReady = useSetAtom(heroReadyAtom);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setHeroReady(true));
    return () => {
      cancelAnimationFrame(frame);
      setHeroReady(false);
    };
  }, [setHeroReady]);
  return null;
}

/** The desktop hero is the dragon and four wordmark textures; the phone hero is the dragon and four SVGs (drei Svg). */
type HeroVariant = 'desktop' | 'phone';

/**
 * Starts loading and parsing the hero's resources into R3F's loader cache (a no-op once started). The 3D wrappers
 * call it when they render, so parsing overlaps the canvas setup instead of waiting for the gate below to mount.
 */
export function preloadHeroAssets(variant: HeroVariant) {
  useLoader.preload(HeroGLTFLoader, HERO_MODEL_URL, heroGLTFExtensions);
  if (variant === 'desktop') useLoader.preload(HeroTextureLoader, HERO_TEXTURE_URLS as unknown as string[]);
  else for (const url of HERO_PHONE_SVG_URLS) useLoader.preload(SVGLoader, url);
}

// Keys under which R3F's useLoader caches each resource (suspend-react, keyed by loader class and URLs).
const heroCacheKeys = (variant: HeroVariant): unknown[][] => [
  [HeroGLTFLoader, HERO_MODEL_URL],
  ...(variant === 'desktop' ? [[HeroTextureLoader, ...HERO_TEXTURE_URLS]] : HERO_PHONE_SVG_URLS.map((url) => [SVGLoader, url])),
];
const heroAssetsCached = (variant: HeroVariant) => heroCacheKeys(variant).every((keys) => peek(keys) !== undefined);

/**
 * Renders the hero only once all of its resources are parsed and cached, so the hero never suspends. React 19
 * commits a Suspense boundary that resolves within 300 ms of showing its fallback no earlier than those 300 ms
 * (FALLBACK_THROTTLE_MS); the hero suspended on assets that were already downloaded and resolved about 25 ms later,
 * so every first screen waited about 275 ms longer than on React 18. If a load fails, the loader's fail-open path
 * (heroLoadingManager.onError, 15 s timeout) still reveals the page.
 */
export function HeroAssetsGate({ variant, children }: PropsWithChildren<{ variant: HeroVariant }>) {
  const [cached, setCached] = useState(() => heroAssetsCached(variant));
  useEffect(() => {
    if (cached) return;
    preloadHeroAssets(variant);
    let frame = 0;
    const check = () => {
      if (heroAssetsCached(variant)) setCached(true);
      else frame = requestAnimationFrame(check);
    };
    frame = requestAnimationFrame(check);
    return () => cancelAnimationFrame(frame);
  }, [cached, variant]);
  return cached ? children : null;
}

/** The four wordmark textures, uploaded to the GPU once loaded (as drei's useTexture does). */
export function useHeroTextures() {
  const gl = useThree((state) => state.gl);
  const textures = useLoader(HeroTextureLoader, HERO_TEXTURE_URLS as unknown as string[]);
  useEffect(() => {
    textures.forEach((texture) => gl.initTexture(texture));
  }, [gl, textures]);
  return textures;
}
