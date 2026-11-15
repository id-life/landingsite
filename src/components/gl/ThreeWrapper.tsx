import ConnectGL from '@/components/gl/ConnectGL';
import VisionGL from '@/components/gl/VisionGL';
import { useIsMobile } from '@/hooks/useIsMobile';
import { PerspectiveCamera, Preload, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import { Suspense, useMemo } from 'react';
import { Fluid } from './fluid/Fluid';
import GLBoundary from '@/components/gl/GLBoundary';
import { watchWebGLContext } from '@/lib/analytics/experience';
import { useIsMounted } from '@/hooks/useIsMounted';
import { HeroAssetsGate, HeroReady, preloadHeroAssets } from '@/components/gl/heroAssets';
import dynamic from 'next/dynamic';

// The performance overlay is a development tool (NEXT_PUBLIC_ENABLE_PREF=1 npm run dev). NODE_ENV is a build-time constant, so a
// production build drops this branch and the overlay never reaches the bundle.
const PrefHook =
  process.env.NODE_ENV === 'development' ? dynamic(() => import('@/components/gl/PrefHook'), { ssr: false }) : null;

export default function ThreeWrapper() {
  useGLTF.setDecoderPath('/assets/draco/');
  preloadHeroAssets('desktop');
  const isMobile = useIsMobile();
  const isMounted = useIsMounted();

  const devicePixelRatio = useMemo(() => {
    if (!isMounted) return 1;
    return typeof window !== 'undefined' ? window.devicePixelRatio : 1;
  }, [isMounted]);

  return (
    <GLBoundary canvas="vision">
      <Canvas
        id="vision-canvas"
        onCreated={watchWebGLContext('vision')}
        style={{ position: 'fixed', zIndex: 1 }}
        gl={{
          alpha: true,
          antialias: !isMobile,
          powerPreference: 'high-performance',
          pixelRatio: Math.min(devicePixelRatio, isMobile ? 1.5 : 2),
        }}
        dpr={Math.min(devicePixelRatio, isMobile ? 1.5 : 2)}
        fallback={<div>Sorry no WebGL supported!</div>}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={40} />
        <directionalLight position={[0, 5, 5]} intensity={Math.PI / 2} />
        <ambientLight position={[0, 0, 5]} intensity={Math.PI / 2} />
        {/* Performance monitoring - development only */}
        {PrefHook && process.env.NEXT_PUBLIC_ENABLE_PREF && <PrefHook />}
        {/* The hero alone gates the loader; Connect (and its jellyfish) can never hold it back. */}
        <Suspense fallback={null}>
          <HeroAssetsGate variant="desktop">
            <VisionGL />
            <Preload all />
            <HeroReady />
          </HeroAssetsGate>
        </Suspense>
        <Suspense fallback={null}>
          <ConnectGL />
        </Suspense>
        <EffectComposer>
          <Fluid />
        </EffectComposer>
      </Canvas>
    </GLBoundary>
  );
}
