import { useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import CenterLogo from './model/vision/CenterLogo';
import DragonModel from './model/vision/DragonModel';
import gsap from 'gsap';
import { NAV_LIST } from '@/components/nav/nav';
import * as THREE from 'three';
import { useGSAP } from '@gsap/react';

export default function VisionGL() {
  const { viewport } = useThree();
  const [scale, setScale] = useState(1);
  const modelRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const newScale = Math.min(1, (1 * viewport?.width) / 10);
    setScale(newScale);
  }, [viewport?.width]);

  useGSAP(() => {
    // in value page, hide dragon model
    gsap.timeline({
      scrollTrigger: {
        trigger: `#${NAV_LIST[5].id}`,
        scrub: true,
        onEnter: () => {
          if (!modelRef.current) return;
          gsap.set(modelRef.current, { visible: false });
        },
        onLeaveBack: () => {
          if (!modelRef.current) return;
          gsap.set(modelRef.current, { visible: true });
        },
      },
    });
  }, []);

  return (
    <group ref={modelRef} scale={scale}>
      <CenterLogo />
      <DragonModel />
    </group>
  );
}
