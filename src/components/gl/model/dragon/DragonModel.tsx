import React, { useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import { useGSAP } from '@gsap/react';
import { useGesture } from '@use-gesture/react';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial, useGLTF } from '@react-three/drei';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

gsap.registerPlugin(useGSAP);

const InitRotation = Math.PI / 2;

export function DragonModel(props: {}) {
  const { events, size } = useThree();
  const { nodes } = useGLTF('/models/logo.glb');
  const modelRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [autoSwing, setAutoSwing] = useState(false);
  const rotationRef = useRef(InitRotation);
  const smootherRef = useRef(ScrollSmoother.get());
  const backgroundRef = useRef(new THREE.Color(0xffffff));

  useFrame(({ clock }) => {
    if (!modelRef.current || !smootherRef.current) return;
    if (autoSwing && !isDragging) {
      modelRef.current.rotation.y = rotationRef.current + Math.sin(clock.elapsedTime) * 0.1;
    }
    const scrollTop = smootherRef.current.scrollTop();
    const r = THREE.MathUtils.mapLinear(scrollTop, 0, size.height, 1, 193 / 255);
    const g = THREE.MathUtils.mapLinear(scrollTop, 0, size.height, 1, 17 / 255);
    const b = THREE.MathUtils.mapLinear(scrollTop, 0, size.height, 1, 17 / 255);
    backgroundRef.current.setRGB(r, g, b);
  });

  const bind = useGesture(
    {
      onHover: ({ last }) => {
        events.connected.style.cursor = last ? 'auto' : 'grab';
      },
      onDrag: ({ active, movement: [x] }) => {
        if (!modelRef.current) return;
        if (active) {
          setIsDragging(true);
          setAutoSwing(false);
          events.connected.style.cursor = 'grabbing';
          modelRef.current.rotation.y = rotationRef.current + x / 100;
        } else {
          setIsDragging(false);
          events.connected.style.cursor = 'grab';
          const r = modelRef.current.rotation.y + InitRotation - (modelRef.current.rotation.y % (Math.PI * 2));
          rotationRef.current = r;
          gsap.to(modelRef.current.rotation, { y: r, onComplete: () => setAutoSwing(true) });
        }
      },
    },
    { drag: { filterTaps: true } },
  );

  useGSAP(
    () => {
      if (!modelRef.current) return;
      gsap.from(modelRef.current.position, {
        x: 0,
        y: 0,
        z: 10,
        ease: 'power3.out',
        duration: 1.5,
      });
      gsap.from(modelRef.current.rotation, {
        x: Math.PI,
        y: (Math.PI * 3) / 2,
        z: Math.PI,
        ease: 'power3.out',
        duration: 1.5,
        onComplete: () => setAutoSwing(true),
      });
    },
    { scope: modelRef },
  );

  return (
    <group {...(bind() as any)} ref={modelRef} {...props} scale={0.12} position={[0, 0, 0]} rotation={[0, InitRotation, 0]}>
      <mesh geometry={(nodes.logo as any).geometry}>
        <MeshTransmissionMaterial
          resolution={1024}
          background={backgroundRef.current}
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
