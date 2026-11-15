import { useMemo } from 'react';
import { cn } from '@/utils';
import { useAtomValue } from 'jotai';
import { Fluid } from './fluid/Fluid';
import { NAV_LIST } from '../nav/nav';
import { Canvas } from '@react-three/fiber';
import MobileConnectGL from './MobileConnectGL';
import MobileVisionGL from './MobileVisionGL';
import { mobileCurrentPageAtom } from '@/atoms';
import { useIsMounted } from '@/hooks/useIsMounted';
import GLBoundary, { ModelBoundary, onCanvasCreated } from '@/components/gl/GLBoundary';
import { markHeroSceneFailed } from '@/hooks/useExperienceMode';
import { EffectComposer } from '@react-three/postprocessing';
import { useGLTF } from '@react-three/drei';
import FrameDriver from './FrameDriver';
import { HeroAssetsGate, HeroReady, preloadHeroAssets } from './heroAssets';

export default function MobileThreeWrapper() {
  preloadHeroAssets('phone');
  useGLTF.setDecoderPath('/assets/draco/');
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  // Vision 和 Connect 页面显示 Canvas
  const showCanvas = useMemo(() => [NAV_LIST[0].id, NAV_LIST[NAV_LIST.length - 1].id].includes(currentPage.id), [currentPage]);
  const isMounted = useIsMounted();
  if (!isMounted) return null;

  return (
    <GLBoundary canvas="vision">
      <Canvas
        id="vision-canvas"
        frameloop="never"
        onCreated={onCanvasCreated('vision')}
        className={cn('pointer-events-none', !showCanvas && 'invisible opacity-0')}
        style={{ position: 'fixed', zIndex: 1 }}
        camera={{ position: [0, 0, 10], fov: 40 }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
        }}
      >
        <FrameDriver />
        <directionalLight position={[0, 5, 5]} intensity={Math.PI / 2} />
        <ambientLight position={[0, 0, 5]} intensity={Math.PI / 2} />
        {/* The hero alone gates the loader; Connect (and its jellyfish) can never hold it back. */}
        <ModelBoundary canvas="vision" model="hero" onError={markHeroSceneFailed}>
          <HeroAssetsGate variant="phone">
            <MobileVisionGL />
            <HeroReady />
          </HeroAssetsGate>
        </ModelBoundary>
        <ModelBoundary canvas="vision" model="connect">
          <MobileConnectGL />
        </ModelBoundary>
        <EffectComposer>
          <Fluid />
        </EffectComposer>
      </Canvas>
    </GLBoundary>
  );
}
