import { currentPageAtom } from '@/atoms';
import { VISION_GL_CONFIG } from '@/components/gl/config/visionGLConfig';
import { NAV_LIST } from '@/components/nav/nav';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useGSAP } from '@gsap/react';
import { MeshTransmissionMaterial, useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useGesture } from '@use-gesture/react';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const InitRotation = Math.PI / 2;
const mobileLoopAnim = VISION_GL_CONFIG.mobileLoopAnim;
export default function DragonModel(props: {}) {
  const { camera, events, size, clock } = useThree();
  const { nodes } = useGLTF('/models/logo.glb');
  const modelRef = useRef<THREE.Group>(null);
  const tlRef = useRef<gsap.core.Timeline>();
  const autoSwingRef = useRef(false);
  const isRecoveringRef = useRef(false);
  const rotationRef = useRef({ y: InitRotation, x: 0 });
  const smootherRef = useRef(ScrollSmoother.get());
  const backgroundRef = useRef(new THREE.Color(0xffffff));
  const isMobile = useIsMobile();
  const currentPage = useAtomValue(currentPageAtom);

  useFrame(({ clock }) => {
    if (!modelRef.current || !smootherRef.current) return;
    if (autoSwingRef.current) {
      modelRef.current.rotation.y = rotationRef.current.y + Math.sin(clock.elapsedTime) * 0.1;
    }
    const scrollTop = smootherRef.current.scrollTop();
    const r = THREE.MathUtils.mapLinear(scrollTop, 0, size.height * 1.5, 1, 193 / 255);
    const g = THREE.MathUtils.mapLinear(scrollTop, 0, size.height * 1.5, 1, 17 / 255);
    const b = THREE.MathUtils.mapLinear(scrollTop, 0, size.height * 1.5, 1, 17 / 255);
    backgroundRef.current.setRGB(r, g, b);
  });

  const bind = useGesture(
    {
      onHover: ({ last }) => {
        events.connected.style.cursor = last ? 'auto' : 'grab';
      },
      onDrag: ({ active, movement: [x, y] }) => {
        if (!modelRef.current || isRecoveringRef.current) return;
        if (active) {
          autoSwingRef.current = false;
          events.connected.style.cursor = 'grabbing';
          modelRef.current.rotation.y = rotationRef.current.y + x / 150;
          modelRef.current.rotation.x = rotationRef.current.x + y / 150;
          clock.stop();
        } else {
          autoSwingRef.current = false;
          isRecoveringRef.current = true;
          events.connected.style.cursor = 'grab';
          const rY = modelRef.current.rotation.y + InitRotation - (modelRef.current.rotation.y % (Math.PI * 2));
          const rX = modelRef.current.rotation.x - (modelRef.current.rotation.x % (Math.PI * 2));
          rotationRef.current.y = rY;
          rotationRef.current.x = rX;
          gsap.to(modelRef.current.rotation, {
            y: rY,
            x: rX,
            duration: 1.5,
            onComplete: () => {
              autoSwingRef.current = true;
              isRecoveringRef.current = false;
              clock.start();
            },
          });
        }
      },
    },
    { drag: { filterTaps: true } },
  );

  useGSAP(
    () => {
      if (!modelRef.current) return;
      gsap.from(modelRef.current.position, {
        x: 0,
        y: 0,
        z: 10,
        ease: 'power3.out',
        duration: 1.5,
      });
      gsap.from(modelRef.current.rotation, {
        x: Math.PI,
        y: (Math.PI * 3) / 2,
        z: Math.PI,
        ease: 'power3.out',
        duration: 1.5,
        onComplete: () => {
          clock.start();
          autoSwingRef.current = true;
        },
      });
    },
    { scope: modelRef },
  );
  // useGSAP(() => {
  //   if (!isMobile) return;
  //   const tl = gsap.timeline({
  //     repeat: -1,
  //     smoothChildTiming: true, // 添加平滑过渡
  //     defaults: { duration: 4, ease: 'linear' },
  //     onUpdate: () => {
  //       if (!camera) return;
  //       camera.lookAt(0, 0, 0);
  //     },
  //   });
  //   // tl.to(camera.position, mobileLoopAnim.camera.position[0])
  //   //   .to(camera.position, mobileLoopAnim.camera.position[1])
  //   //   .to(camera.position, mobileLoopAnim.camera.position[2])
  //   //   .to(camera.position, mobileLoopAnim.camera.position[3])
  //   //   .to(camera.position, { x: 0, y: 0, z: 10 });
  //   // tlRef.current = tl;
  //   return () => {
  //     tl.kill();
  //   };
  // }, [camera, isMobile]);

  // useEffect(() => {
  //   if (!isMobile) return;
  //   if (currentPage.id === NAV_LIST[0].id) {
  //     tlRef.current?.play();
  //     camera.lookAt(0, 0, 0);
  //   } else {
  //     tlRef.current?.pause();
  //     camera.quaternion.identity(); // 重置相机方向为默认值
  //     camera.position.set(0, 0, 10);
  //   }
  // }, [isMobile, currentPage, camera]);

  return (
    <group
      {...(bind() as any)}
      ref={modelRef}
      {...props}
      scale={isMobile ? 0.14 : 0.13}
      position={[0, 0, 0]}
      rotation={[0, InitRotation, 0]}
    >
      <mesh geometry={(nodes.logo as any).geometry}>
        <MeshTransmissionMaterial
          resolution={512}
          background={backgroundRef.current}
          roughness={0}
          metalness={0.1}
          chromaticAberration={0.5}
          transmission={1}
          thickness={10}
        />
      </mesh>
    </group>
  );
}
