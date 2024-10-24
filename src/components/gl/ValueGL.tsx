import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useThree } from '@react-three/fiber';
import { NAV_LIST } from '@/components/nav/nav';
import DragonModelTemp from '@/components/gl/model/value/DragonModelTemp';
import { Center, Svg } from '@react-three/drei';

export default function ValueGL() {
  const { camera } = useThree();

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
  });

  return (
    <group>
      <Center position={[-2, -9.2, -5]}>
        <Svg scale={0.01} src="/svgs/value/title1.svg" fillMaterial={{ transparent: false }} />
      </Center>
      <DragonModelTemp />
    </group>
  );
}
