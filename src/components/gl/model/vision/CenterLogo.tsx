'use client';

import { useCnLogoTextures, useLogoTextures } from '@/hooks/useLogoTextures';
import { useThrottle } from '@/hooks/useThrottle';
import { globalLoadedAtom } from '@/atoms/geo';
import { Center } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useAtom } from 'jotai';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { INTRO, shouldSkipIntro } from './intro';
import { DURATION, EASE } from '@/motion/tokens';
import { isReducedMotion } from '@/motion/preference';
import MergedSvg from './MergedSvg';

const POINTER_DAMPING = 2.5;
/** A click within this many ms of the last swap is ignored (the original's throttle). */
const SWAP_THROTTLE_MS = 800;

type Lang = 'en' | 'cn';
/** Where the group sits at the top of the page (its z at scroll 0, as mounted). */
const REST_Z = -5;

function DesktopCenterLogo() {
  const { pointer, size } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const smootherRef = useRef(ScrollSmoother.get());
  const logoMeshRef = useRef<THREE.Mesh>(null);
  const descMeshRef = useRef<THREE.Mesh>(null);
  const [globalLoaded] = useAtom(globalLoadedAtom);
  const hasAnimatedRef = useRef(false);

  // Use custom hook for texture management
  const { logoEnTexture, descEnTexture, logoEnAspectRatio, descEnAspectRatio } = useLogoTextures();
  // A click on the wordmark swaps it and the tagline to Chinese and back (owner's answer 1A: as on his site). The
  // Chinese pair loads once the hero is on screen, never with the loader.
  const cn = useCnLogoTextures(globalLoaded);
  const [lang, setLang] = useState<Lang>('en');
  const showCn = lang === 'cn' && cn !== null;

  // Calculate optimal plane sizes based on current language aspect ratios
  const logoScale = 3.1; // Base scaling size
  const descScale = 0.25; // Description much smaller

  const logoWidth = logoScale * (showCn ? cn.logoCnAspectRatio : logoEnAspectRatio);
  const logoHeight = logoScale;
  const descWidth = descScale * (showCn ? cn.descCnAspectRatio : descEnAspectRatio);
  const descHeight = descScale;

  // The swap, as the original's: both planes fade out (DURATION.base), take the other language's texture and width,
  // and fade back in. Under reduced motion the tokens read 0, so the click still swaps, at once.
  const fadeTo = useCallback((next: Lang) => {
    const materials = [logoMeshRef.current, descMeshRef.current]
      .map((mesh) => mesh?.material as THREE.MeshBasicMaterial | undefined)
      .filter((material): material is THREE.MeshBasicMaterial => !!material);
    gsap.to(materials, {
      opacity: 0,
      duration: DURATION.base,
      onComplete: () => {
        setLang(next);
        gsap.fromTo(materials, { opacity: 0 }, { opacity: 1, duration: DURATION.base });
      },
    });
  }, []);
  // A click before the Chinese files have arrived swaps as soon as they do.
  const pendingRef = useRef<Lang | null>(null);
  const langRef = useRef<Lang>('en');
  const handleClick = useThrottle(() => {
    const next: Lang = langRef.current === 'en' ? 'cn' : 'en';
    langRef.current = next;
    if (cn) fadeTo(next);
    else pendingRef.current = next;
  }, SWAP_THROTTLE_MS);
  useEffect(() => {
    if (!cn || !pendingRef.current) return;
    const next = pendingRef.current;
    pendingRef.current = null;
    fadeTo(next);
  }, [cn, fadeTo]);

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

    // Reduced motion (MOT-02): the wordmark does not follow the pointer. The canvas holds a still frame once a change
    // has settled, so the parallax was held wherever the frames of a section change had damped it to (the wordmark
    // stood off its place on the first screen after a visit to Connect).
    const still = isReducedMotion();
    const positionX = still ? 0 : THREE.MathUtils.mapLinear(pointer.x, -1, 1, -0.15, 0.15);
    const positionY = still ? 0 : THREE.MathUtils.mapLinear(pointer.y, -1, 1, -0.15, 0.15);
    const rotationX = still ? 0 : THREE.MathUtils.mapLinear(pointer.y, -1, 1, Math.PI / 32, -Math.PI / 32);
    const rotationY = still ? 0 : THREE.MathUtils.mapLinear(pointer.x, -1, 1, Math.PI / 32, -Math.PI / 32);

    // Pointer parallax with frame-rate independent damping. This used to start two new GSAP tweens
    // on every frame (about 96 live tweens at 60 Hz); lambda 2.5 reproduces the same easing.
    const group = groupRef.current;
    const dt = Math.min(delta, 0.1);
    if (still) {
      group.position.x = positionX;
      group.rotation.x = rotationX;
      group.rotation.y = rotationY;
    } else {
      group.position.x = THREE.MathUtils.damp(group.position.x, positionX, POINTER_DAMPING, dt);
      group.rotation.x = THREE.MathUtils.damp(group.rotation.x, rotationX, POINTER_DAMPING, dt);
      group.rotation.y = THREE.MathUtils.damp(group.rotation.y, rotationY, POINTER_DAMPING, dt);
    }

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
      group.position.y = still ? positionY : THREE.MathUtils.damp(group.position.y, positionY, POINTER_DAMPING, dt);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, REST_Z]}>
      {/* Logo Plane - Use correct aspect ratio; a click on it swaps the language (the tagline is not a target) */}
      <Center onClick={handleClick}>
        <mesh ref={logoMeshRef}>
          <planeGeometry args={[logoWidth, logoHeight]} />
          <meshBasicMaterial map={showCn ? cn.logoCnTexture : logoEnTexture} transparent opacity={0} side={THREE.FrontSide} />
        </mesh>
      </Center>
      {/* Description Plane - Use correct aspect ratio */}
      <Center position={[0, -3.5, 0]}>
        <mesh ref={descMeshRef}>
          <planeGeometry args={[descWidth, descHeight]} />
          <meshBasicMaterial map={showCn ? cn.descCnTexture : descEnTexture} transparent opacity={0} side={THREE.FrontSide} />
        </mesh>
      </Center>
    </group>
  );
}

