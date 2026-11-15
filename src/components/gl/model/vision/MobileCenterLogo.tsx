import { Center, Svg } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

export default function MobileCenterLogo() {
  const LogoENRef = useRef<THREE.Group>(null);
  const LogoCNRef = useRef<THREE.Group>(null);
  const DescriptionCNRef = useRef<THREE.Group>(null);
  const DescriptionENRef = useRef<THREE.Group>(null);
  // One language at rest: a tap on the logo used to swap it and the tagline to Chinese (CON-12). The
  // Chinese SVGs stay mounted at opacity 0 for the /zh locale.

  return (
    <group>
      <Center scale={0.7} position={[0, 0, -5]}>
        <Svg ref={LogoENRef} scale={0.06} src="/svgs/logo-en.svg" fillMaterial={{ opacity: 1 }} />
        <Svg ref={LogoCNRef} scale={0.025} src="/svgs/logo-cn.svg" fillMaterial={{ opacity: 0 }} />
      </Center>
      <Center position={[0, -2.6, 0]}>
        <Svg ref={DescriptionENRef} scale={0.01} src="/svgs/main-description.svg" fillMaterial={{ opacity: 1 }} />
      </Center>
      <Center position={[0, -2.6, 0]}>
        <Svg ref={DescriptionCNRef} scale={0.01} src="/svgs/main-description-cn.svg" fillMaterial={{ opacity: 0 }} />
      </Center>
    </group>
  );
}
