import { useRef } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import { useGSAP } from '@gsap/react';
import { useGesture } from '@use-gesture/react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial, useGLTF } from '@react-three/drei';

const InitRotation = Math.PI / 2;
export default function DragonModel(props: {}) {
  const { events, size, clock } = useThree();
  const { nodes } = useGLTF('/models/logo.glb');
  const modelRef = useRef<THREE.Group>(null);
  const autoSwingRef = useRef(false);
  const isRecoveringRef = useRef(false);
  const rotationRef = useRef({ y: InitRotation, x: 0 });
  const smootherRef = useRef(ScrollSmoother.get());
  const backgroundRef = useRef(new THREE.Color(0xffffff));
  const isMobile = useIsMobile();
  const meshRef = useRef<THREE.Mesh>(null);
  const transmissionConfigRef = useRef({
    transmission: 1,
    roughness: 0,
    thickness: 10,
    ior: 1.5,
    chromaticAberration: 0.5,
    anisotropy: 0.1,
    distortion: 0,
    distortionScale: 0.5,
    temporalDistortion: 0.1,
    clearcoat: 0,
    metalness: 0.1,
  });

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
        if (!smootherRef.current) return;
        smootherRef.current.paused(active);
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

  useGSAP(() => {
    if (!meshRef.current) return;
    const mesh = meshRef.current.material as any;
    const timeline = gsap.timeline({ repeat: -1, delay: 1, repeatDelay: 2, defaults: { ease: 'none', duration: 8 } });
    timeline
      .to(transmissionConfigRef.current, {
        transmission: 1,
        roughness: 0.1,
        thickness: 10,
        ior: 1.5,
        chromaticAberration: 1,
        anisotropy: 0,
        distortion: 1,
        distortionScale: 0.15,
        temporalDistortion: 0.1,
        clearcoat: 1,
        metalness: 0.1,
        onUpdate: () => {
          Object.entries(transmissionConfigRef.current).map(([key, value]) => (mesh[key] = value));
        },
      })
      .to(transmissionConfigRef.current, {
        transmission: 1,
        roughness: 0.0,
        thickness: 10,
        ior: 1,
        chromaticAberration: 1,
        anisotropy: 1,
        distortion: 1,
        distortionScale: 1,
        temporalDistortion: 0.1,
        clearcoat: 1,
        metalness: 0,
        onUpdate: () => {
          Object.entries(transmissionConfigRef.current).map(([key, value]) => (mesh[key] = value));
        },
      })
      .to(transmissionConfigRef.current, {
        transmission: 1,
        roughness: 0.0,
        thickness: 10,
        ior: 3.16,
        chromaticAberration: 1,
        anisotropy: 1,
        distortion: 1,
        distortionScale: 0.1,
        temporalDistortion: 0.1,
        clearcoat: 1,
        metalness: 0,
        onUpdate: () => {
          Object.entries(transmissionConfigRef.current).map(([key, value]) => (mesh[key] = value));
        },
      })
      .to(transmissionConfigRef.current, {
        transmission: 1,
        roughness: 0.0,
        thickness: 10,
        ior: 2.28,
        chromaticAberration: 1,
        anisotropy: 0,
        distortion: 1,
        distortionScale: 0.3,
        temporalDistortion: 0.1,
        clearcoat: 1,
        metalness: 0,
        onUpdate: () => {
          Object.entries(transmissionConfigRef.current).map(([key, value]) => (mesh[key] = value));
        },
      })
      .to(transmissionConfigRef.current, {
        transmission: 1,
        roughness: 0.0,
        thickness: 10,
        ior: 1,
        chromaticAberration: 1,
        anisotropy: 1,
        distortion: 1,
        distortionScale: 1,
        temporalDistortion: 0.1,
        clearcoat: 1,
        metalness: 0,
        onUpdate: () => {
          Object.entries(transmissionConfigRef.current).map(([key, value]) => (mesh[key] = value));
        },
      })
      .to(transmissionConfigRef.current, {
        transmission: 1,
        roughness: 0,
        thickness: 10,
        ior: 1.5,
        chromaticAberration: 0.5,
        anisotropy: 0.1,
        distortion: 0,
        distortionScale: 0.5,
        temporalDistortion: 0.1,
        clearcoat: 0,
        metalness: 0.1,
        onUpdate: () => {
          Object.entries(transmissionConfigRef.current).map(([key, value]) => (mesh[key] = value));
        },
      });
    window.addEventListener('scroll', () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 50) {
        timeline.pause();
      } else {
        timeline.play();
      }
    });
  });

  return (
    <group
      {...(bind() as any)}
      ref={modelRef}
      {...props}
      scale={isMobile ? 0.14 : 0.13}
      position={[0, 0, 0]}
      rotation={[0, InitRotation, 0]}
    >
      <mesh ref={meshRef} geometry={(nodes.logo as any).geometry}>
        <MeshTransmissionMaterial resolution={512} background={backgroundRef.current} {...transmissionConfigRef.current} />
      </mesh>
    </group>
  );
}
