'use client';

import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Center, useGLTF } from '@react-three/drei';
import AnimationGroup, { AnimationGroupHandle } from './AnimationGroupM1';
import { SkeletonUtils } from 'three-stdlib';
import { ModelRef, ModelType } from './type';
import { changeArrayData } from './utils';
import { AnatomyCamera } from '@/atoms/twin';
import { useEventBus } from '@/components/event-bus/useEventBus';
import { MessageType } from '@/components/event-bus/messageType';

// 皮肤层稍微变暗
const DEFAULT_INTEGUMENTARY_OPACITY = 0.4;

const Model1In = forwardRef<ModelRef>(function ({}, ref) {
  const [
    cloth,
    integumentarySystem,
    muscularSystem,
    connectiveTissue,
    organs,
    lymphaticSystem,
    vascularSystem,
    nervousSystem,
    cartilageTissue,
    skeletalSystem,
  ] = useGLTF([
    'https://cdn.id.life/m1/cloth-v1.glb',
    'https://cdn.id.life/m1/integumentary_system.glb',
    'https://cdn.id.life/twin/m0/muscular_system.glb',
    'https://cdn.id.life/twin/m0/connective_tissue.glb',
    'https://cdn.id.life/twin/m0/organs.glb',
    'https://cdn.id.life/twin/m0/lymphatic_system.glb',
    'https://cdn.id.life/twin/m1/vascular_system.glb',
    'https://cdn.id.life/twin/m0/nervous_system.glb',
    'https://cdn.id.life/twin/m1/cartilage_tissue.glb',
    'https://cdn.id.life/twin/m1/skeletal_system.glb',
  ]);

  const clothScene = useMemo(() => SkeletonUtils.clone(cloth.scene), [cloth.scene]);
  const integumentarySystemScene = useMemo(() => SkeletonUtils.clone(integumentarySystem.scene), [integumentarySystem.scene]);
  const muscularSystemScene = useMemo(() => SkeletonUtils.clone(muscularSystem.scene), [muscularSystem.scene]);
  const connectiveTissueScene = useMemo(() => SkeletonUtils.clone(connectiveTissue.scene), [connectiveTissue.scene]);
  const organsScene = useMemo(() => SkeletonUtils.clone(organs.scene), [organs.scene]);
  const lymphaticSystemScene = useMemo(() => SkeletonUtils.clone(lymphaticSystem.scene), [lymphaticSystem.scene]);
  const vascularSystemScene = useMemo(() => SkeletonUtils.clone(vascularSystem.scene), [vascularSystem.scene]);
  const nervousSystemScene = useMemo(() => SkeletonUtils.clone(nervousSystem.scene), [nervousSystem.scene]);
  const cartilageTissueScene = useMemo(() => SkeletonUtils.clone(cartilageTissue.scene), [cartilageTissue.scene]);
  const skeletalSystemScene = useMemo(() => SkeletonUtils.clone(skeletalSystem.scene), [skeletalSystem.scene]);

  useImperativeHandle(ref, () => ({ switchModelShow: switchModelShow }));

  const models = useMemo(() => {
    return [
      muscularSystemScene,
      connectiveTissueScene,
      organsScene,
      lymphaticSystemScene,
      vascularSystemScene,
      nervousSystemScene,
      cartilageTissueScene,
      skeletalSystemScene,
    ];
  }, [
    muscularSystemScene,
    connectiveTissueScene,
    organsScene,
    lymphaticSystemScene,
    vascularSystemScene,
    nervousSystemScene,
    cartilageTissueScene,
    skeletalSystemScene,
  ]);

  useEffect(() => {
    if (!models.length) return;
    models.forEach((scene: any, index: number) => {
      scene.traverse((object: any) => {
        if (object.isMesh) {
          object.material = object.material.clone();
          object.material.transparent = true;
        }
      });
      if (index === 0) {
        // 皮肤变红
        scene.traverse((object: any) => {
          if (object.isMesh) {
            object.material.roughness = 1;
            object.material.color.set(0xcccccc);
          }
        });
      }
      if (index === 4) {
        // 血管变黄
        scene.traverse((object: any) => {
          if (object.isMesh && object.name === 'Mesh016') {
            object.material.color.set(0xfc884d);
          }
        });
      }
      if (index === 6) {
        // 关节变红
        scene.traverse((object: any) => {
          if (object.isMesh) {
            object.material.color.set(0xf39a86);
          }
        });
      }
    });
  }, [models]);

  useEffect(() => {
    // 皮肤层稍微变暗
    if (!integumentarySystemScene) return;
    integumentarySystemScene.traverse((object: any) => {
      if (object.isMesh) {
        object.material.opacity = DEFAULT_INTEGUMENTARY_OPACITY;
      }
    });
  }, [integumentarySystemScene]);

  const switchModelShow = (type: ModelType, index: AnatomyCamera) => {
    switchAnatomyModule(index);
  };

  const switchAnatomyModule = (index: AnatomyCamera) => {
    // 展示完全体
    if (index === AnatomyCamera.CAMERA0) {
      changeArrayData(models, 'visible', true);
    }
    // 去除肌肉
    if (index === AnatomyCamera.CAMERA5) {
      const muscleSystem = [models[0]];
      const otherSystem = models.filter((child) => !muscleSystem.includes(child));
      changeArrayData(muscleSystem, 'visible', false);
      changeArrayData(otherSystem, 'visible', true);
    }

    // 只保留骨骼
    if (index === AnatomyCamera.CAMERA6) {
      const skeletalSystem = [models[7]];
      const otherSystem = models.filter((child) => !skeletalSystem.includes(child));
      changeArrayData(skeletalSystem, 'visible', true);
      changeArrayData(otherSystem, 'visible', false);
    }
  };

  useEventBus(MessageType.SWITCH_ANATOMY_MODULE, (payload: { index: AnatomyCamera }) => {
    switchAnatomyModule(payload.index);
  });

  return (
    <Center scale={5}>
      <primitive visible={true} object={clothScene} />
      <primitive visible={true} object={integumentarySystemScene} />
      <primitive visible={true} object={muscularSystemScene} />
      <primitive visible={true} object={connectiveTissueScene} />
      <primitive visible={true} object={organsScene} />
      <primitive visible={true} object={lymphaticSystemScene} />
      <primitive visible={true} object={vascularSystemScene} />
      <primitive visible={true} object={nervousSystemScene} />
      <primitive visible={true} object={cartilageTissueScene} />
      <primitive visible={true} object={skeletalSystemScene} />
    </Center>
  );
});

Model1In.displayName = 'Model1In';

export default Model1In;
