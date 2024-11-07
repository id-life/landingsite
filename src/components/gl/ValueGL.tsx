import AnimalModel from '@/components/gl/model/value/AnimalModel';
import { NAV_LIST } from '@/components/nav/nav';
import { getExtendedPointWithOffset } from '@/utils/calculates';
import { useGSAP } from '@gsap/react';
import { Center, Svg } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { useControls } from 'leva';
import { useRef } from 'react';
import * as THREE from 'three';

const radius = 10;

export default function ValueGL() {
  const { camera } = useThree();
  const modelRef = useRef<THREE.Group>(null);
  const svgRef = useRef<THREE.Group>(null);

  const title1Controls = useControls(
    'Title 1',
    {
      forwardDistance: { value: 6, min: 0, max: 100, step: 0.1 },
      sideDistance: { value: -2.1, min: -10, max: 10, step: 0.1 },
      upDistance: { value: 0.7, min: -10, max: 10, step: 0.1 },
      scale: {
        value: 0.0107,
        min: 0.001,
        max: 0.1,
        step: 0.0001,
      },
    },
    { collapsed: true },
  );

  const title2Controls = useControls(
    'Title 2',
    {
      forwardDistance: { value: 10, min: 0, max: 100, step: 0.1 },
      sideDistance: { value: 2.8, min: -10, max: 10, step: 0.1 },
      upDistance: { value: 0.5, min: -10, max: 10, step: 0.1 },
      scale: {
        value: 0.0117,
        min: 0.001,
        max: 0.1,
        step: 0.0001,
      },
      rotation: [0, -Math.PI, 0],
    },
    { collapsed: true },
  );

  const title3Controls = useControls(
    'Title 3',
    {
      forwardDistance: { value: 10, min: 0, max: 100, step: 0.1 },
      sideDistance: { value: -2, min: -10, max: 10, step: 0.1 },
      upDistance: { value: -0.1, min: -10, max: 10, step: 0.1 },
      scale: {
        value: 0.0121,
        min: 0.001,
        max: 0.1,
        step: 0.0001,
      },
      rotation: [0, 0.6283, 0],
    },
    { collapsed: true },
  );

  const title4Controls = useControls(
    'Title 4',
    {
      forwardDistance: { value: 10, min: 0, max: 100, step: 0.1 },
      sideDistance: { value: -0.19999999999999973, min: -10, max: 10, step: 0.1 },
      upDistance: { value: 0.7, min: -10, max: 10, step: 0.1 },
      scale: {
        value: 0.0143,
        min: 0.001,
        max: 0.1,
        step: 0.0001,
      },
      rotation: [-1.107, -0.262, -0.478],
    },
    { collapsed: true },
  );

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
        // console.log('camera', camera.position);
        // console.log('model', modelRef.current?.position);
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
        // console.log('camera', camera.position);
        // console.log('model', modelRef.current?.position);
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
        // console.log('camera', camera.position);
        // console.log('model', modelRef.current?.position);
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
    tl.set('.page-value-card', { x: '-30%' });
    tl.fromTo('.page-value-card-item', { left: '-=100%' }, { left: `+=220%`, duration: 5 });
    tl.set('.page-value-card', { x: '100%' });
    tl.to('#value-end-1', { autoAlpha: 1 });
    tl.to('#value-end-2', { autoAlpha: 1 });
    tl.to('#value-end-1', { autoAlpha: 0 });
    tl.to('#value-end-2', { autoAlpha: 0 }, '<');
  });

  // a=camera b=model c=titleSvg
  // 已知 Vector3A, Vector3B,求 Vector3C,沿 AB 方向,距离 B x 个单位距离
  const title1Position = getExtendedPointWithOffset(
    new THREE.Vector3(0, -10, 10), // camera
    new THREE.Vector3(0, -10, 0), // model
    title1Controls?.forwardDistance,
    title1Controls?.sideDistance,
    title1Controls?.upDistance,
  );

  const title2Position = getExtendedPointWithOffset(
    new THREE.Vector3(-1.2246467991473533e-15, -20, -10), // camera
    new THREE.Vector3(0, -20, 0), // model
    title2Controls?.forwardDistance,
    title2Controls?.sideDistance,
    title2Controls?.upDistance,
  );

  const title3Position = getExtendedPointWithOffset(
    new THREE.Vector3(5.877852522924734, -28, 8.090169943749473), // camera
    new THREE.Vector3(0, -28, 0), // model
    title3Controls?.forwardDistance,
    title3Controls?.sideDistance,
    title3Controls?.upDistance,
  );

  const title4Position = getExtendedPointWithOffset(
    new THREE.Vector3(-3, -30, 5), // camera
    new THREE.Vector3(0, -40, 0), // model
    title4Controls?.forwardDistance,
    title4Controls?.sideDistance,
    title4Controls?.upDistance,
  );

  return (
    <group>
      <Center position={title1Position}>
        <Svg scale={title1Controls.scale} src="/svgs/value/title1.svg" fillMaterial={{ transparent: false }} />
      </Center>
      <Center position={title2Position} rotation={title2Controls.rotation}>
        <Svg scale={title2Controls.scale} src="/svgs/value/title2.svg" fillMaterial={{ transparent: false }} />
      </Center>
      <Center position={title3Position} rotation={title3Controls.rotation}>
        <Svg scale={title3Controls.scale} src="/svgs/value/title3.svg" fillMaterial={{ transparent: false }} />
      </Center>
      <Center ref={svgRef} position={title4Position} rotation={title4Controls.rotation}>
        <Svg scale={title4Controls.scale} src="/svgs/value/title4.svg" fillMaterial={{ transparent: false }} />
      </Center>
      <AnimalModel ref={modelRef} />
    </group>
  );
}
