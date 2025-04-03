import { useGSAP } from '@gsap/react';
import { MeshTransmissionMaterial, useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useGesture } from '@use-gesture/react';
import gsap from 'gsap';
import { useRef } from 'react';
import * as THREE from 'three';

const InitRotation = Math.PI / 2;
export default function MobileDragonModel(props: {}) {
  const { events, clock } = useThree();
  const { nodes } = useGLTF('/models/logo.glb');
  const modelRef = useRef<THREE.Group>(null);
  const autoSwingRef = useRef(false);
  const isRecoveringRef = useRef(false);
  const rotationRef = useRef({ y: InitRotation, x: 0 });
  const backgroundRef = useRef(new THREE.Color(0xffffff));
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
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

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
    timelineRef.current = timeline;
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
  });

  return (
    <group {...(bind() as any)} ref={modelRef} {...props} scale={0.14} position={[0, 0, 0]} rotation={[0, InitRotation, 0]}>
      <mesh ref={meshRef} geometry={(nodes.logo as any).geometry}>
        <MeshTransmissionMaterial resolution={256} background={backgroundRef.current} {...transmissionConfigRef.current} />
      </mesh>
    </group>
  );
}
