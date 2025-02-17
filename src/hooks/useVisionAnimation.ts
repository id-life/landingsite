import { gsap } from 'gsap';
import { RefObject } from 'react';
import * as THREE from 'three';

interface AnimationConfig {
  duration: number;
  enterEase: string;
  exitEase: string;
  enterDelay?: number;
}

const defaultConfig: AnimationConfig = {
  duration: 1,
  enterEase: 'power2.out',
  exitEase: 'power2.in',
};

export const useVisionAnimation = (
  ref: RefObject<THREE.Group>,
  initialScale: number,
  targetScale: number,
  zPosition: number = 0,
  config: AnimationConfig = defaultConfig,
) => {
  const playEnterAnimation = () => {
    if (!ref.current) return;

    gsap.fromTo(
      ref.current.position,
      { x: 0, y: 5, z: zPosition, opacity: 0 },
      { x: 0, y: 0, z: zPosition, opacity: 1, duration: config.duration, ease: config.enterEase },
    );
    gsap.fromTo(
      ref.current.scale,
      { x: initialScale, y: initialScale, z: initialScale },
      {
        x: targetScale,
        y: targetScale,
        z: targetScale,
        duration: config.duration,
        ease: config.enterEase,
        delay: config.enterDelay,
      },
    );
  };

  const playExitAnimation = () => {
    if (!ref.current) return;

    gsap.to(ref.current.position, {
      y: 5,
      opacity: 0,
      duration: 0.4,
      ease: config.exitEase,
    });
    gsap.to(ref.current.scale, {
      x: 0,
      y: 0,
      z: 0,
      duration: 0.4,
      ease: config.exitEase,
    });
  };

  return {
    playEnterAnimation,
    playExitAnimation,
  };
};
