import React, { forwardRef, Ref, useEffect } from 'react';
import * as THREE from 'three';
import { useAnimations, useGLTF } from '@react-three/drei';
import { MeshTransmissionMaterial } from '@/utils/three/meshTransmissionMaterial';

const DragonModelTemp = forwardRef((props, ref: Ref<THREE.Group>) => {
  const { scene, animations } = useGLTF('/models/animal1.glb');
  const { actions, names } = useAnimations(animations, scene);

  useEffect(() => {
    const material = Object.assign(new MeshTransmissionMaterial(10), {
      resolution: 1024,
      background: new THREE.Color(0xffffff),
      roughness: 0.3,
      metalness: 0.1,
      chromaticAberration: 0.4,
      transmission: 0.8,
      thickness: 10,
    });
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.material = material;
      }
    });
  }, [scene]);

  useEffect(() => {
    actions[names[0]]?.reset().play();
  }, [actions, names]);

  return (
    <group ref={ref} {...props} position={[0, -10, 0]}>
      <group scale={0.13} position={[2, -2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <primitive object={scene}></primitive>
      </group>
    </group>
  );
});
DragonModelTemp.displayName = 'DragonModelTemp';

export default DragonModelTemp;
