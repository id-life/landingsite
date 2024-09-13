import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, MeshDistortMaterial, Shadow } from '@react-three/drei';

export default function Model() {
  const group = useRef<any>(null);
  const shadow = useRef<any>(null);
  const { nodes } = useGLTF('/models/geo.min.glb', true) as any;

  useFrame(({ clock }) => {
    if (!group.current || !shadow.current) return;
    const t = (1 + Math.sin(clock.getElapsedTime() * 1.5)) / 2;
    group.current.position.x = 0;
    group.current.position.y = t / 3 + 0.4;
    group.current.position.z = 7;
    shadow.current.scale.x = (1 + t) * 2;
    shadow.current.scale.y = shadow.current.scale.z = 1 + t;
    group.current.rotation.x = group.current.rotation.z += 0.005;
  });

  return (
    <group dispose={null}>
      <group ref={group}>
        <mesh geometry={nodes.geo.geometry} castShadow receiveShadow>
          <MeshDistortMaterial color="#ffffff" flatShading roughness={1} metalness={0.5} factor={15} speed={5} />
        </mesh>
        <mesh geometry={nodes.geo.geometry}>
          <meshBasicMaterial wireframe />
        </mesh>
      </group>
      <Shadow ref={shadow} opacity={0.3} rotation-x={-Math.PI / 2} position={[0, -3.4, 0]} />
    </group>
  );
}
