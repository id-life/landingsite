import { useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { type SvgImage, useHeroSvgImages } from '@/components/gl/heroAssets';
import { LOGO_PLANE_HEIGHT } from '@/components/gl/model/vision/heroFit';

/**
 * The desktop wordmark and tagline as textures drawn from the vector SVGs at the resolution the screen shows them
 * (VIS-03). They used to be 512 px high bitmaps, upscaled 1.2x on a 4K and 1.6x on a 5K display.
 *
 * At group scale 1 the wordmark plane is 28.4 % of the drawing buffer's height (heroFit.ts: a 3.1-high plane at
 * distance 15 under a 40 degree field of view), never more; the texture is that tall (capped at 2048), rounded up to a
 * 128 px bucket so a resize redraws it only when the bucket changes. The tagline plane is 0.25 high: same pixels per
 * unit, drawn 2x for its thin strokes.
 */
const PLANE_SHARE = 0.284;
const DESC_PLANE_HEIGHT = 0.25;
const DESC_OVERSAMPLE = 2;
const BUCKET = 128;
const MAX_TEXTURE = 2048;

function rasterise(svg: SvgImage, height: number) {
  const canvas = document.createElement('canvas');
  canvas.height = Math.max(1, Math.round(height));
  canvas.width = Math.min(4096, Math.max(1, Math.round(height * svg.aspect)));
  canvas.getContext('2d')?.drawImage(svg.image, 0, 0, canvas.width, canvas.height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 4;
  return texture;
}

export function useLogoTextures() {
  const [logoEn, descEn] = useHeroSvgImages();
  const gl = useThree((state) => state.gl);
  // Drawing-buffer height (CSS height x pixel ratio): the 128 px bucket is the dependency, not every resize.
  const bufferHeight = useThree((state) => state.size.height * state.viewport.dpr);
  const logoHeight = Math.min(MAX_TEXTURE, Math.ceil((PLANE_SHARE * bufferHeight) / BUCKET) * BUCKET);

  const textures = useMemo(() => {
    const descHeight = Math.min(MAX_TEXTURE, (logoHeight * DESC_PLANE_HEIGHT * DESC_OVERSAMPLE) / LOGO_PLANE_HEIGHT);
    return { logoEnTexture: rasterise(logoEn, logoHeight), descEnTexture: rasterise(descEn, descHeight) };
  }, [logoEn, descEn, logoHeight]);

  useEffect(() => {
    gl.initTexture(textures.logoEnTexture);
    gl.initTexture(textures.descEnTexture);
    // Exposed for the VIS-03 check: the wordmark texture's height in device pixels.
    gl.domElement.setAttribute('data-wordmark-texture-px', String(textures.logoEnTexture.image.height));
    return () => {
      textures.logoEnTexture.dispose();
      textures.descEnTexture.dispose();
    };
  }, [gl, textures]);

  return { ...textures, logoEnAspectRatio: logoEn.aspect, descEnAspectRatio: descEn.aspect };
}
