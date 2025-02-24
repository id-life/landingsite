import { glLoadedAtom, globalLoadedAtom, isCNAtom } from '@/atoms/geo';
import ValueGL from '@/components/gl/ValueGL';
import VisionGL from '@/components/gl/VisionGL';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useThrottle } from '@/hooks/useThrottle';
import { PerspectiveCamera, useProgress, View } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useSetAtom } from 'jotai';
import { Suspense, useEffect } from 'react';
import { Fluid } from './fluid/Fluid';
import ProgressLoader, { OuterLoader } from './ProgressLoader';

function Loader() {
  const { progress, active } = useProgress();
  const setGlobalLoaded = useSetAtom(globalLoadedAtom);
  const setGLLoaded = useSetAtom(glLoadedAtom);
  // 设置全局加载完成
  useEffect(() => {
    if (!active) {
      setGlobalLoaded(true);
      setGLLoaded(true);
    }
  }, [active, setGlobalLoaded, setGLLoaded]);

  useEffect(() => {
    const smoother = ScrollSmoother.get();
    if (!smoother) return;
    smoother.paused(active);
  }, [active]);

  return <ProgressLoader progress={progress.toFixed(2)} />;
}

export default function ThreeWrapper() {
  const setIsCN = useSetAtom(isCNAtom);
  const isMobile = useIsMobile();

  const handleClick = useThrottle(() => {
    if (!isMobile) return;
    setIsCN((prev) => !prev);
  }, 200);

  return (
    <Canvas
      id="vision-canvas"
      style={{ position: 'fixed', zIndex: 1 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      }}
      onClick={handleClick}
    >
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={40} />
      <directionalLight position={[0, 5, 5]} intensity={Math.PI / 2} />
      <ambientLight position={[0, 0, 5]} intensity={Math.PI / 2} />
      <OuterLoader />
      <Suspense fallback={<Loader />}>
        <VisionGL />
        <ValueGL />
      </Suspense>
      <EffectComposer>
        <Fluid />
      </EffectComposer>
    </Canvas>
  );
}
