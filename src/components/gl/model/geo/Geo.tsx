import gsap from 'gsap';
import { clsx } from 'clsx';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { GEO_DATA, GeoData } from '@/components/gl/model/geo/config';
import { Html, MeshDistortMaterial, useGLTF } from '@react-three/drei';

export type ModelProps = {
  controlsRef: { current?: any };
  onLabelClick?: (item: GeoData) => void;
};

export type ModelRef = {
  onChartClose: () => void;
};

const Model = forwardRef<ModelRef, ModelProps>(({ controlsRef, onLabelClick }, ref) => {
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
      onComplete: () => {
        setSelectedItem(item);
        onLabelClick?.(item);
      },
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
        setSelectedItem(undefined);
      },
    });
  };

  const handleItemClick = (item: GeoData) => {
    if (controlsRef.current.autoRotate) {
      _cameraPosRef.current = camera.position.clone();
      handleGoToItemLabel(item);
    } else {
      handleReverseClick();
    }
  };

  useImperativeHandle(ref, () => ({
    onChartClose() {
      handleReverseClick();
    },
  }));

  return (
    <group ref={(ref: any) => (group.current = ref)}>
      <mesh geometry={nodes.geo.geometry} castShadow receiveShadow>
        <MeshDistortMaterial color="#ffffff" flatShading roughness={1} metalness={0.5} factor={15} speed={5} />
      </mesh>
      <mesh geometry={nodes.geo.geometry}>
        <meshBasicMaterial wireframe />
      </mesh>
      {GEO_DATA.map((item, index) => (
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
      ))}
    </group>
  );
});

Model.displayName = 'Model';
export default Model;
