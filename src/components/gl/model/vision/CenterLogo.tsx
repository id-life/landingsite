import { LogoType } from '@/components/nav/Logo';
import { useLogoTextures } from '@/hooks/useLogoTextures';
import { useThrottle } from '@/hooks/useThrottle';
import { globalLoadedAtom } from '@/atoms/geo';
import { Center } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { INTRO, shouldSkipIntro } from './intro';

const POINTER_DAMPING = 2.5;

export default function CenterLogo() {
  const { pointer, size } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const smootherRef = useRef(ScrollSmoother.get());
  const logoMeshRef = useRef<THREE.Mesh>(null);
  const descMeshRef = useRef<THREE.Mesh>(null);
  const [currentLogo, setCurrentLogo] = useState<LogoType>(LogoType.EN);
  const [globalLoaded] = useAtom(globalLoadedAtom);
  const hasAnimatedRef = useRef(false);

  // Use custom hook for texture management
  const {
    logoEnTexture,
    logoCnTexture,
    descEnTexture,
    descCnTexture,
    logoEnAspectRatio,
    logoCnAspectRatio,
    descEnAspectRatio,
    descCnAspectRatio,
  } = useLogoTextures();

  // Calculate optimal plane sizes based on current language aspect ratios
  const logoScale = 3.1; // Base scaling size
  const descScale = 0.25; // Description much smaller

  // Use correct aspect ratio based on current language
  const currentLogoAspectRatio = currentLogo === LogoType.EN ? logoEnAspectRatio : logoCnAspectRatio;
  const currentDescAspectRatio = currentLogo === LogoType.EN ? descEnAspectRatio : descCnAspectRatio;

  const logoWidth = logoScale * currentLogoAspectRatio;
  const logoHeight = logoScale;
  const descWidth = descScale * currentDescAspectRatio;
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
          ease: 'power2.out',
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
      group.position.z = -5 - scrollY;
    } else {
      group.position.y = THREE.MathUtils.damp(group.position.y, positionY, POINTER_DAMPING, dt);
    }
  });

  const handleClick = useThrottle(() => {
    const newLogo = currentLogo === LogoType.EN ? LogoType.CN : LogoType.EN;
    setCurrentLogo(newLogo);

    // Calculate new dimensions for the new language
    const newLogoAspectRatio = newLogo === LogoType.EN ? logoEnAspectRatio : logoCnAspectRatio;
    const newDescAspectRatio = newLogo === LogoType.EN ? descEnAspectRatio : descCnAspectRatio;
    const newLogoWidth = logoScale * newLogoAspectRatio;
    const newDescWidth = descScale * newDescAspectRatio;

    // Animate logo transition
    if (logoMeshRef.current) {
      const logoMaterial = logoMeshRef.current.material as THREE.MeshBasicMaterial;
      gsap.to(logoMaterial, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          // Switch texture and update geometry
          if (logoMeshRef.current) {
            const material = logoMeshRef.current.material as THREE.MeshBasicMaterial;
            const newTexture = newLogo === LogoType.EN ? logoEnTexture : logoCnTexture;

            // Ensure texture is properly configured
            newTexture.needsUpdate = true;
            material.map = newTexture;
            material.needsUpdate = true;

            // Update geometry with new aspect ratio
            logoMeshRef.current.geometry.dispose(); // Clean up old geometry
            logoMeshRef.current.geometry = new THREE.PlaneGeometry(newLogoWidth, logoHeight);

            // Ensure opacity is fully restored
            gsap.set(material, { opacity: 1 });
            gsap.fromTo(material, { opacity: 0 }, { opacity: 1, duration: 0.3 });
          }
        },
      });
    }

    // Animate description transition
    if (descMeshRef.current) {
      const descMaterial = descMeshRef.current.material as THREE.MeshBasicMaterial;
      gsap.to(descMaterial, {
        opacity: 0,
        duration: 0.3,
        onComplete: () => {
          // Switch texture and update geometry
          if (descMeshRef.current) {
            const material = descMeshRef.current.material as THREE.MeshBasicMaterial;
            const newTexture = newLogo === LogoType.EN ? descEnTexture : descCnTexture;

            // Ensure texture is properly configured
            newTexture.needsUpdate = true;
            material.map = newTexture;
            material.needsUpdate = true;

            // Update geometry with new aspect ratio
            descMeshRef.current.geometry.dispose(); // Clean up old geometry
            descMeshRef.current.geometry = new THREE.PlaneGeometry(newDescWidth, descHeight);

            // Ensure opacity is fully restored
            gsap.set(material, { opacity: 1 });
            gsap.fromTo(material, { opacity: 0 }, { opacity: 1, duration: 0.3 });
          }
        },
      });
    }
  }, 800);

  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      {/* Logo Plane - Use correct aspect ratio */}
      <Center onClick={handleClick}>
        <mesh ref={logoMeshRef}>
          <planeGeometry args={[logoWidth, logoHeight]} />
          <meshBasicMaterial
            map={currentLogo === LogoType.EN ? logoEnTexture : logoCnTexture}
            transparent
            opacity={0}
            side={THREE.FrontSide}
          />
        </mesh>
      </Center>
      {/* Description Plane - Use correct aspect ratio */}
      <Center position={[0, -3.5, 0]}>
        <mesh ref={descMeshRef}>
          <planeGeometry args={[descWidth, descHeight]} />
          <meshBasicMaterial
            map={currentLogo === LogoType.EN ? descEnTexture : descCnTexture}
            transparent
            opacity={0}
            side={THREE.FrontSide}
          />
        </mesh>
      </Center>
    </group>
  );
}
