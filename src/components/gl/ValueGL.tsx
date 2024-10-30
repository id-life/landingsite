import { useRef } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import { useGSAP } from '@gsap/react';
import { useThree } from '@react-three/fiber';
import { Center, Svg } from '@react-three/drei';
import { NAV_LIST } from '@/components/nav/nav';
import DragonModelTemp from '@/components/gl/model/value/DragonModelTemp';

const radius = 10;

export default function ValueGL() {
  const { camera } = useThree();
  const modelRef = useRef<THREE.Group>(null);
  const svgRef = useRef<THREE.Group>(null);

  useGSAP(() => {
    if (!modelRef.current) return;
    gsap.set(camera.position, {
      y: -10,
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
        end: 'bottom bottom',
        scrub: true,
      },
    });
    tl.to('#page-value-1', { opacity: 0 });
    // VALUE-2
    tl.to(camera.position, {
      y: -20,
      onUpdate: () => {
        if (!modelRef.current) return;
        const progress = THREE.MathUtils.mapLinear(camera.position.y, -10, -20, 0, 1);
        const angle = progress * Math.PI;
        const x = radius * Math.sin(angle);
        const z = radius * Math.cos(angle);
        camera.position.x = -x;
        camera.position.z = z;
        modelRef.current.position.y = camera.position.y;
        camera.lookAt(0, modelRef.current.position.y, 0);
      },
    });

    tl.to('#page-value-2', { opacity: 1 }).to('#page-value-2', { opacity: 0 });
    // VALUE-3
    tl.to(camera.position, {
      y: -28,
      onUpdate: () => {
        if (!modelRef.current) return;
        const progress = THREE.MathUtils.mapLinear(camera.position.y, -20, -28, 1, 1.8);
        const angle = progress * Math.PI;
        const x = radius * Math.sin(angle);
        const z = radius * Math.cos(angle);
        camera.position.x = -x;
        camera.position.z = z;
        modelRef.current.position.y = camera.position.y;
        camera.lookAt(0, modelRef.current.position.y, 0);
      },
    });
    tl.to('#page-value-3', { opacity: 1 }).to('#page-value-3', { opacity: 0 });
    // VALUE-4
    tl.to(camera.position, {
      y: -30,
      z: 5,
      x: -3,
      onUpdate: () => {
        if (!modelRef.current) return;
        const positionY = THREE.MathUtils.mapLinear(camera.position.y, -28, -30, -28, -40);
        modelRef.current.position.setY(positionY);
        camera.lookAt(0, modelRef.current.position.y, 0);
      },
    });
    tl.to('#page-value-4', { opacity: 1 }).to('#page-value-4', { opacity: 0 });
    // VALUE-END
    tl.to(camera.position, {
      y: -60,
      z: -5,
      x: -3,
      onUpdate: () => {
        if (!modelRef.current) return;
        const positionY = THREE.MathUtils.mapLinear(camera.position.y, -30, -60, -40, -70);
        modelRef.current.position.setY(positionY);
        camera.lookAt(0, modelRef.current.position.y, 0);
      },
    });
    tl.to('#value-end-1', { opacity: 1 }).to('#value-end-1', { opacity: 0 });
    tl.to('#value-end-2', { opacity: 1 });
  });

  return (
    <group>
      <Center position={[-2, -9.2, -5]}>
        <Svg scale={0.01} src="/svgs/value/title1.svg" fillMaterial={{ transparent: false }} />
      </Center>
      <Center position={[2, -19.2, 15]} rotation={[0, -Math.PI, 0]}>
        <Svg scale={0.015} src="/svgs/value/title2.svg" fillMaterial={{ transparent: false }} />
      </Center>
      <Center position={[-8.305, -28, -6.327]} rotation={[0, 0.6283, 0]}>
        <Svg scale={0.013} src="/svgs/value/title3.svg" fillMaterial={{ transparent: false }} />
      </Center>
      <Center ref={svgRef} position={[-1.728, -48.639, -6.911]} rotation={[-1.107, -0.262, -0.478]}>
        <Svg scale={0.013} src="/svgs/value/title4.svg" fillMaterial={{ transparent: false }} />
      </Center>
      <DragonModelTemp ref={modelRef} />
    </group>
  );
}
