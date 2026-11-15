import { useLoader, useThree } from '@react-three/fiber';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import * as THREE from 'three';
import { GLTF, GLTFLoader, MeshoptDecoder } from 'three-stdlib';
import { heroReadyAtom } from '@/atoms/loading';
import { HERO_MODEL_URL, HERO_TEXTURE_URLS } from './heroAssetUrls';

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

/** The four wordmark textures, uploaded to the GPU once loaded (as drei's useTexture does). */
export function useHeroTextures() {
  const gl = useThree((state) => state.gl);
  const textures = useLoader(HeroTextureLoader, HERO_TEXTURE_URLS as unknown as string[]);
  useEffect(() => {
    textures.forEach((texture) => gl.initTexture(texture));
  }, [gl, textures]);
  return textures;
}
