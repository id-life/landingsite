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

const centerPoint = new THREE.Vector3(0, -10, 0);

export default function ValueGL() {
  const { camera } = useThree();
  const modelRef = useRef<THREE.Group>(null);
  const title1Ref = useRef<THREE.Group>(null);
  const title2Ref = useRef<THREE.Group>(null);
  const title3Ref = useRef<THREE.Group>(null);
  const title4Ref = useRef<THREE.Group>(null);

  const title1Controls = useControls(
    'Title 1',
    {
      forwardDistance: { value: 4.4, min: 0, max: 100, step: 0.1 },
      sideDistance: { value: 0.5, min: -10, max: 10, step: 0.1 },
      upDistance: { value: 0.8, min: -10, max: 10, step: 0.1 },
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
      rotation: [0, -2.4, 0],
    },
    { collapsed: true },
  );

  const title3Controls = useControls(
    'Title 3',
    {
      forwardDistance: { value: 10, min: 0, max: 100, step: 0.1 },
      sideDistance: { value: 10, min: -20, max: 20, step: 0.1 },
      upDistance: { value: 10, min: -10, max: 10, step: 0.1 },
      scale: {
        value: 0.0121,
        min: 0.001,
        max: 0.1,
        step: 0.0001,
      },
      rotation: [2.608, -0.075, 3.098],
    },
    { collapsed: true },
  );

  const title4Controls = useControls(
    'Title 4',
    {
      forwardDistance: { value: 30, min: 0, max: 100, step: 0.1 },
      sideDistance: { value: 8, min: -10, max: 10, step: 0.1 },
      upDistance: { value: 0.7, min: -10, max: 10, step: 0.1 },
      scale: {
        value: 0.0143,
        min: 0.001,
        max: 0.1,
        step: 0.0001,
      },
      rotation: [-3.084, 0.404, 3.119],
    },
    { collapsed: true },
  );

  useGSAP(() => {
    gsap.set(camera.position, {
      y: -10,
      z: 11,
      immediateRender: false,
      scrollTrigger: {
        trigger: `#${NAV_LIST[2].id}`,
        start: 'top bottom+=400',
        toggleActions: 'play none none reverse',
      },
    });
    gsap.to('#vision-canvas', {
      zIndex: 1,
      opacity: 1,
      immediateRender: false,
      scrollTrigger: {
        trigger: `#${NAV_LIST[2].id}`,
        start: 'top center',
        toggleActions: 'play none none reverse',
        onEnter: () => {
          if (!modelRef.current) return;
          if (!title1Ref.current) return;
          gsap.from(title1Ref.current.position, {
            x: 5,
            y: -15,
            z: -10,
            duration: 1.2,
            ease: 'power3.out',
          });
          gsap.from(title1Ref.current.rotation, {
            x: -Math.PI / 4,
            y: -Math.PI / 4,
            z: Math.PI / 4,
            duration: 1.2,
            ease: 'power3.out',
          });
          gsap.from(modelRef.current.position, {
            x: 5,
            y: -15,
            z: -10,
            duration: 0.8,
            ease: 'power3.out',
          });
          gsap.from(modelRef.current.rotation, {
            x: Math.PI / 4,
            y: Math.PI / 4,
            z: Math.PI / 4,
            duration: 0.8,
            ease: 'power3.out',
          });
        },
      },
    });
  });

  useGSAP(() => {
    if (!modelRef.current || !title1Ref.current || !title2Ref.current || !title3Ref.current || !title4Ref.current) return;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: `#${NAV_LIST[2].id}`,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    });
    tl.to(title1Ref.current.position, { z: -20, ease: 'power3.inOut', duration: 8 });
    tl.to(modelRef.current.position, { x: 2, y: -10, z: -2, ease: 'power3.inOut', duration: 8 }, '<');
    tl.to(
      camera.position,
      {
        x: -7.6,
        y: -10.12,
        z: -7.52,
        duration: 8,
        ease: 'power3.inOut',
        onUpdate: () => {
          if (!modelRef.current) return;
          camera.lookAt(centerPoint);
        },
      },
      '<',
    );
    tl.to(title2Ref.current.position, {
      x: 21.249,
      y: -19.776,
      z: 6.958,
      ease: 'power3.inOut',
      duration: 8,
    });
    tl.to(
      title3Ref.current.position,
      {
        x: 3.896,
        y: -5.184,
        z: 7.881,
        ease: 'power3.inOut',
        duration: 8,
      },
      '<',
    );
    tl.to(modelRef.current.position, { x: -2, y: -10, z: 0, ease: 'power3.inOut', duration: 8 }, '<');
    tl.to(
      camera.position,
      {
        x: -0.783,
        y: -15.326,
        z: -9.022,
        duration: 8,
        ease: 'power3.inOut',
        onUpdate: () => {
          if (!modelRef.current) return;
          camera.lookAt(centerPoint);
        },
      },
      '<',
    );
    tl.to(title3Ref.current.position, {
      x: 11.08,
      y: 12.395,
      z: 12.016,
      duration: 8,
      ease: 'power3.inOut',
    });
    tl.to(
      title4Ref.current.position,
      {
        x: -11.288,
        y: -9.833,
        z: 6.025,
        duration: 8,
        ease: 'power3.inOut',
      },
      '<',
    );
    tl.to(modelRef.current.position, { x: -2, y: -10, z: -2, duration: 8, ease: 'power3.inOut' }, '<');
    tl.to(
      camera.position,
      {
        x: 4.505,
        y: -9.39,
        z: -10.506,
        duration: 8,
        ease: 'power3.inOut',
        onUpdate: () => {
          if (!modelRef.current) return;
          camera.lookAt(centerPoint);
        },
      },
      '<',
    );
    // tl.to('#page-value-4', { opacity: 0 }, '<+=1');
    // tl.set('.page-value-card', { x: '-30%' });
    // tl.fromTo('.page-value-card-item', { left: '-=100%' }, { left: `+=220%`, duration: 5 });
    // tl.set('.page-value-card', { x: '100%' });
    // tl.to('#value-end-1', { autoAlpha: 1 });
    // tl.to('#value-end-2', { autoAlpha: 1 });
    // tl.to('#value-end-1', { autoAlpha: 0 });
    // tl.to('#value-end-2', { autoAlpha: 0 }, '<');
  });

  // a=camera b=model c=titleSvg
  // 已知 Vector3A, Vector3B,求 Vector3C,沿 AB 方向,距离 B x 个单位距离
  const title1Position = getExtendedPointWithOffset(
    new THREE.Vector3(0, -10, 11), // camera
    new THREE.Vector3(0, -10, 0), // model
    title1Controls?.forwardDistance,
    title1Controls?.sideDistance,
    title1Controls?.upDistance,
  );

  const title2Position = getExtendedPointWithOffset(
    new THREE.Vector3(-7.6, -10.12, -7.52), // camera
    new THREE.Vector3(0, -10, 0), // model
    title2Controls?.forwardDistance,
    title2Controls?.sideDistance,
    title2Controls?.upDistance,
  );

  const title3Position = getExtendedPointWithOffset(
    new THREE.Vector3(-0.783, -15.326, -9.022), // camera
    new THREE.Vector3(0, -10, 0), // model
    title3Controls?.forwardDistance,
    title3Controls?.sideDistance,
    title3Controls?.upDistance,
  );

  console.log('title3Position: ', title3Position);

  const title4Position = getExtendedPointWithOffset(
    new THREE.Vector3(4.505, -9.39, -10.506), // camera
    new THREE.Vector3(0, -10, 0), // model
    title4Controls?.forwardDistance,
    title4Controls?.sideDistance,
    title4Controls?.upDistance,
  );

  return (
    <group>
      <Center ref={title1Ref} position={title1Position}>
        <Svg scale={title1Controls.scale} src="/svgs/value/title1.svg" fillMaterial={{ transparent: false }} />
      </Center>
      <Center ref={title2Ref} position={title2Position} rotation={title2Controls.rotation}>
        <Svg scale={title2Controls.scale} src="/svgs/value/title2.svg" fillMaterial={{ transparent: false }} />
      </Center>
      <Center ref={title3Ref} position={title3Position} rotation={title3Controls.rotation}>
        <Svg scale={title3Controls.scale} src="/svgs/value/title3.svg" fillMaterial={{ transparent: false }} />
      </Center>
      <Center ref={title4Ref} position={title4Position} rotation={title4Controls.rotation}>
        <Svg scale={title4Controls.scale} src="/svgs/value/title4.svg" fillMaterial={{ transparent: false }} />
      </Center>
      <AnimalModel ref={modelRef} />
    </group>
  );
}
