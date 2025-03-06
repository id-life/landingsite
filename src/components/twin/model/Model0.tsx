'use client';

import React, { forwardRef, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Center } from '@react-three/drei';
import AnimationGroup, { AnimationGroupHandle } from './AnimationGroupM0';

const Model0 = forwardRef<{}>(function ({}, ref) {
  const modelInRef = useRef<THREE.Group>(null);
  const modelOutRef = useRef<THREE.Group>(null);
  const animationGroupRef = useRef<AnimationGroupHandle>(null);

  useEffect(() => {
    const animationGroup = animationGroupRef.current;
    if (animationGroup) {
      animationGroup.startAnimationLoop();
    }

    return () => {
      if (animationGroup) {
        animationGroup.stopAnimationLoop();
      }
    };
  }, []);

  return (
    <Center>
      <group ref={modelOutRef} position={[0, 0.2, -0.15]}>
        <AnimationGroup ref={animationGroupRef} modelRef={modelInRef} />
      </group>
    </Center>
  );
});

Model0.displayName = 'Model0';

export default Model0;
