'use client';

import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';
import { Center, useGLTF } from '@react-three/drei';
import AnimationGroup, { AnimationGroupHandle } from './AnimationGroupM2';
import { ModelRef, ModelType } from './type';
import { changeArrayData } from './utils';
import { AnatomyCamera } from '@/atoms/twin';
import { MessageType } from '@/components/event-bus/messageType';
import { useEventBus } from '@/components/event-bus/useEventBus';
import { BICEP_NAME, LIVER_NAME } from './Model0';

const liverNames = ['hepatic_duct', 'liver_ligament', 'liver_right', 'left_hepatic_duct', 'right_hepatic_duct', 'liver_left'];
const stomachNames = ['stomach', 'small_intestine', 'colon'];

const Model2In = forwardRef<ModelRef>(function ({}, ref) {
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
    'https://cdn.id.life/full_male/cloth-v1.glb',
    'https://cdn.id.life/full_male/integumentary_system_tin.glb',
    'https://cdn.id.life/twin/m2/muscular_system.glb',
    'https://cdn.id.life/twin/m0/connective_tissue.glb',
    'https://cdn.id.life/twin/m0/organs.glb',
    'https://cdn.id.life/twin/m0/lymphatic_system.glb',
    'https://cdn.id.life/twin/m0/vascular_system.glb',
    'https://cdn.id.life/twin/m0/nervous_system.glb',
    'https://cdn.id.life/twin/m0/cartilage_tissue.glb',
    'https://cdn.id.life/twin/m0/skeletal_system.glb',
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
    models.forEach((scene: any) => {
      scene.traverse((object: any) => {
        if (object.isMesh) {
          object.material = object.material.clone();
          object.material.transparent = true;
        }
        // 调整肝脏
        if (liverNames.includes(object.name)) {
          object.material.roughness = 0.3;
          object.material.color.set(0xcc0000);
        }
        // 调整胃
        if (stomachNames.includes(object.name)) {
          object.material.roughness = 0.3;
          object.material.color.set(0xffcccc);
        }
      });
    });
  }, [models]);

  const switchModelShow = (type: ModelType, index: AnatomyCamera) => {
    switchAnatomyModule(index);
  };

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
  }, [vascularSystemScene]);

  const switchAnatomyModule = (index: AnatomyCamera) => {
    // 展示完全体
    if (index === AnatomyCamera.CAMERA7) {
      changeArrayData(models, 'visible', true);
    }
    // 只展示肝脏
    if (index === AnatomyCamera.CAMERA8) {
      const organs = [models[2]];
      const otherSystem = models.filter((child) => !organs.includes(child));
      changeArrayData(otherSystem, 'visible', false);
      organs[0].visible = true;
      organs[0].traverse((object: any) => {
        if (object.isMesh) {
          object.visible = LIVER_NAME.includes(object.name);
        }
      });
    }
    // 只展示右肱二头肌
    if (index === AnatomyCamera.CAMERA9) {
      const muscleSystem = [models[0]];
      const otherSystem = models.filter((child) => !muscleSystem.includes(child));
      changeArrayData(otherSystem, 'visible', false);
      muscleSystem[0].visible = true;
      muscleSystem[0].traverse((object: any) => {
        if (object.isMesh) {
          object.visible = BICEP_NAME.includes(object.name);
        }
      });
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

Model2In.displayName = 'Model2In';

export default Model2In;
