import ConnectGL from '@/components/gl/ConnectGL';
import VisionGL from '@/components/gl/VisionGL';
import { PerspectiveCamera, Preload, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import { Fluid } from './fluid/Fluid';
import GLBoundary, { ModelBoundary, onCanvasCreated } from '@/components/gl/GLBoundary';
import { markHeroSceneFailed } from '@/hooks/useExperienceMode';
import { HeroAssetsGate, HeroReady, preloadHeroAssets } from '@/components/gl/heroAssets';
import dynamic from 'next/dynamic';
import FrameDriver from '@/components/gl/FrameDriver';
import { AdaptiveDprMonitor, useAdaptiveDpr } from '@/components/gl/AdaptiveDpr';
import { useGpuTier } from '@/motion/gpuTier';

// The performance overlay is a development tool (NEXT_PUBLIC_ENABLE_PREF=1 npm run dev). NODE_ENV is a build-time constant, so a
// production build drops this branch and the overlay never reaches the bundle.
const PrefHook =
  process.env.NODE_ENV === 'development' ? dynamic(() => import('@/components/gl/PrefHook'), { ssr: false }) : null;

export default function ThreeWrapper() {
  useGLTF.setDecoderPath('/assets/draco/');
  preloadHeroAssets('desktop');
  // MOT-06: the tier sets the pixel ratio cap, MSAA, glass samples and fluid grid; PerformanceMonitor steps the pixel
  // ratio down when the canvas cannot hold its frame rate. The composer does the antialiasing, so the canvas itself
  // has no antialias, stencil or depth buffer (the composer's render target has its own depth).
  const { tier, budget } = useGpuTier();
  const { dpr, decline, incline } = useAdaptiveDpr(budget);

  return (
    <GLBoundary canvas="vision">
      <Canvas
        id="vision-canvas"
        frameloop="never"
        onCreated={onCanvasCreated('vision')}
        style={{ position: 'fixed', zIndex: 1 }}
        data-tier={tier}
        data-dpr={dpr}
        gl={{ alpha: true, antialias: false, stencil: false, depth: false, powerPreference: budget.powerPreference }}
        dpr={dpr}
      >
        <FrameDriver />
        <AdaptiveDprMonitor decline={decline} incline={incline} />
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={40} />
        <directionalLight position={[0, 5, 5]} intensity={Math.PI / 2} />
        <ambientLight position={[0, 0, 5]} intensity={Math.PI / 2} />
        {/* Performance monitoring - development only */}
        {PrefHook && process.env.NEXT_PUBLIC_ENABLE_PREF && <PrefHook />}
        {/* The hero alone gates the loader; Connect (and its jellyfish) can never hold it back. */}
        <ModelBoundary canvas="vision" model="hero" onError={markHeroSceneFailed}>
          <HeroAssetsGate variant="desktop">
            <VisionGL />
            <Preload all />
            <HeroReady />
          </HeroAssetsGate>
        </ModelBoundary>
        <ModelBoundary canvas="vision" model="connect">
          <ConnectGL />
        </ModelBoundary>
        <EffectComposer multisampling={budget.multisampling} stencilBuffer={false}>
          <>{budget.fluidSimRes !== null && <Fluid simRes={budget.fluidSimRes} />}</>
        </EffectComposer>
      </Canvas>
    </GLBoundary>
  );
}
