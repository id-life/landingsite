import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import ValueGL from '@/components/gl/ValueGL';
import VisionGL from '@/components/gl/VisionGL';
import { FluidEffect } from './effects/FluidEffect';

export default function ThreeWrapper() {
  return (
    <Canvas
      id="vision-canvas"
      style={{ position: 'fixed', zIndex: 1 }}
      camera={{ position: [0, 0, 10], fov: 40 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      }}
    >
      <directionalLight position={[0, 5, 5]} intensity={Math.PI / 2} />
      <ambientLight position={[0, 0, 5]} intensity={Math.PI / 2} />
      <Suspense>
        <VisionGL />
      </Suspense>
      <Suspense>
        <ValueGL />
      </Suspense>
      <FluidEffect />
    </Canvas>
  );
}
