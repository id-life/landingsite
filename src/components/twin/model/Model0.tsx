'use client';

import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Center, useGLTF } from '@react-three/drei';
import AnimationGroup, { AnimationGroupHandle } from './AnimationGroupM0';
import { SkeletonUtils } from 'three-stdlib';
import { ModelRef, ModelType } from './type';
import { changeArrayData } from './utils';
import { AnatomyCamera } from '@/atoms/twin';
import { useEventBus } from '@/components/event-bus/useEventBus';
import { MessageType } from '@/components/event-bus/messageType';

const Model0 = forwardRef<ModelRef>(function ({}, ref) {
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
    'https://cdn.id.life/twin/m0/muscular_system.glb',
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

  const modelInRef = useRef<THREE.Group>(null);
  const modelOutRef = useRef<THREE.Group>(null);
  const animationGroupRef = useRef<AnimationGroupHandle>(null);

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

  const switchModelShow = (type: ModelType, onlySkinShow?: boolean) => {
    if (!modelInRef.current || !modelOutRef.current || !animationGroupRef.current) return;
    if (type === ModelType.Skin) {
      // 显示外层模型
      animationGroupRef.current.fadeIn('animationGroup');
      // 播放外层模型动画
      animationGroupRef.current.startAnimationLoop();
      //隐藏解刨模型
      changeArrayData(modelInRef.current.children, 'visible', false);
    } else {
      // 隐藏外层模型
      animationGroupRef.current.fadeOut('animationGroup');
      // 隐藏的时候播放Apose动画，动画完成回调里显示解刨模型
      animationGroupRef.current.playAnimation('Apose', () => {
        if (!modelInRef.current || !modelOutRef.current || !animationGroupRef.current) return;
        //去除外层模型动画
        animationGroupRef.current.stopAnimationLoop();
        //显示解刨模型
        if (onlySkinShow) {
          // 只显示皮肤层
          changeArrayData([modelInRef.current.children[0], modelInRef.current.children[1]], 'visible', true);
        } else {
          changeArrayData(modelInRef.current.children, 'visible', true);
        }
      });
    }
  };

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

  useEventBus(MessageType.SWITCH_ANATOMY_CAMERA, (payload: { index: AnatomyCamera }) => {
    if (!modelInRef.current) return;
    // 展示完全体
    if (payload.index === AnatomyCamera.CAMERA0) {
      changeArrayData(models, 'visible', true);
    }
    // 去除肌肉
    if (payload.index === AnatomyCamera.CAMERA1) {
      const muscleSystem = [models[0]];
      const otherSystem = models.filter((child) => !muscleSystem.includes(child));
      changeArrayData(muscleSystem, 'visible', false);
      changeArrayData(otherSystem, 'visible', true);
    }
    // 只保留血管
    if (payload.index === AnatomyCamera.CAMERA2) {
      const vascularSystem = [models[4]];
      const otherSystem = models.filter((child) => !vascularSystem.includes(child));
      changeArrayData(vascularSystem, 'visible', true);
      changeArrayData(otherSystem, 'visible', false);
    }
    // 只展示心脏
    if (payload.index === AnatomyCamera.CAMERA3) {
      const vascularSystem = [models[4]];
      const otherSystem = models.filter((child) => !vascularSystem.includes(child));
      changeArrayData(otherSystem, 'visible', false);
      vascularSystem[0].visible = true;
      vascularSystem[0].traverse((object: any) => {
        if (object.isMesh) {
          object.visible = object.name === 'heart';
        }
      });
    }
    // 只展示大脑
    if (payload.index === AnatomyCamera.CAMERA4) {
      const nervousSystem = [models[5]];
      const otherSystem = models.filter((child) => !nervousSystem.includes(child));
      changeArrayData(otherSystem, 'visible', false);
      nervousSystem[0].visible = true;
      nervousSystem[0].traverse((object: any) => {
        if (object.isMesh) {
          object.visible = object.name === 'brain';
        }
      });
    }
  });

  return (
    <Center>
      <group ref={modelOutRef} position={[0, 0.2, -0.15]}>
        <AnimationGroup ref={animationGroupRef} modelRef={modelInRef} />
      </group>
      <group ref={modelInRef} scale={5}>
        <primitive visible={false} object={clothScene} />
        <primitive visible={false} object={integumentarySystemScene} />
        <primitive visible={false} object={muscularSystemScene} />
        <primitive visible={false} object={connectiveTissueScene} />
        <primitive visible={false} object={organsScene} />
        <primitive visible={false} object={lymphaticSystemScene} />
        <primitive visible={false} object={vascularSystemScene} />
        <primitive visible={false} object={nervousSystemScene} />
        <primitive visible={false} object={cartilageTissueScene} />
        <primitive visible={false} object={skeletalSystemScene} />
      </group>
    </Center>
  );
});

Model0.displayName = 'Model0';

export default Model0;
