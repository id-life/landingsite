import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { useProgress } from '@react-three/drei';
import { visionGlLoadedAtom } from '@/atoms/geo';
import ProgressLoader from '@/components/gl/ProgressLoader';

export default function Loader() {
  const { progress, active } = useProgress();
  const setGLLoaded = useSetAtom(visionGlLoadedAtom);

  // 设置全局加载完成
  useEffect(() => {
    if (!active) {
      setGLLoaded(true);
    }
    return () => {
      setGLLoaded(true);
    };
  }, [active, setGLLoaded]);

  return <ProgressLoader progress={progress.toFixed(2)} />;
}
