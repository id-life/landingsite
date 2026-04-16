import Animal2Model from '@/components/gl/model/connect/Animal2Model';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import * as THREE from 'three';

export default function AnimalModel() {
  const modelRef = useRef<THREE.Group>(null);
  useGSAP(
    () => {
      if (!modelRef.current) return;
      gsap.to(modelRef.current.position, {
        motionPath: {
          path: [
            {
              x: -1,
              y: -1,
              z: 3,
            },
            {
              x: 0,
              y: 0.5,
              z: 0,
            },
          ],
        },
        ease: 'power3.out',
        duration: 3,
      });
      gsap.from(modelRef.current.rotation, {
        x: Math.PI / 2,
        y: 0,
        z: Math.PI / 2,
        ease: 'power3.out',
        duration: 3,
      });
    },
    { scope: modelRef },
  );
  return (
    <group ref={modelRef} position={[10, 5, 10]}>
      <Animal2Model />
    </group>
  );
}
