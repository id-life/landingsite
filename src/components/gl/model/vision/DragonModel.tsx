'use client';

import { fadeInAnimCompletedAtom, globalLoadedAtom } from '@/atoms/geo';
import { heroGlass } from '@/components/gl/config/visionGLConfig';
import { TRANSMISSION_RESOLUTION, useGpuTier } from '@/motion/gpuTier';
import { useHeroGLTF } from '@/components/gl/heroAssets';
import { NAV_LIST } from '@/components/nav/nav';
import { getElementOffsetTop } from '@/utils';
import { INTRO, markIntroSeen, shouldSkipIntro, whenElementMounted } from './intro';
import { useGSAP } from '@gsap/react';
import { MeshTransmissionMaterial } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useGesture } from '@use-gesture/react';
import gsap from 'gsap';
import { DURATION } from '@/motion/tokens';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useAtomValue, useSetAtom } from 'jotai';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

// Constants
const INIT_ROTATION = Math.PI / 2;
const DESKTOP_SCALE = 0.13;
const DRAG_SENSITIVITY = 150;
const RECOVERY_DURATION = 1.5;
const AUTO_SWING_AMPLITUDE = 0.1;

export function useOptimizedGLTF() {
  const { nodes } = useHeroGLTF();

  const logoGeometry = useMemo(() => {
    const logoNode = nodes.logo as THREE.Mesh;
    return logoNode?.geometry;
  }, [nodes]);

  return { geometry: logoGeometry };
}

