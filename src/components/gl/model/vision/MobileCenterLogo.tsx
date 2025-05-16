import { mobileCurrentPageAtom } from '@/atoms';
import { LogoType } from '@/components/nav/Logo';
import { useThrottle } from '@/hooks/useThrottle';
import { Center, Svg } from '@react-three/drei';
import { gsap } from 'gsap';
import { useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function MobileCenterLogo() {
  const groupRef = useRef<THREE.Group>(null);
  const LogoENRef = useRef<THREE.Group>(null);
  const LogoCNRef = useRef<THREE.Group>(null);
  const currentLogoRef = useRef<LogoType>(LogoType.EN);
  const currentPage = useAtomValue(mobileCurrentPageAtom);

  useEffect(() => {
    if (!groupRef.current) return;
  }, [currentPage]);

  const handleClick = useThrottle(() => {
    if (currentLogoRef.current === LogoType.EN) {
      currentLogoRef.current = LogoType.CN;
      LogoENRef.current?.traverse((object: any) => {
        if (object.material) {
          gsap.to(object.material, { opacity: 0, duration: 0.5 });
        }
      });
      LogoCNRef.current?.traverse((object: any) => {
        if (object.material) {
          gsap.to(object.material, { opacity: 1, duration: 0.5, delay: 0.3 });
        }
      });
    } else {
      currentLogoRef.current = LogoType.EN;
      LogoCNRef.current?.traverse((object: any) => {
        if (object.material) {
          gsap.to(object.material, { opacity: 0, duration: 0.5 });
        }
      });
      LogoENRef.current?.traverse((object: any) => {
        if (object.material) {
          gsap.to(object.material, { opacity: 1, duration: 0.5, delay: 0.3 });
        }
      });
    }
  }, 800);

  return (
    <group>
      <Center onClick={handleClick} scale={0.7} ref={groupRef} position={[0, 0, -5]}>
        <Svg ref={LogoENRef} scale={0.06} src="/svgs/logo-en.svg" fillMaterial={{ opacity: 1 }} />
        <Svg ref={LogoCNRef} scale={0.025} src="/svgs/logo-cn.svg" fillMaterial={{ opacity: 0 }} />
      </Center>
      <Center position={[0, -2.6, 0]}>
        <Svg scale={0.01} src="/svgs/main-description.svg" fillMaterial={{ opacity: 1 }} />
      </Center>
    </group>
  );
}
