import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { twinGlLoadedAtom } from '@/atoms/geo';
import { currentModelAtom } from '@/atoms/twin';
import { useProgress } from '@react-three/drei';
import ProgressLoader from '@/components/gl/ProgressLoader';

export default function Loader() {
  const { progress, active, loaded } = useProgress();
  const setTwinLoaded = useSetAtom(twinGlLoadedAtom);
  const setCurrentModel = useSetAtom(currentModelAtom);
  // 设置全局加载完成
  useEffect(() => {
    if (!active) {
      setTwinLoaded(true);
    }
    return () => {
      setTwinLoaded(true);
    };
  }, [active, setCurrentModel, setTwinLoaded]);

  return <ProgressLoader progress={progress.toFixed(2)} />;
}