function DesktopDragonModel() {
  const { events, size } = useThree();
  const { budget } = useGpuTier();
  // Phase of the idle swing: it advances only while the dragon swings, so a drag pauses it (clock.stop() used to).
  const swingPhaseRef = useRef(0);
  const { geometry } = useOptimizedGLTF();
  const modelRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const autoSwingRef = useRef(false);
  const isRecoveringRef = useRef(false);
  const rotationRef = useRef({ y: INIT_ROTATION, x: 0 });
  const smootherRef = useRef(ScrollSmoother.get());
  const backgroundRef = useRef(new THREE.Color(0xffffff));
  const globalLoaded = useAtomValue(globalLoadedAtom);
  const setFadeInAnimCompleted = useSetAtom(fadeInAnimCompletedAtom);
  // The fixed UI is revealed from fadeInAnimCompletedAtom; the tween below only runs on a first visit.
  const uiAlreadyShown = useAtomValue(fadeInAnimCompletedAtom);
  const uiAlreadyShownRef = useRef(uiAlreadyShown);
  uiAlreadyShownRef.current = uiAlreadyShown;
  const fixedUIHasTriggered = useRef(false);
  const offsetYRef = useRef<number>(0);
  // One of the six glass looks per page load (heroGlass); samples from the tier (MOT-06).
  const materialConfig = useMemo(
    () => ({
      resolution: TRANSMISSION_RESOLUTION.desktop,
      samples: budget.transmissionSamples,
      background: backgroundRef.current,
      ...heroGlass(),
    }),
    [budget.transmissionSamples],
  );
  // 使用 useGSAP 来处理 GSAP 动画，确保在客户端正确执行
  const { contextSafe } = useGSAP();
  const pathname = usePathname();
  const hasFadeInAhead = useMemo(() => pathname !== '/', [pathname]);

  // 使用 contextSafe 包装动画函数，确保在正确的 GSAP 上下文中执行
  const triggerFadeInAnimation = contextSafe(() => {
    // The nav and the fixed UI fade in together in DURATION.fast. (A duration among the timeline's own vars is
    // ignored by GSAP: the two default 0.5 s fades ran one after the other, 1.21 s instead of 0.21 s; MOT-08.)
    const tl = gsap.timeline({
      defaults: { duration: DURATION.fast },
      onComplete: () => {
        setFadeInAnimCompleted(true);
      },
    });
    const element = document.querySelector('#pc-fixed-ui');
    const nav = document.querySelector('#nav');
    if (nav) tl.fromTo(nav, { opacity: 0 }, { opacity: 1 }, 0);
    if (element) tl.fromTo(element, { opacity: 0 }, { opacity: 1 }, 0);
    tl.play();
  });

  // Frame update loop
  useFrame(({ clock }, delta) => {
    if (!modelRef.current || !smootherRef.current) return;
    const time = clock.elapsedTime;

    // Auto swing animation
    if (autoSwingRef.current) {
      swingPhaseRef.current += delta;
      modelRef.current.rotation.y = rotationRef.current.y + Math.sin(swingPhaseRef.current) * AUTO_SWING_AMPLITUDE;
    }

    // Background color based on scroll
    // Improve performance by updating every 0.2 seconds
    if (Math.floor(time * 10) % 2 === 0) {
      const scrollTop = smootherRef.current.scrollTop();
      if (scrollTop >= offsetYRef.current * 2) {
        backgroundRef.current.setRGB(1, 1, 1);
        return;
      }
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
      if (hasFadeInAhead || uiAlreadyShownRef.current) fixedUIHasTriggered.current = true;
      if (!smootherRef.current) return;

      offsetYRef.current = getElementOffsetTop(document.querySelector(`#${NAV_LIST[1].id}`));

      // Repeat visit or reduced motion: the dragon is already at its resting pose; show the UI now.
      if (shouldSkipIntro()) {
        autoSwingRef.current = true;
        if (!fixedUIHasTriggered.current) {
          fixedUIHasTriggered.current = true;
          triggerFadeInAnimation();
        }
        return;
      }

      gsap.from(modelRef.current.position, {
        x: 0,
        y: 0,
        z: 10,
        ease: INTRO.flyInEase,
        duration: INTRO.flyInSeconds,
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
        ease: INTRO.flyInEase,
        duration: INTRO.flyInSeconds,
        onComplete: () => {
          autoSwingRef.current = true;
          markIntroSeen();
        },
      });
    },
    { scope: modelRef, dependencies: [globalLoaded] },
  );

  // Clean up geometry and material
  useEffect(() => {
    const mesh = meshRef.current;
    return () => {
      if (geometry) {
        geometry.dispose();
      }
      const material = (mesh?.material as any) ?? null;
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

const InitRotation = Math.PI / 2;

function PhoneDragonModel(props: {}) {
  const { events } = useThree();
  const { budget } = useGpuTier();
  // Phase of the idle swing: it advances only while the dragon swings, so a drag pauses it (clock.stop() used to).
  const swingPhaseRef = useRef(0);
  const { geometry } = useOptimizedGLTF();
  const modelRef = useRef<THREE.Group>(null);
  const autoSwingRef = useRef(false);
  const isRecoveringRef = useRef(false);
  const rotationRef = useRef({ y: InitRotation, x: 0 });
  const backgroundRef = useRef(new THREE.Color(0xffffff));
  const meshRef = useRef<THREE.Mesh>(null);
  // The same look as the desktop dragon for this page load (heroGlass draws once per page load).
  const glass = useMemo(() => heroGlass(), []);
  const fixedUIHasTriggered = useRef(false);
  const { contextSafe } = useGSAP();
  const setFadeInAnimCompleted = useSetAtom(fadeInAnimCompletedAtom);
  // The fixed UI is revealed from fadeInAnimCompletedAtom; the tween below only runs on a first visit.
  const uiAlreadyShown = useAtomValue(fadeInAnimCompletedAtom);
  const uiAlreadyShownRef = useRef(uiAlreadyShown);
  uiAlreadyShownRef.current = uiAlreadyShown;
  const globalLoaded = useAtomValue(globalLoadedAtom);
  const pathname = usePathname();
  const hasFadeInAhead = useMemo(() => pathname !== '/', [pathname]);

  // 使用 contextSafe 包装动画函数，确保在正确的 GSAP 上下文中执行
  const triggerFadeInAnimation = contextSafe(() => {
    const element = document.querySelector('#mobile-fixed-ui');
    const nav = document.querySelector('#mobile-nav');
    if (nav) gsap.fromTo(nav, { opacity: 0 }, { opacity: 1, duration: DURATION.fast });
    if (element)
      gsap.fromTo(
        element,
        { opacity: 0 },
        {
          opacity: 1,
          duration: DURATION.fast,
          onComplete: () => {
            setFadeInAnimCompleted(true);
          },
        },
      );
  });

  useFrame((_, delta) => {
    if (!modelRef.current) return;
    if (autoSwingRef.current) {
      swingPhaseRef.current += delta;
      modelRef.current.rotation.y = rotationRef.current.y + Math.sin(swingPhaseRef.current) * 0.1;
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
            duration: DURATION.camera,
            onComplete: () => {
              autoSwingRef.current = true;
              isRecoveringRef.current = false;
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
      if (hasFadeInAhead || uiAlreadyShownRef.current) fixedUIHasTriggered.current = true;

      // Repeat visit or reduced motion: the dragon is already at its resting pose; show the UI now.
      if (shouldSkipIntro()) {
        autoSwingRef.current = true;
        if (!fixedUIHasTriggered.current) {
          fixedUIHasTriggered.current = true;
          // #mobile-nav renders only once globalLoaded is set; wait for it before revealing.
          whenElementMounted('#mobile-nav', () => triggerFadeInAnimation());
        }
        return;
      }

      gsap.from(modelRef.current.position, {
        x: 0,
        y: 0,
        z: 10,
        ease: INTRO.flyInEase,
        duration: INTRO.flyInSeconds,
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
        ease: INTRO.flyInEase,
        duration: INTRO.flyInSeconds,
        onComplete: () => {
          autoSwingRef.current = true;
          markIntroSeen();
        },
      });
    },
    { scope: modelRef, dependencies: [globalLoaded] },
  );

  // Clean up geometry and material
  useEffect(() => {
    const mesh = meshRef.current;
    return () => {
      if (geometry) {
        geometry.dispose();
      }
      const material = mesh?.material as any;
      if (material && material.dispose) {
        material.dispose();
      }
    };
  }, [geometry]);

  return (
    <group {...(bind() as any)} ref={modelRef} {...props} scale={0.14} position={[0, 0, 0]} rotation={[0, InitRotation, 0]}>
      <mesh ref={meshRef} geometry={geometry}>
        <MeshTransmissionMaterial
          resolution={TRANSMISSION_RESOLUTION.phone}
          samples={budget.transmissionSamples}
          background={backgroundRef.current}
          {...glass}
        />
      </mesh>
    </group>
  );
}

/**
 * The glass dragon, one component for both decks (RWD-02; it was DragonModel and MobileDragonModel). By deck: the
 * desktop deck drives the background colour from the smoother, pauses the smoother while dragging and reveals the UI
 * at 50 % of the fly-in (scale 0.13); the phone deck reveals at 85 %, waits for the phone header, and uses scale 0.14.
 */
export default function DragonModel({ deck }: { deck: 'desktop' | 'phone' }) {
  return deck === 'phone' ? <PhoneDragonModel /> : <DesktopDragonModel />;
}
