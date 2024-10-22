import { useMemo, useRef } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import { Center, Svg } from '@react-three/drei';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useFrame, useThree } from '@react-three/fiber';

export default function CenterLogo() {
  const { pointer, size } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const smootherRef = useRef(ScrollSmoother.get());

  useFrame(() => {
    if (!groupRef.current || !smootherRef.current) return;
    const positionX = THREE.MathUtils.mapLinear(pointer.x, -1, 1, -0.1, 0.1);
    const positionY = THREE.MathUtils.mapLinear(pointer.y, -1, 1, -0.1, 0.1);
    const rotationX = THREE.MathUtils.mapLinear(pointer.y, -1, 1, Math.PI / 64, -Math.PI / 64);
    const rotationY = THREE.MathUtils.mapLinear(pointer.x, -1, 1, Math.PI / 64, -Math.PI / 64);
    gsap.to(groupRef.current.position, { x: positionX, y: positionY, duration: 0.8 });
    gsap.to(groupRef.current.rotation, { x: rotationX, y: rotationY, duration: 0.8 });

    const scrollTop = smootherRef.current.scrollTop();
    const scrollY = THREE.MathUtils.mapLinear(scrollTop, 0, size.height, 0, 10);
    if (scrollY) {
      groupRef.current.position.y = scrollY;
    }
  });

  return (
    <Center ref={groupRef} position={[0, 0, -5]}>
      <Svg scale={0.06} src="/svgs/logo-new.svg" fillMaterial={{ transparent: false }} />
    </Center>
  );
}
