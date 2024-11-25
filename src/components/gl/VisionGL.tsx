import { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';
import CenterLogo from './model/vision/CenterLogo';
import DragonModel from './model/vision/DragonModel';

export default function VisionGL() {
  const { viewport } = useThree();

  const [scale, setScale] = useState(1);

  useEffect(() => {
    const newScale = Math.min(1, (1 * viewport?.width) / 10);
    setScale(newScale);
  }, [viewport?.width]);

  return (
    <group scale={scale}>
      <CenterLogo />
      <DragonModel />
    </group>
  );
}
