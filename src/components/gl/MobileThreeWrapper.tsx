import { Suspense, useMemo } from 'react';
import { cn } from '@/utils';
import { useAtomValue } from 'jotai';
import { Fluid } from './fluid/Fluid';
import { NAV_LIST } from '../nav/nav';
import { Canvas } from '@react-three/fiber';
import MobileValueGL from './MobileValueGL';
import MobileVisionGL from './MobileVisionGL';
import { mobileCurrentPageAtom } from '@/atoms';
import { useIsMounted } from '@/hooks/useIsMounted';
import { ErrorBoundary } from 'react-error-boundary';
import { EffectComposer } from '@react-three/postprocessing';

export default function MobileThreeWrapper() {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const showCanvas = useMemo(() => [NAV_LIST[0].id, NAV_LIST[NAV_LIST.length - 1].id].includes(currentPage.id), [currentPage]);
  const isMounted = useIsMounted();
  if (!isMounted) return null;
  return (
    <ErrorBoundary fallback={<div>Sorry WebGL loading error!</div>}>
      <Canvas
        id="vision-canvas"
        className={cn('pointer-events-none', { 'pointer-events-none hidden': !showCanvas })}
        style={{ position: 'fixed', zIndex: 1 }}
        camera={{ position: [0, 0, 10], fov: 40 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
        fallback={<div>Sorry no WebGL supported!</div>}
      >
        <directionalLight position={[0, 5, 5]} intensity={Math.PI / 2} />
        <ambientLight position={[0, 0, 5]} intensity={Math.PI / 2} />
        <Suspense fallback={null}>
          <MobileVisionGL />
          <MobileValueGL />
        </Suspense>
        <EffectComposer>
          <Fluid />
        </EffectComposer>
      </Canvas>
    </ErrorBoundary>
  );
}
