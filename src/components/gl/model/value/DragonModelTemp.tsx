import * as THREE from 'three';
import React, { useRef } from 'react';
import { MeshTransmissionMaterial, useGLTF } from '@react-three/drei';

const InitRotation = Math.PI / 2;

export default function DragonModelTemp(props: {}) {
  const { nodes } = useGLTF('/models/logo.glb');
  const modelRef = useRef<THREE.Group>(null);

  return (
    <group ref={modelRef} {...props} scale={0.13} position={[0, -10, 0]} rotation={[0, InitRotation, 0]}>
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
}
