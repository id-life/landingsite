import { isCNAtom } from '@/atoms/geo';
import ValueGL from '@/components/gl/ValueGL';
import VisionGL from '@/components/gl/VisionGL';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useThrottle } from '@/hooks/useThrottle';
import { PerspectiveCamera, Preload } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import { useSetAtom } from 'jotai';
import { Suspense, useMemo } from 'react';
import { Fluid } from './fluid/Fluid';
import { ErrorBoundary } from 'react-error-boundary';
import { useIsMounted } from '@/hooks/useIsMounted';
import PrefHook from '@/components/gl/PrefHook';

export default function ThreeWrapper() {
  const setIsCN = useSetAtom(isCNAtom);
  const isMobile = useIsMobile();
  const isMounted = useIsMounted();

  const devicePixelRatio = useMemo(() => {
    if (!isMounted) return 1;
    return typeof window !== 'undefined' ? window.devicePixelRatio : 1;
  }, [isMounted]);

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
          antialias: !isMobile,
          powerPreference: 'high-performance',
          pixelRatio: Math.min(devicePixelRatio, isMobile ? 1.5 : 2),
        }}
        dpr={Math.min(devicePixelRatio, isMobile ? 1.5 : 2)}
        onClick={handleClick}
        fallback={<div>Sorry no WebGL supported!</div>}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={40} />
        <directionalLight position={[0, 5, 5]} intensity={Math.PI / 2} />
        <ambientLight position={[0, 0, 5]} intensity={Math.PI / 2} />
        {/* Performance monitoring - enable in development */}
        {process.env.NEXT_PUBLIC_ENABLE_PREF && <PrefHook />}
        <Suspense fallback={null}>
          <VisionGL />
          <ValueGL />
          <Preload all />
        </Suspense>
        <EffectComposer>
          <Fluid />
        </EffectComposer>
      </Canvas>
    </ErrorBoundary>
  );
}
