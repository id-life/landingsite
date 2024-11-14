import AnimalModel from '@/components/gl/model/value/AnimalModel';
import { NAV_LIST } from '@/components/nav/nav';
import { getExtendedPointWithOffset } from '@/utils/calculates';
import { useGSAP } from '@gsap/react';
import { Center, Svg } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
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

  useGSAP(() => {
    const tl = gsap.timeline({
      immediateRender: false,
      scrollTrigger: {
        trigger: `#${NAV_LIST[2].id}`,
        start: 'top bottom+=500',
        end: 'top top',
        scrub: true,
      },
    });
    tl.to(camera.position, { y: -10, z: 11 });
    tl.to('#vision-canvas', { zIndex: 1, opacity: 1 });
    if (!title1Ref.current || !modelRef.current) return;
    tl.fromTo(
      title1Ref.current.position,
      { x: 5, y: -20, z: -10 },
      {
        x: 0,
        y: -9.2,
        z: -4.4,
        ease: 'power1.out',
      },
      '<10%',
    );
    tl.fromTo(
      title1Ref.current.rotation,
      { x: -Math.PI / 4, y: -Math.PI / 4, z: Math.PI / 4 },
      { x: 0, y: 0, z: 0, ease: 'power1.out' },
      '<',
    );
    tl.fromTo(modelRef.current.position, { x: 5, y: -15, z: -10 }, { x: 0, y: -10, z: 0, ease: 'power3.out' }, '<');
    tl.fromTo(
      modelRef.current.rotation,
      { x: Math.PI / 4, y: Math.PI / 4, z: Math.PI / 4 },
      { x: 0, y: 0, z: 0, ease: 'power3.out' },
      '<',
    );
    tl.to('#page-value-1', { opacity: 1 }, '<30%');
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
    tl.to(modelRef.current.position, { x: -1, y: -10, z: 0, ease: 'power3.inOut', duration: 8 }, '<');
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
    tl.to('#page-value-1', { opacity: 0, duration: 3.5, ease: 'power3.in' }, '<');
    tl.to('#page-value-2', { opacity: 1, duration: 3.5, ease: 'power3.out' }, '-=3.5');
    tl.to(title2Ref.current.position, {
      x: 39.056,
      y: -19.551,
      z: 21.611,
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
    tl.to(modelRef.current.position, { x: 1, y: -12, z: -2, ease: 'power3.inOut', duration: 8 }, '<');
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
    tl.to('#page-value-2', { opacity: 0, duration: 3.5, ease: 'power3.in' }, '<');
    tl.to('#page-value-3', { opacity: 1, duration: 3.5, ease: 'power3.out' }, '-=3.5');
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
        x: -0.794,
        y: -15.797,
        z: 3.842,
        duration: 8,
        ease: 'power3.inOut',
      },
      '<',
    );
    tl.to(modelRef.current.position, { x: 0, y: -10, z: 0, duration: 8, ease: 'power3.inOut' }, '<');
    tl.to(
      camera.position,
      {
        x: 1.409,
        y: 0.291,
        z: -6.821,
        duration: 8,
        ease: 'power3.inOut',
        onUpdate: () => {
          if (!modelRef.current) return;
          camera.lookAt(centerPoint);
        },
      },
      '<',
    );
    tl.to('#page-value-3', { opacity: 0, duration: 3.5, ease: 'power3.in' }, '<');
    tl.to('#page-value-4', { opacity: 1, duration: 3.5, ease: 'power3.out' }, '-=3.5');
    tl.to(title4Ref.current.position, {
      x: -10.236,
      y: -30.144,
      z: 13.849,
      duration: 8,
      ease: 'power3.inOut',
    });
    tl.to(
      camera.position,
      {
        x: 2.8,
        y: -7.863,
        z: -10.55,
        duration: 8,
        ease: 'power3.inOut',
        onUpdate: () => {
          if (!modelRef.current) return;
          camera.lookAt(centerPoint);
        },
      },
      '<',
    );
    tl.to('#page-value-4', { opacity: 0, duration: 3.5, ease: 'power3.in' }, '<');
    tl.to('#value-end-1', { autoAlpha: 1, duration: 3.5, ease: 'power3.out' }, '-=3.5');
    tl.to(modelRef.current.position, { x: 0, y: -10.5, z: 0, duration: 8, ease: 'none' });
    tl.to(
      camera.position,
      {
        x: 1.84,
        y: -7.943,
        z: -6.87,
        duration: 8,
        ease: 'none',
        onUpdate: () => {
          if (!modelRef.current) return;
          camera.lookAt(centerPoint);
        },
      },
      '<',
    );
    tl.to('#value-end-2', { autoAlpha: 1, duration: 3.5, ease: 'power3.out' }, '-=3.5');
    tl.to('#value-end-1', { autoAlpha: 0, duration: 3.5, ease: 'none' });
    tl.to('#value-end-2', { autoAlpha: 0, duration: 3.5, ease: 'none' }, '<');
  });

  // a=camera b=model c=titleSvg
  // 已知 Vector3A, Vector3B,求 Vector3C,沿 AB 方向,距离 B x 个单位距离
  const title1Position = getExtendedPointWithOffset(
    new THREE.Vector3(0, -10, 11), // camera
    new THREE.Vector3(0, -10, 0), // model
    4.4,
    0,
    0.8,
  );

  const title2Position = getExtendedPointWithOffset(
    new THREE.Vector3(-7.6, -10.12, -7.52), // camera
    new THREE.Vector3(0, -10, 0), // model
    9,
    -1,
    0.8,
  );

  const title3Position = getExtendedPointWithOffset(
    new THREE.Vector3(-0.794, -15.797, 3.842), // camera
    new THREE.Vector3(0, -10, 0), // model
    10,
    10,
    10,
  );

  const title4Position = getExtendedPointWithOffset(
    new THREE.Vector3(1.409, 0.291, -6.821), // camera
    new THREE.Vector3(0, -10, 0), // model
    30,
    8,
    0.7,
  );

  return (
    <group>
      <Center ref={title1Ref} position={title1Position}>
        <Svg scale={0.0107} src="/svgs/value/title1.svg" fillMaterial={{ transparent: false }} />
      </Center>
      <Center ref={title2Ref} position={title2Position} rotation={[0, -2.4, 0]}>
        <Svg scale={0.0136} src="/svgs/value/title2.svg" fillMaterial={{ transparent: false }} />
      </Center>
      <Center ref={title3Ref} position={title3Position} rotation={[2.608, -0.075, 3.098]}>
        <Svg scale={0.0121} src="/svgs/value/title3.svg" fillMaterial={{ transparent: false }} />
      </Center>
      <Center ref={title4Ref} position={title4Position} rotation={[-2.156, 0.114, 2.972]}>
        <Svg scale={0.0143} src="/svgs/value/title4.svg" fillMaterial={{ transparent: false }} />
      </Center>
      <AnimalModel ref={modelRef} />
    </group>
  );
}
