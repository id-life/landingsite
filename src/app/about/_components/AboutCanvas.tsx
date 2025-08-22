'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { EffectComposer } from '@react-three/postprocessing';
import AnimalModel from '@/app/about/_components/AnimalModel';

export default function AboutCanvas() {
  return (
    <Canvas
      style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', zIndex: -1 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={40} />
      <directionalLight position={[0, 5, 5]} intensity={Math.PI / 2} />
      <ambientLight position={[0, 0, 5]} intensity={Math.PI / 2} />
      <Suspense>
        <AnimalModel />
      </Suspense>
      <EffectComposer>
        <></>
      </EffectComposer>
    </Canvas>
  );
}
