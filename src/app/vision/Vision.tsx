import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import CenterLogo from '@/components/gl/CenterLogo';
import { DragonModel } from '@/components/gl/model/dragon/DragonModel';

export default function Vision() {
  return (
    <div className="page-container">
      <div className="absolute left-0 top-0 size-full">
        <Canvas camera={{ position: [0, 0, 10], fov: 40 }} gl={{ alpha: true, antialias: true }}>
          <Suspense>
            <CenterLogo />
            <DragonModel />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}
