import { mobileCurrentPageAtom } from '@/atoms';
import { glLoadedAtom, globalLoadedAtom } from '@/atoms/geo';
import { useIsMounted } from '@/hooks/useIsMounted';
import { cn } from '@/utils';
import { useProgress } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { EffectComposer } from '@react-three/postprocessing';
import { useAtomValue, useSetAtom } from 'jotai';
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { NAV_LIST } from '../nav/nav';
import { Fluid } from './fluid/Fluid';
import MobileValueGL from './MobileValueGL';
import MobileVisionGL from './MobileVisionGL';
import ProgressLoader from './ProgressLoader';

function Loader() {
  const { progress, active } = useProgress();
  const setGLLoaded = useSetAtom(glLoadedAtom);
  // 设置全局加载完成
  useEffect(() => {
    if (!active) {
      setGLLoaded(true);
    }
  }, [active, setGLLoaded]);

  return <ProgressLoader progress={progress.toFixed(2)} />;
}

function OuterLoader() {
  const setGlobalLoaded = useSetAtom(globalLoadedAtom);
  const glLoaded = useAtomValue(glLoadedAtom);
  const [show, setShow] = useState(true);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useLayoutEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    if (glLoaded) {
      timer.current = setTimeout(() => {
        setShow(false); // 加载完后再延迟1s
        setGlobalLoaded(true);
      }, 300);
    }
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [glLoaded, setGlobalLoaded]);

  if (!glLoaded || !show) return null;
  return <ProgressLoader progress="100" />;
}
export default function MobileThreeWrapper() {
  const currentPage = useAtomValue(mobileCurrentPageAtom);
  const hideCanvas = useMemo(() => currentPage.id === NAV_LIST[1].id, [currentPage]);
  const isMounted = useIsMounted();
  if (!isMounted) return null;
  return (
    <Canvas
      id="vision-canvas"
      className={cn('pointer-events-none', { 'pointer-events-none hidden': hideCanvas })}
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
      <OuterLoader />
      <Suspense fallback={<Loader />}>
        <MobileVisionGL />
        <MobileValueGL />
      </Suspense>
      <EffectComposer>
        <Fluid />
      </EffectComposer>
    </Canvas>
  );
}
