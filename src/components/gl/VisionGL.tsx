import { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import CenterLogo from './model/vision/CenterLogo';
import DragonModel from './model/vision/DragonModel';
import { useIsMobile } from '@/hooks/useIsMobile';
import MobileDragonModel from './model/vision/MobileDragonModel';

export default function VisionGL() {
  const { viewport } = useThree();
  const isMobile = useIsMobile();
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const newScale = Math.min(1, (1 * viewport?.width) / 10);
    setScale(newScale);
  }, [viewport?.width]);

  console.log('scale:', scale);

  return (
    <group scale={scale}>
      <CenterLogo />
      {isMobile ? <MobileDragonModel /> : <DragonModel />}
    </group>
  );
}
