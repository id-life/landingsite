import { useProgress } from '@react-three/drei';
import { useSetAtom } from 'jotai/index';
import { glLoadedAtom } from '@/atoms/geo';
import { useEffect } from 'react';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import ProgressLoader from '@/components/gl/ProgressLoader';
import { currentModelAtom, PredictionModel } from '@/atoms/twin';

export default function Loader() {
  const { progress, active } = useProgress();
  // const setGlobalLoaded = useSetAtom(globalLoadedAtom);
  const setGLLoaded = useSetAtom(glLoadedAtom);
  const setCurrentModel = useSetAtom(currentModelAtom);
  // 设置全局加载完成
  useEffect(() => {
    console.log(active);
    if (!active) {
      // setGlobalLoaded(true); // 看 OuterLoader
      setGLLoaded(true);
      setCurrentModel(PredictionModel.M0);
    }
  }, [active, setCurrentModel, setGLLoaded]);

  useEffect(() => {
    const smoother = ScrollSmoother.get();
    if (!smoother) return;
    smoother.paused(active);
  }, [active]);

  return <ProgressLoader progress={progress.toFixed(2)} />;
}
