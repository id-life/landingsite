import * as THREE from 'three';
import React, { forwardRef, Ref } from 'react';
import { MeshTransmissionMaterial, useGLTF } from '@react-three/drei';

const InitRotation = Math.PI / 2;

const DragonModelTemp = forwardRef((props, ref: Ref<THREE.Group>) => {
  const {nodes} = useGLTF('/models/logo.glb');

  return (
    <group ref={ref} {...props} scale={0.13} position={[0, -10, 0]} rotation={[0, InitRotation, 0]}>
      <mesh geometry={(nodes.logo as any).geometry}>
        <MeshTransmissionMaterial
          resolution={1024}
          background={new THREE.Color(0xffffff)}
          roughness={0.3}
          metalness={0.1}
          chromaticAberration={0.4}
          transmission={0.8}
          thickness={10}
        />
      </mesh>
    </group>
  );
});
DragonModelTemp.displayName = 'DragonModelTemp';

export default DragonModelTemp;
