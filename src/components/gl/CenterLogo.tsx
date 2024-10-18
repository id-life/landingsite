import { Center, Svg } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function CenterLogo() {
  const { pointer, viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  const [scale, setScale] = useState(1);

  useEffect(() => {
    const newScale = Math.min(1, (1 * viewport?.width) / 10);
    setScale(newScale);
  }, [viewport?.width]);

  useFrame(() => {
    if (!groupRef.current) return;
    const positionX = THREE.MathUtils.mapLinear(pointer.x, -1, 1, -0.1, 0.1);
    const positionY = THREE.MathUtils.mapLinear(pointer.y, -1, 1, -0.1, 0.1);
    const rotationX = THREE.MathUtils.mapLinear(pointer.y, -1, 1, Math.PI / 64, -Math.PI / 64);
    const rotationY = THREE.MathUtils.mapLinear(pointer.x, -1, 1, Math.PI / 64, -Math.PI / 64);
    gsap.to(groupRef.current.position, { x: positionX, y: positionY, duration: 0.8 });
    gsap.to(groupRef.current.rotation, { x: rotationX, y: rotationY, duration: 0.8 });
  });

  return (
    <Center ref={groupRef} scale={scale} position={[0, 0, -5]}>
      <Svg scale={0.06} src="/svgs/logo-new.svg" fillMaterial={{ transparent: false }} />
    </Center>
  );
}
