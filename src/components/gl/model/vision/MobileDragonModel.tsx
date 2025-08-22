import { fadeInAnimCompletedAtom, globalLoadedAtom } from '@/atoms/geo';
import { RANDOM_CONFIG } from '@/components/gl/config/visionGLConfig';
import { useGSAP } from '@gsap/react';
import { MeshTransmissionMaterial } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useGesture } from '@use-gesture/react';
import gsap from 'gsap';
import { useAtomValue, useSetAtom } from 'jotai';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useOptimizedGLTF } from './DragonModel';

const InitRotation = Math.PI / 2;
const ANIMATION_DURATION = 3.0;
const ANIMATION_DELAY = 0.3;

export default function MobileDragonModel(props: {}) {
  const { events, clock } = useThree();
  const { geometry } = useOptimizedGLTF();
  const modelRef = useRef<THREE.Group>(null);
  const autoSwingRef = useRef(false);
  const isRecoveringRef = useRef(false);
  const rotationRef = useRef({ y: InitRotation, x: 0 });
  const backgroundRef = useRef(new THREE.Color(0xffffff));
  const meshRef = useRef<THREE.Mesh>(null);
  const fixedUIHasTriggered = useRef(false);
  const { contextSafe } = useGSAP();
  const setFadeInAnimCompleted = useSetAtom(fadeInAnimCompletedAtom);
  const globalLoaded = useAtomValue(globalLoadedAtom);
  const pathname = usePathname();
  const hasFadeInAhead = useMemo(() => pathname !== '/', [pathname]);

  // 使用 contextSafe 包装动画函数，确保在正确的 GSAP 上下文中执行
  const triggerFadeInAnimation = contextSafe(() => {
    const element = document.querySelector('#mobile-fixed-ui');
    const nav = document.querySelector('#mobile-nav');
    if (nav) gsap.fromTo(nav, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    if (element)
      gsap.fromTo(element, { opacity: 0 }, { opacity: 1, duration: 0.3, onComplete: () => setFadeInAnimCompleted(true) });
  });

  useFrame(({ clock }) => {
    if (!modelRef.current) return;
    if (autoSwingRef.current) {
      modelRef.current.rotation.y = rotationRef.current.y + Math.sin(clock.elapsedTime) * 0.1;
    }
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
    { drag: { filterTaps: true, preventScroll: true } },
  );

  useGSAP(
    () => {
      if (!modelRef.current) return;
      if (!globalLoaded) return;
      if (hasFadeInAhead) fixedUIHasTriggered.current = true;

      gsap.from(modelRef.current.position, {
        x: 0,
        y: 0,
        z: 10,
        ease: 'power3.out',
        duration: ANIMATION_DURATION,
        delay: ANIMATION_DELAY,
        onUpdate: function () {
          const progress = this.progress();
          if (progress >= 0.85 && !fixedUIHasTriggered.current) {
            fixedUIHasTriggered.current = true;
            // Trigger FixedUI fade-in
            triggerFadeInAnimation();
          }
        },
      });

      gsap.from(modelRef.current.rotation, {
        x: Math.PI,
        y: (Math.PI * 3) / 2,
        z: Math.PI,
        ease: 'power3.out',
        duration: ANIMATION_DURATION,
        delay: ANIMATION_DELAY,
        onComplete: () => {
          autoSwingRef.current = true;
        },
      });
    },
    { scope: modelRef, dependencies: [globalLoaded] },
  );

  // Clean up geometry and material
  useEffect(() => {
    return () => {
      if (geometry) {
        geometry.dispose();
      }
      const material = meshRef.current?.material as any;
      if (material && material.dispose) {
        material.dispose();
      }
    };
  }, [geometry]);

  return (
    <group {...(bind() as any)} ref={modelRef} {...props} scale={0.14} position={[0, 0, 0]} rotation={[0, InitRotation, 0]}>
      <mesh ref={meshRef} geometry={geometry}>
        <MeshTransmissionMaterial resolution={256} background={backgroundRef.current} {...RANDOM_CONFIG} />
      </mesh>
    </group>
  );
}
