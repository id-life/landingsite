import ValueGL from '@/components/gl/ValueGL';
import VisionGL from '@/components/gl/VisionGL';
import { Canvas } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import { Suspense } from 'react';
import { Fluid } from './fluid/Fluid';
import { useConfig } from './fluid/hooks/useConfig';

const opts = {
  showBackground: false,
  rainbow: true,
  radius: 0.07,
};
export default function ThreeWrapper() {
  const config = useConfig();
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

      <EffectComposer>
        <Fluid {...{ ...config, ...opts }} />
      </EffectComposer>
    </Canvas>
  );
}
