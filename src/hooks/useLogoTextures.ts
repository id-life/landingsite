import { useTexture } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';

interface LogoTextures {
  logoEnTexture: THREE.Texture;
  logoCnTexture: THREE.Texture;
  descEnTexture: THREE.Texture;
  descCnTexture: THREE.Texture;
  logoEnAspectRatio: number;
  logoCnAspectRatio: number;
  descEnAspectRatio: number;
  descCnAspectRatio: number;
}

export function useLogoTextures(): LogoTextures {
  // Preload all textures with optimal format
  const [logoEnTexture, logoCnTexture, descEnTexture, descCnTexture] = useTexture([
    `/textures/logos/logo-en.png`,
    `/textures/logos/logo-cn.png`,
    `/textures/logos/main-description.png`,
    `/textures/logos/main-description-cn.png`,
  ]);

  // Calculate aspect ratios separately for each language to prevent distortion
  const { logoEnAspectRatio, logoCnAspectRatio, descEnAspectRatio, descCnAspectRatio } = useMemo(() => {
    // Get aspect ratio from each texture image dimensions separately
    const logoEnRatio = logoEnTexture.image ? logoEnTexture.image.width / logoEnTexture.image.height : 2;
    const logoCnRatio = logoCnTexture.image ? logoCnTexture.image.width / logoCnTexture.image.height : 2;
    const descEnRatio = descEnTexture.image ? descEnTexture.image.width / descEnTexture.image.height : 5;
    const descCnRatio = descCnTexture.image ? descCnTexture.image.width / descCnTexture.image.height : 5;

    return {
      logoEnAspectRatio: logoEnRatio,
      logoCnAspectRatio: logoCnRatio,
      descEnAspectRatio: descEnRatio,
      descCnAspectRatio: descCnRatio,
    };
  }, [logoEnTexture, logoCnTexture, descEnTexture, descCnTexture]);

  // Optimize texture settings for UI elements
  useMemo(() => {
    [logoEnTexture, logoCnTexture, descEnTexture, descCnTexture].forEach((texture) => {
      // Balanced quality filtering - good quality without heavy performance impact
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;

      // Better performance settings
      texture.format = THREE.RGBAFormat;
      texture.generateMipmaps = true; // Enable mipmaps for better quality at distance

      // Ensure consistent color space for all textures
      texture.colorSpace = THREE.SRGBColorSpace;

      // Keep default flipY behavior for correct orientation
      // texture.flipY = true is the default for proper texture orientation

      // Moderate anisotropy - balance between quality and performance
      // Check if window exists to prevent SSR errors
      const devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
      texture.anisotropy = Math.min(8, devicePixelRatio * 4); // Adaptive based on device capability

      // Ensure proper wrapping
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;

      // Ensure premultiplied alpha is consistent
      texture.premultiplyAlpha = false;

      // Force texture update to apply all settings
      texture.needsUpdate = true;
    });
  }, [logoEnTexture, logoCnTexture, descEnTexture, descCnTexture]);

  return {
    logoEnTexture,
    logoCnTexture,
    descEnTexture,
    descCnTexture,
    logoEnAspectRatio,
    logoCnAspectRatio,
    descEnAspectRatio,
    descCnAspectRatio,
  };
}
