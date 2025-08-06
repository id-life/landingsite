import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { Center } from '@react-three/drei';
import { LogoType } from '@/components/nav/Logo';
import { useThrottle } from '@/hooks/useThrottle';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useFrame, useThree } from '@react-three/fiber';
import { useLogoTextures } from '@/hooks/useLogoTextures';
import { useAtomValue } from 'jotai';
import { globalLoadedAtom } from '@/atoms/geo';
import { useGSAP } from '@gsap/react';

const CenterLogo = () => {
  const { pointer, size } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const smootherRef = useRef(ScrollSmoother.get());
  const logoMeshRef = useRef<THREE.Mesh>(null);
  const descMeshRef = useRef<THREE.Mesh>(null);
  const [currentLogo, setCurrentLogo] = useState<LogoType>(LogoType.EN);
  const globalLoaded = useAtomValue(globalLoadedAtom);

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
  const { contextSafe } = useGSAP();

  const triggerFadeIn = contextSafe(() => {
    if (!logoMeshRef.current || !descMeshRef.current) return;

    const logoMaterial = logoMeshRef.current.material as THREE.MeshBasicMaterial;
    const descMaterial = descMeshRef.current.material as THREE.MeshBasicMaterial;

    if (!logoMaterial || !descMaterial) return;

    // Fade in
    gsap.to([logoMaterial, descMaterial], {
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
    });
  });

  // Initialize with opacity 0
  useGSAP(
    () => {
      if (!globalLoaded) return;

      if (!logoMeshRef.current || !descMeshRef.current) return;

      // Get materials
      const logoMaterial = logoMeshRef.current.material as THREE.MeshBasicMaterial;
      const descMaterial = descMeshRef.current.material as THREE.MeshBasicMaterial;

      if (!logoMaterial || !descMaterial) {
        console.log('🎭 CenterLogo: Materials not ready, skipping initial setup');
        return;
      }

      // Start with opacity 0
      gsap.set(logoMaterial, { opacity: 0 });
      gsap.set(descMaterial, { opacity: 0 });

      console.log('🎭 CenterLogo: Set initial opacity to 0');
    },
    { scope: groupRef, dependencies: [globalLoaded] },
  );

  useEffect(() => {
    if (!globalLoaded) return;
    triggerFadeIn();
  }, [globalLoaded, triggerFadeIn]);

  useFrame(() => {
    if (!groupRef.current || !smootherRef.current) return;

    const positionX = THREE.MathUtils.mapLinear(pointer.x, -1, 1, -0.15, 0.15);
    const positionY = THREE.MathUtils.mapLinear(pointer.y, -1, 1, -0.15, 0.15);
    const rotationX = THREE.MathUtils.mapLinear(pointer.y, -1, 1, Math.PI / 32, -Math.PI / 32);
    const rotationY = THREE.MathUtils.mapLinear(pointer.x, -1, 1, Math.PI / 32, -Math.PI / 32);

    gsap.to(groupRef.current.position, { x: positionX, y: positionY, duration: 0.8 });
    gsap.to(groupRef.current.rotation, { x: rotationX, y: rotationY, duration: 0.8 });

    const scrollTop = smootherRef.current.scrollTop();
    const scrollY = THREE.MathUtils.mapLinear(scrollTop, 0, size.height, 0, 10);
    if (scrollY) {
      groupRef.current.position.y = scrollY;
      groupRef.current.position.z = -5 - scrollY;
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
            side={THREE.FrontSide}
          />
        </mesh>
      </Center>
    </group>
  );
};

CenterLogo.displayName = 'CenterLogo';

export default CenterLogo;
