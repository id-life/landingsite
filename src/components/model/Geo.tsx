import * as THREE from 'three';
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, MeshDistortMaterial } from '@react-three/drei';

export default function Model() {
  const group = useRef<THREE.Group>();
  const { nodes } = useGLTF('/models/geo.min.glb', true) as any;

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = (1 + Math.sin(clock.getElapsedTime() * 1.5)) / 2;
    group.current.position.y = t / 3;
  });

  return (
    <group dispose={null}>
      <group position={[0, 0, 0]} scale={5} ref={(ref: any) => (group.current = ref)}>
        <mesh geometry={nodes.geo.geometry} castShadow receiveShadow>
          <MeshDistortMaterial color="#ffffff" flatShading roughness={1} metalness={0.5} factor={15} speed={5} />
        </mesh>
        <mesh geometry={nodes.geo.geometry}>
          <meshBasicMaterial wireframe />
        </mesh>
      </group>
    </group>
  );
}