/** Fades every material under `root` to `share` of its own fill opacity. */
function fadeLockup(root: THREE.Object3D | null, share: number, delay: number) {
  root?.traverse((object) => {
    const material = (object as THREE.Mesh).material as THREE.MeshBasicMaterial | undefined;
    if (!material || !('opacity' in material)) return;
    const full = Number(material.userData?.fillOpacity ?? 1);
    gsap.to(material, { opacity: full * share, duration: DURATION.base + DURATION.fast, delay });
  });
}

/** The Chinese lockups, mounted (invisible) once the hero is on screen; `onReady` once their files have arrived. */
function PhoneCnLockups({
  logoRef,
  descRef,
  onReady,
  onClick,
}: {
  logoRef: React.RefObject<THREE.Object3D | null>;
  descRef: React.RefObject<THREE.Object3D | null>;
  onReady: () => void;
  onClick: () => void;
}) {
  useEffect(onReady, [onReady]);
  return (
    <>
      <group onClick={onClick}>
        <Center scale={0.7} position={[0, 0, -5]}>
          <MergedSvg ref={logoRef} scale={0.025} src="/svgs/logo-cn.svg" opacity={0} />
        </Center>
      </group>
      <Center position={[0, -2.6, 0]}>
        <MergedSvg ref={descRef} scale={0.01} src="/svgs/main-description-cn.svg" opacity={0} />
      </Center>
    </>
  );
}

/**
 * The phone wordmark and tagline, one mesh per fill colour each (MergedSvg). A tap on the wordmark's ink swaps both to
 * Chinese and back (owner's answer 1A, as on his site: the old lockup fades out over 0.5 s while the other fades in
 * after 0.3 s; the Chinese ones sit in the scene invisible and catch taps too, as on his site). The Chinese pair loads
 * once the hero is on screen, never with the loader; under reduced motion the tokens read 0 and a tap swaps at once.
 */
function PhoneCenterLogo() {
  const [globalLoaded] = useAtom(globalLoadedAtom);
  const enLogoRef = useRef<THREE.Object3D>(null);
  const enDescRef = useRef<THREE.Object3D>(null);
  const cnLogoRef = useRef<THREE.Object3D>(null);
  const cnDescRef = useRef<THREE.Object3D>(null);
  const langRef = useRef<Lang>('en');
  const readyRef = useRef(false);
  const pendingRef = useRef(false);

  const swap = useCallback((next: Lang) => {
    const [from, to] =
      next === 'cn'
        ? [
            [enLogoRef, enDescRef],
            [cnLogoRef, cnDescRef],
          ]
        : [
            [cnLogoRef, cnDescRef],
            [enLogoRef, enDescRef],
          ];
    from.forEach((ref) => fadeLockup(ref.current, 0, 0));
    to.forEach((ref) => fadeLockup(ref.current, 1, DURATION.base));
  }, []);
  const onCnReady = useCallback(() => {
    readyRef.current = true;
    if (pendingRef.current) {
      pendingRef.current = false;
      swap(langRef.current);
    }
  }, [swap]);
  const handleClick = useThrottle(() => {
    langRef.current = langRef.current === 'en' ? 'cn' : 'en';
    if (readyRef.current) swap(langRef.current);
    else pendingRef.current = !pendingRef.current;
  }, SWAP_THROTTLE_MS);

  return (
    <group>
      <group onClick={handleClick}>
        <Center scale={0.7} position={[0, 0, -5]}>
          <MergedSvg ref={enLogoRef} scale={0.06} src="/svgs/logo-en.svg" />
        </Center>
      </group>
      <Center position={[0, -2.6, 0]}>
        <MergedSvg ref={enDescRef} scale={0.01} src="/svgs/main-description.svg" />
      </Center>
      {globalLoaded && (
        <Suspense fallback={null}>
          <PhoneCnLockups logoRef={cnLogoRef} descRef={cnDescRef} onReady={onCnReady} onClick={handleClick} />
        </Suspense>
      )}
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
