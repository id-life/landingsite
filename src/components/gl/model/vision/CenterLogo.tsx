import { useRef } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { Center, Svg } from '@react-three/drei';
import { LogoType } from '@/components/nav/Logo';
import { useThrottle } from '@/hooks/useThrottle';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useFrame, useThree } from '@react-three/fiber';

export default function CenterLogo() {
  const { pointer, size } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const smootherRef = useRef(ScrollSmoother.get());
  const LogoENRef = useRef<THREE.Group>(null);
  const LogoCNRef = useRef<THREE.Group>(null);
  const DescriptionCNRef = useRef<THREE.Group>(null);
  const DescriptionENRef = useRef<THREE.Group>(null);
  const currentLogoRef = useRef<LogoType>(LogoType.EN);

  useFrame(() => {
    if (!groupRef.current || !smootherRef.current) return;
    const positionX = THREE.MathUtils.mapLinear(pointer.x, -1, 1, -0.15, 0.15);
    const positionY = THREE.MathUtils.mapLinear(pointer.y, -1, 1, -0.15, 0.15);
    const rotationX = THREE.MathUtils.mapLinear(pointer.y, -1, 1, Math.PI / 32, -Math.PI / 32);
    const rotationY = THREE.MathUtils.mapLinear(pointer.x, -1, 1, Math.PI / 32, -Math.PI / 32);
    gsap.to(groupRef.current.position, { x: positionX, y: positionY, duration: 0.8 });
    gsap.to(groupRef.current.rotation, { x: rotationX, y: rotationY, duration: 0.8 });

    const scrollTop = smootherRef.current.scrollTop();
    const scrollY = THREE.MathUtils.mapLinear(scrollTop, 0, size.height, 0, 10);
    if (scrollY) {
      groupRef.current.position.y = scrollY;
      groupRef.current.position.z = -5 - scrollY;
    }
  });

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
      DescriptionENRef.current?.traverse((object: any) => {
        if (object.material) {
          gsap.to(object.material, { opacity: 0, duration: 0.5 });
        }
      });
      DescriptionCNRef.current?.traverse((object: any) => {
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
      DescriptionCNRef.current?.traverse((object: any) => {
        if (object.material) {
          gsap.to(object.material, { opacity: 0, duration: 0.5 });
        }
      });
      DescriptionENRef.current?.traverse((object: any) => {
        if (object.material) {
          gsap.to(object.material, { opacity: 1, duration: 0.5, delay: 0.3 });
        }
      });
    }
  }, 800);

  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      <Center onClick={handleClick}>
        <Svg ref={LogoENRef} scale={0.06} src="/svgs/logo-en.svg" fillMaterial={{ opacity: 1 }} />
        <Svg ref={LogoCNRef} scale={0.025} src="/svgs/logo-cn.svg" fillMaterial={{ opacity: 0 }} />
      </Center>
      <Center position={[0, -3.5, 0]}>
        <Svg ref={DescriptionENRef} scale={0.01} src="/svgs/main-description.svg" fillMaterial={{ opacity: 1 }} />
      </Center>
      <Center position={[0, -3.5, 0]}>
        <Svg ref={DescriptionCNRef} scale={0.01} src="/svgs/main-description-cn.svg" fillMaterial={{ opacity: 0 }} />
      </Center>
    </group>
  );
}
