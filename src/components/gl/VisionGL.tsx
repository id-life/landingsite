import { Suspense, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import CenterLogo from './CenterLogo';
import { DragonModel } from './model/dragon/DragonModel';

function VisionGLGroup() {
  const { viewport } = useThree();

  const [scale, setScale] = useState(1);

  useEffect(() => {
    const newScale = Math.min(1, (1 * viewport?.width) / 10);
    setScale(newScale);
  }, [viewport?.width]);

  return (
    <group scale={scale}>
      <CenterLogo />
      <DragonModel />
    </group>
  );
}

export default function VisionGL() {
  return (
    <Canvas
      id="vision-canvas"
      style={{ position: 'fixed', zIndex: 1 }}
      camera={{ position: [0, 0, 10], fov: 40 }}
      gl={{ alpha: true, antialias: true }}
    >
      <directionalLight position={[0, 5, 5]} intensity={Math.PI / 2} />
      <ambientLight position={[0, 0, 5]} intensity={Math.PI / 2} />
      <Suspense>
        <VisionGLGroup />
      </Suspense>
    </Canvas>
  );
}
