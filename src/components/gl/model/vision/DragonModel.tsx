import { useRef, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import { useGSAP } from '@gsap/react';
import { useGesture } from '@use-gesture/react';
import { useIsMobile } from '@/hooks/useIsMobile';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial, useGLTF } from '@react-three/drei';

// Constants
const INIT_ROTATION = Math.PI / 2;
const MOBILE_SCALE = 0.14;
const DESKTOP_SCALE = 0.13;
const DRAG_SENSITIVITY = 150;
const RECOVERY_DURATION = 1.5;
const ANIMATION_DURATION = 1.5;
const ANIMATION_DELAY = 0.3;
const AUTO_SWING_AMPLITUDE = 0.1;
const SCROLL_PAUSE_THRESHOLD = 50;

// Material configuration presets
const DEFAULT_TRANSMISSION_CONFIG = {
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
} as const;

const TRANSMISSION_KEYFRAMES = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  DEFAULT_TRANSMISSION_CONFIG,
] as const;

interface DragonModelProps {}

export default function DragonModel(props: DragonModelProps) {
  const { events, size, clock } = useThree();
  const { nodes } = useGLTF('/models/logo_v1.glb');
  const modelRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const autoSwingRef = useRef(false);
  const isRecoveringRef = useRef(false);
  const rotationRef = useRef({ y: INIT_ROTATION, x: 0 });
  const smootherRef = useRef(ScrollSmoother.get());
  const backgroundRef = useRef(new THREE.Color(0xffffff));
  const transmissionConfigRef = useRef({ ...DEFAULT_TRANSMISSION_CONFIG });
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isMobile = useIsMobile();

  // Update material properties helper
  const updateMaterialProperties = useCallback((config: typeof DEFAULT_TRANSMISSION_CONFIG) => {
    if (!meshRef.current) return;
    const mesh = meshRef.current.material as any;
    Object.entries(config).forEach(([key, value]) => {
      mesh[key] = value;
    });
  }, []);

  // Create material animation timeline
  const createMaterialTimeline = useCallback(() => {
    if (!meshRef.current) return null;

    const timeline = gsap.timeline({
      repeat: -1,
      delay: 1,
      repeatDelay: 2,
      defaults: { ease: 'none', duration: 8 },
    });

    TRANSMISSION_KEYFRAMES.forEach((keyframe) => {
      timeline.to(transmissionConfigRef.current, {
        ...keyframe,
        onUpdate: () => updateMaterialProperties(transmissionConfigRef.current),
      });
    });

    return timeline;
  }, [updateMaterialProperties]);

  // Handle scroll events for material animation
  const handleScroll = useCallback(() => {
    if (!timelineRef.current) return;
    const scrollPosition = window.scrollY;
    if (scrollPosition > SCROLL_PAUSE_THRESHOLD) {
      timelineRef.current.pause();
    } else {
      timelineRef.current.play();
    }
  }, []);

  // Frame update loop
  useFrame(({ clock }) => {
    if (!modelRef.current || !smootherRef.current) return;

    // Auto swing animation
    if (autoSwingRef.current) {
      modelRef.current.rotation.y = rotationRef.current.y + Math.sin(clock.elapsedTime) * AUTO_SWING_AMPLITUDE;
    }

    // Background color based on scroll
    const scrollTop = smootherRef.current.scrollTop();
    const r = THREE.MathUtils.mapLinear(scrollTop, 0, size.height * 1.5, 1, 193 / 255);
    const g = THREE.MathUtils.mapLinear(scrollTop, 0, size.height * 1.5, 1, 17 / 255);
    const b = THREE.MathUtils.mapLinear(scrollTop, 0, size.height * 1.5, 1, 17 / 255);
    backgroundRef.current.setRGB(r, g, b);
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

      gsap.from(modelRef.current.position, {
        x: 0,
        y: 0,
        z: 10,
        ease: 'power3.out',
        duration: ANIMATION_DURATION,
        delay: ANIMATION_DELAY,
      });

      gsap.from(modelRef.current.rotation, {
        x: Math.PI,
        y: (Math.PI * 3) / 2,
        z: Math.PI,
        ease: 'power3.out',
        duration: ANIMATION_DURATION,
        delay: ANIMATION_DELAY,
        onComplete: () => {
          clock.start();
          autoSwingRef.current = true;
        },
      });
    },
    { scope: modelRef },
  );

  // Material animation setup
  useGSAP(() => {
    if (!meshRef.current) return;

    const timeline = createMaterialTimeline();
    if (timeline) {
      timelineRef.current = timeline;
    }
  });

  // Scroll event listener setup and cleanup
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <group
      {...(bind() as any)}
      ref={modelRef}
      {...props}
      scale={isMobile ? MOBILE_SCALE : DESKTOP_SCALE}
      position={[0, 0, 0]}
      rotation={[0, INIT_ROTATION, 0]}
    >
      <mesh ref={meshRef} geometry={(nodes.logo as any).geometry}>
        <MeshTransmissionMaterial resolution={256} background={backgroundRef.current} {...transmissionConfigRef.current} />
      </mesh>
    </group>
  );
}
