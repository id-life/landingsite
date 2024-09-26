import gsap from 'gsap';
import { clsx } from 'clsx';
import * as THREE from 'three';
import React, { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, MeshDistortMaterial, useGLTF } from '@react-three/drei';

type GeoData = {
  title: string;
  position: THREE.Vector3;
  groupPosition: THREE.Vector3;
  cameraPosition: THREE.Vector3;
};
const GEO_DATA: GeoData[] = [
  {
    title: 'Vetted & Novel Interventions',
    position: new THREE.Vector3(1, 1, 0),
    groupPosition: new THREE.Vector3(0, -1.4, 0),
    cameraPosition: new THREE.Vector3(1.82, -0.72, -0.37),
  },
  {
    title: 'Supplements',
    position: new THREE.Vector3(-0.5 - 0.5, 0.87),
    groupPosition: new THREE.Vector3(0, -1.4, 0),
    cameraPosition: new THREE.Vector3(-1.72, -0.99, 0.17),
  },
  {
    title: 'Biomarker Tracking',
    position: new THREE.Vector3(-0.5 - 0.5, -0.87),
    groupPosition: new THREE.Vector3(1, -0.4, -0.1),
    cameraPosition: new THREE.Vector3(-0.06, -1.99, 0.01),
  },
];

export default function Model({ controlsRef }: { controlsRef: { current?: any } }) {
  const group = useRef<THREE.Group>();
  const { camera } = useThree();
  const { nodes } = useGLTF('/models/geo.min.glb', true) as any;
  const _cameraPosRef = useRef<THREE.Vector3>();
  const [selectedItem, setSelectedItem] = useState<GeoData | undefined>(undefined);

  useFrame(({ clock }) => {
    if (!controlsRef.current.autoRotate) return;
    if (!group.current) return;
    const t = (1 + Math.sin(clock.getElapsedTime() * 1.5)) / 2;
    group.current.position.y = t / 4 - 0.2;
  });

  const handleGoToItemLabel = (item: GeoData) => {
    if (!group.current) return;
    if (!camera) return;
    controlsRef.current.autoRotate = false;
    gsap.to(group.current.position, {
      duration: 0.6,
      x: item.groupPosition.x,
      y: item.groupPosition.y,
      z: item.groupPosition.z,
    });
    gsap.to(group.current.scale, {
      duration: 0.6,
      x: 1.3,
      y: 1.3,
      z: 1.3,
    });
    gsap.to(camera.position, {
      duration: 1,
      x: item.cameraPosition.x,
      y: item.cameraPosition.y,
      z: item.cameraPosition.z,
    });
  };

  const handleReverseClick = () => {
    if (!group.current) return;
    if (!_cameraPosRef.current) return;
    gsap.to(camera.position, {
      duration: 1,
      x: _cameraPosRef.current.x,
      y: _cameraPosRef.current.y,
      z: _cameraPosRef.current.z,
    });
    gsap.to(group.current.scale, {
      duration: 1,
      x: 1,
      y: 1,
      z: 1,
    });
    gsap.to(group.current.position, {
      duration: 1,
      x: 0,
      y: 0,
      z: 0,
      onComplete: () => {
        controlsRef.current.autoRotate = true;
      },
    });
  };

  const handleItemClick = (item: GeoData) => {
    if (controlsRef.current.autoRotate) {
      _cameraPosRef.current = camera.position.clone();
      handleGoToItemLabel(item);
      setSelectedItem(item);
    } else {
      handleReverseClick();
      setSelectedItem(undefined);
    }
  };

  return (
    <group ref={(ref: any) => (group.current = ref)}>
      <mesh geometry={nodes.geo.geometry} castShadow receiveShadow>
        <MeshDistortMaterial color="#ffffff" flatShading roughness={1} metalness={0.5} factor={15} speed={5} />
      </mesh>
      <mesh geometry={nodes.geo.geometry}>
        <meshBasicMaterial wireframe />
      </mesh>
      {GEO_DATA.map((item, index) => {
        return (
          <Html key={index} position={item.position}>
            <div
              onClick={() => handleItemClick(item)}
              className={clsx('relative cursor-pointer', { hidden: selectedItem && selectedItem !== item })}
            >
              <div className="w-full text-nowrap rounded-xl bg-white/50 px-6 py-3.5 text-xl font-bold uppercase">
                {item.title}
              </div>
              <div className="geo-point relative left-1/2 mt-3 h-4 w-4 -translate-x-1/2 rounded-full bg-gray-800" />
            </div>
          </Html>
        );
      })}
    </group>
  );
}
