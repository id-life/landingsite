import { isCNAtom } from '@/atoms/geo';
import ValueGL from '@/components/gl/ValueGL';
import VisionGL from '@/components/gl/VisionGL';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useThrottle } from '@/hooks/useThrottle';
import { PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import { useSetAtom } from 'jotai';
import { Suspense } from 'react';
import { Fluid } from './fluid/Fluid';
import { OuterLoader } from './ProgressLoader';
import Loader from '@/components/gl/Loader';
import { ErrorBoundary } from 'react-error-boundary';

export default function ThreeWrapper() {
  const setIsCN = useSetAtom(isCNAtom);
  const isMobile = useIsMobile();

  const handleClick = useThrottle(() => {
    if (!isMobile) return;
    setIsCN((prev) => !prev);
  }, 200);

  return (
    <ErrorBoundary fallback={<div>Sorry WebGL loading error!</div>}>
      <Canvas
        id="vision-canvas"
        style={{ position: 'fixed', zIndex: 1 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
        onClick={handleClick}
        fallback={<div>Sorry no WebGL supported!</div>}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={40} />
        <directionalLight position={[0, 5, 5]} intensity={Math.PI / 2} />
        <ambientLight position={[0, 0, 5]} intensity={Math.PI / 2} />
        {/* <Perf deepAnalyze={true} /> */}
        <OuterLoader />
        <Suspense fallback={<Loader />}>
          <VisionGL />
          <ValueGL />
        </Suspense>
        <EffectComposer>
          <Fluid />
        </EffectComposer>
      </Canvas>
    </ErrorBoundary>
  );
}
