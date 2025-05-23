import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { useProgress } from '@react-three/drei';
import { visionGlLoadedAtom } from '@/atoms/geo';

export default function Loader() {
  const { active } = useProgress();
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

  return null;
  // return <ProgressLoader progress={progress.toFixed(2)} />;
}
