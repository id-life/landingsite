import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { useProgress } from '@react-three/drei';
import { currentModelAtom } from '@/atoms/twin';
import { visionGlLoadedAtom } from '@/atoms/geo';
import ProgressLoader from '@/components/gl/ProgressLoader';

export default function Loader() {
  const { progress, active, loaded } = useProgress();
  const setGLLoaded = useSetAtom(visionGlLoadedAtom);
  const setCurrentModel = useSetAtom(currentModelAtom);

  // 设置全局加载完成
  useEffect(() => {
    if (!active) {
      setGLLoaded(true);
    }
    return () => {
      setGLLoaded(true);
    };
  }, [active, setCurrentModel, setGLLoaded]);

  return <ProgressLoader progress={progress.toFixed(2)} />;
}
