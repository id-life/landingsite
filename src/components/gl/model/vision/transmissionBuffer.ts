import { useFBO } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import type { RefObject } from 'react';
import * as THREE from 'three';

/**
 * The glass dragon's transmission buffer as the original drew it. Its MeshTransmissionMaterial (drei 9) rendered the
 * scene behind the glass into a target `width` pixels wide and as tall as the drawing buffer (drei 9's useFBO took a
 * missing height as the screen's); drei 10 makes that target square (`width` x `width`), which halves the refracted
 * wordmark's sharpness and weakened the glass's colour fringes, the intro's colour burst among them, by about 15 %.
 * This draws the same pass as drei 9 did (tone mapping off, the material's background, the glass itself hidden) into
 * a `width` x screen-height target, every frame the glass can be seen; pass the texture as the material's `buffer`,
 * so the material does not run its own square pass.
 */
export function useTransmissionBuffer(
  meshRef: RefObject<THREE.Mesh | null>,
  width: number,
  backgroundRef?: RefObject<THREE.Color>,
) {
  const height = useThree((state) => Math.max(1, Math.round(state.size.height * state.viewport.dpr)));
  const target = useFBO(width, height);
  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    for (let node: THREE.Object3D | null = mesh; node; node = node.parent) if (!node.visible) return;
    const oldTone = state.gl.toneMapping;
    const oldBackground = state.scene.background;
    state.gl.toneMapping = THREE.NoToneMapping;
    const background = backgroundRef?.current;
    if (background) state.scene.background = background;
    mesh.visible = false;
    state.gl.setRenderTarget(target);
    state.gl.render(state.scene, state.camera);
    mesh.visible = true;
    state.scene.background = oldBackground;
    state.gl.setRenderTarget(null);
    state.gl.toneMapping = oldTone;
  });
  return target.texture;
}
