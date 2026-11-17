'use client';

import { useLogoTextures } from '@/hooks/useLogoTextures';
import { globalLoadedAtom } from '@/atoms/geo';
import { Center } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { INTRO, shouldSkipIntro } from './intro';
import { EASE } from '@/motion/tokens';
import MergedSvg from './MergedSvg';

const POINTER_DAMPING = 2.5;
/** Where the group sits at the top of the page (its z at scroll 0, as mounted). */
const REST_Z = -5;

function DesktopCenterLogo() {
  const { pointer, size } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const smootherRef = useRef(ScrollSmoother.get());
  const logoMeshRef = useRef<THREE.Mesh>(null);
  const descMeshRef = useRef<THREE.Mesh>(null);
  // English only: a click used to swap the logo and tagline to Chinese (CON-12); the Chinese files are no longer loaded.
  const [globalLoaded] = useAtom(globalLoadedAtom);
  const hasAnimatedRef = useRef(false);

  // Use custom hook for texture management
  const { logoEnTexture, descEnTexture, logoEnAspectRatio, descEnAspectRatio } = useLogoTextures();

  // Calculate optimal plane sizes based on current language aspect ratios
  const logoScale = 3.1; // Base scaling size
  const descScale = 0.25; // Description much smaller

  const logoWidth = logoScale * logoEnAspectRatio;
  const logoHeight = logoScale;
  const descWidth = descScale * descEnAspectRatio;
  const descHeight = descScale;

  // Fade in animation when globalLoaded becomes true
  useEffect(() => {
    if (globalLoaded && !hasAnimatedRef.current) {
      hasAnimatedRef.current = true;

      if (logoMeshRef.current && descMeshRef.current) {
        const logoMaterial = logoMeshRef.current.material as THREE.MeshBasicMaterial;
        const descMaterial = descMeshRef.current.material as THREE.MeshBasicMaterial;

        // Set initial opacity to 0
        logoMaterial.opacity = 0;
        descMaterial.opacity = 0;

        // Animate fade in
        gsap.to([logoMaterial, descMaterial], {
          opacity: 1,
          duration: shouldSkipIntro() ? INTRO.skippedFadeSeconds : INTRO.wordmarkFadeSeconds,
          ease: EASE.out,
        });
      }
    }
  }, [globalLoaded]);

  useFrame((_, delta) => {
    if (!groupRef.current || !smootherRef.current) return;

    const positionX = THREE.MathUtils.mapLinear(pointer.x, -1, 1, -0.15, 0.15);
    const positionY = THREE.MathUtils.mapLinear(pointer.y, -1, 1, -0.15, 0.15);
    const rotationX = THREE.MathUtils.mapLinear(pointer.y, -1, 1, Math.PI / 32, -Math.PI / 32);
    const rotationY = THREE.MathUtils.mapLinear(pointer.x, -1, 1, Math.PI / 32, -Math.PI / 32);

    // Pointer parallax with frame-rate independent damping. This used to start two new GSAP tweens
    // on every frame (about 96 live tweens at 60 Hz); lambda 2.5 reproduces the same easing.
    const group = groupRef.current;
    const dt = Math.min(delta, 0.1);
    group.position.x = THREE.MathUtils.damp(group.position.x, positionX, POINTER_DAMPING, dt);
    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, rotationX, POINTER_DAMPING, dt);
    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, rotationY, POINTER_DAMPING, dt);

    const scrollTop = smootherRef.current.scrollTop();
    const scrollY = THREE.MathUtils.mapLinear(scrollTop, 0, size.height, 0, 10);
    if (scrollY) {
      group.position.y = scrollY;
      group.position.z = REST_Z - scrollY;
    } else if (group.position.z < REST_Z - 1) {
      // At the top, but the group is still where a frame far down left it. A scroll reaches the top through frames
      // a few pixels apart (z within a few hundredths of REST_Z), but the canvas draws nothing while it is hidden
      // (FrameDriver), so after a far jump from Connect its last frame was Connect's: the wordmark and the tagline
      // stayed 200 units back, out of sight. Put the group where a fresh load has it.
      group.position.y = positionY;
      group.position.z = REST_Z;
    } else {
      group.position.y = THREE.MathUtils.damp(group.position.y, positionY, POINTER_DAMPING, dt);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, REST_Z]}>
      {/* Logo Plane - Use correct aspect ratio */}
      <Center>
        <mesh ref={logoMeshRef}>
          <planeGeometry args={[logoWidth, logoHeight]} />
          <meshBasicMaterial map={logoEnTexture} transparent opacity={0} side={THREE.FrontSide} />
        </mesh>
      </Center>
      {/* Description Plane - Use correct aspect ratio */}
      <Center position={[0, -3.5, 0]}>
        <mesh ref={descMeshRef}>
          <planeGeometry args={[descWidth, descHeight]} />
          <meshBasicMaterial map={descEnTexture} transparent opacity={0} side={THREE.FrontSide} />
        </mesh>
      </Center>
    </group>
  );
}

/**
 * The phone wordmark and tagline, one mesh per fill colour each (MergedSvg). English only: the Chinese lockups were
 * drawn at opacity 0 (CON-12 retired the tap-to-switch) and still cost their draw calls; a /zh locale would swap the
 * src here instead.
 */
function PhoneCenterLogo() {
  return (
    <group>
      <Center scale={0.7} position={[0, 0, -5]}>
        <MergedSvg scale={0.06} src="/svgs/logo-en.svg" />
      </Center>
      <Center position={[0, -2.6, 0]}>
        <MergedSvg scale={0.01} src="/svgs/main-description.svg" />
      </Center>
    </group>
  );
}

/**
 * The hero wordmark, one component for both decks (RWD-02; it was CenterLogo and MobileCenterLogo). By deck:
 * desktop draws rasterised textures (drawn from the SVGs at screen resolution) with pointer parallax and a scroll
 * offset; phone draws merged vector meshes (one mesh per colour) with no parallax (touch has no pointer to follow).
 */
export default function CenterLogo({ deck }: { deck: 'desktop' | 'phone' }) {
  return deck === 'phone' ? <PhoneCenterLogo /> : <DesktopCenterLogo />;
}
