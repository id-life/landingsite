import { useProgress } from '@react-three/drei';
import { useSetAtom } from 'jotai/index';
import { glLoadedAtom, globalLoadedAtom } from '@/atoms/geo';
import { useEffect } from 'react';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import ProgressLoader from '@/components/gl/ProgressLoader';

export default function Loader() {
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
