'use client';

import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';
import { Center, useGLTF } from '@react-three/drei';
import { ModelRef, ModelType } from './type';
import { AnatomyCamera } from '@/atoms/twin';

const Model3In = forwardRef<ModelRef>(function ({}, ref) {
  const [cloth, integumentarySystem, vascularSystem] = useGLTF([
    'https://cdn.id.life/full_male/cloth-v1.glb',
    'https://cdn.id.life/m3/integumentary_system_fat.glb',
    'https://cdn.id.life/landingsite/twin/vascular_system.glb',
  ]);

  const clothScene = useMemo(() => SkeletonUtils.clone(cloth.scene), [cloth.scene]);
  const integumentarySystemScene = useMemo(() => SkeletonUtils.clone(integumentarySystem.scene), [integumentarySystem.scene]);
  const vascularSystemScene = useMemo(() => SkeletonUtils.clone(vascularSystem.scene), [vascularSystem.scene]);

  const modelInRef = useRef<THREE.Group>(null);

  useImperativeHandle(ref, () => ({ switchModelShow: switchModelShow }));

  useEffect(() => {
    if (!integumentarySystemScene) return;
    integumentarySystemScene.traverse((object: any) => {
      if (object.isMesh && object.name === 'Mesh43_3') {
        object.material.color.set(0xff0000);
      }
    });
  }, [integumentarySystemScene]);

  const switchModelShow = (type: ModelType, index: AnatomyCamera) => {};

  useEffect(() => {
    // 修改 血管 颜色
    vascularSystemScene.traverse((object: any) => {
      if (object.isMesh && object.name === 'Mesh016') {
        object.material.color.set(0xff0000);
      }
      if (object.isMesh && object.name === 'Mesh016_1') {
        object.material.color.set(0x0000dd);
        object.material.opacity = 0.3;
      }
    });
    // 修改 皮肤 颜色
    integumentarySystemScene.traverse((object: any) => {
      if (object.isMesh && object.name === 'Mesh431002') {
        object.visible = true;
        object.material.color.set(0xff0000);
      }
    });
  }, [vascularSystemScene, integumentarySystemScene]);

  return (
    <Center ref={modelInRef} scale={5}>
      <primitive visible={true} object={clothScene} />
      <primitive visible={true} object={integumentarySystemScene} />
      <primitive visible={true} object={vascularSystemScene} />
    </Center>
  );
});

Model3In.displayName = 'Model3In';

export default Model3In;
