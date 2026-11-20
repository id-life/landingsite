'use client';

import ConnectGL from '@/components/gl/ConnectGL';
import VisionGL from '@/components/gl/VisionGL';
import { mobileCurrentPageAtom } from '@/atoms';
import { NAV } from '@/components/nav/nav';
import { PerspectiveCamera, Preload, useGLTF } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import { clsx } from 'clsx';
import { useAtomValue } from 'jotai';
import dynamic from 'next/dynamic';
import { Fluid } from './fluid/Fluid';
import GLBoundary, { ModelBoundary, onCanvasCreated } from '@/components/gl/GLBoundary';
import { markHeroSceneFailed } from '@/hooks/useExperienceMode';
import { HeroAssetsGate, HeroReady, preloadHeroAssets } from '@/components/gl/heroAssets';
import FrameDriver from '@/components/gl/FrameDriver';
import { AdaptiveDprMonitor, useAdaptiveDpr } from '@/components/gl/AdaptiveDpr';
import { useGpuTier } from '@/motion/gpuTier';
import { useDeviceProfile } from '@/hooks/useDeviceProfile';

// The performance overlay is a development tool (NEXT_PUBLIC_ENABLE_PREF=1 npm run dev). NODE_ENV is a build-time
// constant, so a production build drops this branch and the overlay never reaches the bundle.
const PrefHook =
  process.env.NODE_ENV === 'development' ? dynamic(() => import('@/components/gl/PrefHook'), { ssr: false }) : null;

/**
 * The experience's main canvas (hero, dragon, wordmark, fluid, Connect's jellyfish), one for both decks (RWD-02; it
 * was ThreeWrapper and MobileThreeWrapper). It is mounted once by HomeEntry, above the deck, so a resize or a rotation
 * that changes the deck keeps the same <canvas> and WebGL context; only the scene inside follows the deck.
 *
 * What still differs by deck, chosen from the device profile (width, height, input):
 * - scene content: VisionGL and ConnectGL take the deck as a property (the desktop hero is textured and
 *   scroll-driven, the phone hero vector and paged; each module lists its differences);
 * - visibility: on the phone deck the canvas shows only on Mission and Connect (hidden canvases do not render, so
 *   this also stops its frames elsewhere); the desktop deck scrolls it with the sections;
 * - pointer: the phone canvas takes no pointer input (the page swipes under it).
 */
export default function ExperienceCanvas() {
  useGLTF.setDecoderPath('/assets/draco/');
  const profile = useDeviceProfile();
  const phone = profile?.tree === 'phone';
  const variant = phone ? 'phone' : 'desktop';
  preloadHeroAssets(variant);
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const shownOnPhone = currentPage.id === NAV.vision_page.id || currentPage.id === NAV.connect_page.id;
  // Every device starts at the original's quality (src/motion/gpuTier.ts); the pixel ratio steps down once the canvas
  // has failed to hold 30 fps for 2 s and back up when it holds 50 fps (AdaptiveDpr). Context attributes as originally.
  const { tier, budget } = useGpuTier();
  const { dpr, max, decline, incline } = useAdaptiveDpr(budget);
  // Unknown before hydration: the deck is not mounted either.
  if (!profile) return null;

  return (
    <GLBoundary canvas="vision">
      <Canvas
        id="vision-canvas"
        data-both-versions
        frameloop="never"
        onCreated={onCanvasCreated('vision')}
        className={clsx(phone && 'pointer-events-none', phone && !shownOnPhone && 'invisible opacity-0')}
        style={{ position: 'fixed', zIndex: 1 }}
        data-tier={tier}
        data-dpr={dpr}
        gl={{ alpha: true, antialias: true, powerPreference: budget.powerPreference }}
        dpr={dpr}
      >
        <FrameDriver />
        <AdaptiveDprMonitor dpr={dpr} max={max} decline={decline} incline={incline} />
        <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={40} />
        <directionalLight position={[0, 5, 5]} intensity={Math.PI / 2} />
        <ambientLight position={[0, 0, 5]} intensity={Math.PI / 2} />
        {PrefHook && process.env.NEXT_PUBLIC_ENABLE_PREF && <PrefHook />}
        {/* The hero alone gates the loader; Connect (and its jellyfish) can never hold it back. Keyed by deck, so a
            deck change remounts the scene (and its timelines) inside the same canvas. */}
        <ModelBoundary key={`hero-${variant}`} canvas="vision" model="hero" onError={markHeroSceneFailed}>
          <HeroAssetsGate variant={variant}>
            <VisionGL deck={variant} />
            {!phone && <Preload all />}
            <HeroReady />
          </HeroAssetsGate>
        </ModelBoundary>
        <ModelBoundary key={`connect-${variant}`} canvas="vision" model="connect">
          <ConnectGL deck={variant} />
        </ModelBoundary>
        <EffectComposer multisampling={budget.multisampling}>
          <>{budget.fluidSimRes !== null && <Fluid simRes={budget.fluidSimRes} />}</>
        </EffectComposer>
      </Canvas>
    </GLBoundary>
  );
}
