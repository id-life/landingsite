import { globalLoadedAtom } from '@/atoms/geo';
import { RANDOM_CONFIG } from '@/components/gl/config/visionGLConfig';
import { useGSAP } from '@gsap/react';
import { MeshTransmissionMaterial, useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useGesture } from '@use-gesture/react';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

// Constants
const INIT_ROTATION = Math.PI / 2;
const DESKTOP_SCALE = 0.13;
const DRAG_SENSITIVITY = 150;
const RECOVERY_DURATION = 1.5;
const ANIMATION_DURATION = 3.0;
const ANIMATION_DELAY = 0.3;
const AUTO_SWING_AMPLITUDE = 0.1;

export function useOptimizedGLTF() {
  const { nodes } = useGLTF('/models/logo_v1.glb');

  const logoGeometry = useMemo(() => {
    const logoNode = nodes.logo as THREE.Mesh;
    return logoNode?.geometry;
  }, [nodes]);

  return { geometry: logoGeometry };
}

export default function DragonModel() {
  const { events, size, clock } = useThree();
  const { geometry } = useOptimizedGLTF();
  const modelRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const autoSwingRef = useRef(false);
  const isRecoveringRef = useRef(false);
  const rotationRef = useRef({ y: INIT_ROTATION, x: 0 });
  const smootherRef = useRef(ScrollSmoother.get());
  const backgroundRef = useRef(new THREE.Color(0xffffff));
  const globalLoaded = useAtomValue(globalLoadedAtom);
  const fixedUIHasTriggered = useRef(false);
  const materialConfig = useMemo(() => ({ resolution: 128, background: backgroundRef.current, ...RANDOM_CONFIG }), []);
  // 使用 useGSAP 来处理 GSAP 动画，确保在客户端正确执行
  const { contextSafe } = useGSAP();

  // 使用 contextSafe 包装动画函数，确保在正确的 GSAP 上下文中执行
  const triggerFadeInAnimation = contextSafe(() => {
    const element = document.querySelector('#pc-fixed-ui');
    const nav = document.querySelector('#nav');
    if (nav) gsap.fromTo(nav, { opacity: 0 }, { opacity: 1, duration: 0.3 });
    if (element) gsap.fromTo(element, { opacity: 0 }, { opacity: 1, duration: 0.3 });
  });

  // Frame update loop
  useFrame(({ clock }) => {
    if (!modelRef.current || !smootherRef.current) return;

    const time = clock.elapsedTime;

    // Auto swing animation
    if (autoSwingRef.current) {
      modelRef.current.rotation.y = rotationRef.current.y + Math.sin(clock.elapsedTime) * AUTO_SWING_AMPLITUDE;
    }

    // Background color based on scroll
    // Improve performance by updating every 0.2 seconds
    if (Math.floor(time * 10) % 2 === 0) {
      const scrollTop = smootherRef.current.scrollTop();
      const r = THREE.MathUtils.mapLinear(scrollTop, 0, size.height * 1.5, 1, 193 / 255);
      const g = THREE.MathUtils.mapLinear(scrollTop, 0, size.height * 1.5, 1, 17 / 255);
      const b = THREE.MathUtils.mapLinear(scrollTop, 0, size.height * 1.5, 1, 17 / 255);
      backgroundRef.current.setRGB(r, g, b);
    }
  });

  // Gesture handling
  const bind = useGesture(
    {
      onHover: ({ last }) => {
        events.connected.style.cursor = last ? 'auto' : 'grab';
      },
      onDrag: ({ active, movement: [x, y] }) => {
        if (!modelRef.current || isRecoveringRef.current || !smootherRef.current) return;

        smootherRef.current.paused(active);

        if (active) {
          // Start dragging
          autoSwingRef.current = false;
          events.connected.style.cursor = 'grabbing';
          modelRef.current.rotation.y = rotationRef.current.y + x / DRAG_SENSITIVITY;
          modelRef.current.rotation.x = rotationRef.current.x + y / DRAG_SENSITIVITY;
          clock.stop();
        } else {
          // End dragging - recover to normal position
          autoSwingRef.current = false;
          isRecoveringRef.current = true;
          events.connected.style.cursor = 'grab';

          const rY = modelRef.current.rotation.y + INIT_ROTATION - (modelRef.current.rotation.y % (Math.PI * 2));
          const rX = modelRef.current.rotation.x - (modelRef.current.rotation.x % (Math.PI * 2));

          rotationRef.current.y = rY;
          rotationRef.current.x = rX;

          gsap.to(modelRef.current.rotation, {
            y: rY,
            x: rX,
            duration: RECOVERY_DURATION,
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

  // Initial model animation
  useGSAP(
    () => {
      if (!modelRef.current) return;
      if (!globalLoaded) return;

      gsap.from(modelRef.current.position, {
        x: 0,
        y: 0,
        z: 10,
        ease: 'power3.out',
        duration: ANIMATION_DURATION,
        delay: ANIMATION_DELAY,
        onUpdate: function () {
          const progress = this.progress();
          if (progress >= 0.5 && !fixedUIHasTriggered.current) {
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
    <group {...(bind() as any)} ref={modelRef} scale={DESKTOP_SCALE} position={[0, 0, 0]} rotation={[0, INIT_ROTATION, 0]}>
      <mesh ref={meshRef} geometry={geometry}>
        <MeshTransmissionMaterial {...materialConfig} />
      </mesh>
    </group>
  );
}
