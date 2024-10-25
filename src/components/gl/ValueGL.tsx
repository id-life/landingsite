import gsap from 'gsap';
import * as THREE from 'three';
import { useGSAP } from '@gsap/react';
import { useThree } from '@react-three/fiber';
import { NAV_LIST } from '@/components/nav/nav';
import DragonModelTemp from '@/components/gl/model/value/DragonModelTemp';
import { Center, Svg } from '@react-three/drei';
import { useRef } from 'react';

const radius = 10;

export default function ValueGL() {
  const { camera } = useThree();
  const modelRef = useRef<THREE.Group>(null);

  useGSAP(() => {
    gsap.to(camera.position, {
      y: -10,
      duration: 0,
      immediateRender: false,
      scrollTrigger: {
        trigger: `#${NAV_LIST[2].id}`,
        start: 'top bottom+=400',
        toggleActions: 'play none none reverse',
      },
    });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: `#${NAV_LIST[2].id}`,
        start: 'top top',
        scrub: true,
        markers: true,
      },
    });

    tl.to(camera.position, {
      y: -20,
      onUpdate: () => {
        if (!modelRef.current) return;
        const progress = (camera.position.y + 10) / -10;
        const angle = progress * Math.PI;
        const x = radius * Math.sin(angle);
        const z = radius * Math.cos(angle);
        camera.position.x = -x;
        camera.position.z = z;
        modelRef.current.position.y = camera.position.y;
        camera.lookAt(0, camera.position.y, 0);
      },
    });
    tl.to(camera.position, {
      y: -28,
      onUpdate: () => {
        if (!modelRef.current) return;
        const progress = (camera.position.y + 10) / -10;
        const angle = progress * Math.PI;
        const x = radius * Math.sin(angle);
        const z = radius * Math.cos(angle);
        camera.position.x = -x;
        camera.position.z = z;
        modelRef.current.position.y = camera.position.y;
        camera.lookAt(0, camera.position.y, 0);
      },
    });
  });

  return (
    <group>
      <Center position={[-2, -9.2, -5]}>
        <Svg scale={0.01} src="/svgs/value/title1.svg" fillMaterial={{ transparent: false }} />
      </Center>
      <Center position={[2, -19.2, 15]} rotation={[0, -Math.PI, 0]}>
        <Svg scale={0.015} src="/svgs/value/title2.svg" fillMaterial={{ transparent: false }} />
      </Center>
      <Center position={[-18, -27, -5]} rotation={[0, Math.PI / 3, 0]}>
        <Svg scale={0.018} src="/svgs/value/title3.svg" fillMaterial={{ transparent: false }} />
      </Center>
      <DragonModelTemp ref={modelRef} />
    </group>
  );
}
