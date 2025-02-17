import { useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import CenterLogo from './model/vision/CenterLogo';
import DragonModel from './model/vision/DragonModel';
import MobileDragonModel from './model/vision/MobileDragonModel';
import { useIsMobile } from '@/hooks/useIsMobile';
import MobileCenterLogo from './model/vision/MobileCenterLogo';

export default function VisionGL() {
  const { viewport } = useThree();
  const [scale, setScale] = useState(1);
  const isMobile = useIsMobile();

  useEffect(() => {
    const newScale = Math.min(1, (1 * viewport?.width) / 10);
    setScale(newScale);
  }, [viewport?.width]);

  return (
    <group scale={scale}>
      {isMobile ? (
        <>
          <MobileCenterLogo />
          <MobileDragonModel />
        </>
      ) : (
        <>
          <CenterLogo />
          <DragonModel />
        </>
      )}
    </group>
  );
}
