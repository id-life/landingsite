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

export const LIVER_NAME = ['liver_left', 'liver_right'];
export const BICEP_NAME = ['R_bicep_brachii_long_head', 'R_bicep_brachii_short_head', 'R_bicipital_aponeurosis'];

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
    'https://cdn.id.life/landingsite/twin/muscular_system.glb',
    'https://cdn.id.life/twin/m0/connective_tissue.glb',
    'https://cdn.id.life/landingsite/twin/organs.glb',
    'https://cdn.id.life/twin/m0/lymphatic_system.glb',
    'https://cdn.id.life/landingsite/twin/vascular_system.glb',
    'https://cdn.id.life/twin/m0/nervous_system.glb',
    'https://cdn.id.life/twin/m0/cartilage_tissue.glb',
    'https://cdn.id.life/landingsite/twin/skeletal_system.glb',
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

  useImperativeHandle(ref, () => ({
    scenes: {
      muscular_system: muscularSystemScene as THREE.Group,
      connective_tissue: connectiveTissueScene as THREE.Group,
      organs: organsScene as THREE.Group,
      lymphatic_system: lymphaticSystemScene as THREE.Group,
      vascular_system: vascularSystemScene as THREE.Group,
      nervous_system: nervousSystemScene as THREE.Group,
      cartilage_tissue: cartilageTissueScene as THREE.Group,
      skeletal_system: skeletalSystemScene as THREE.Group,
    },
    switchModelShow: switchModelShow,
  }));

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

  const switchModelShow = (type: ModelType, index: AnatomyCamera) => {
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
        changeArrayData([modelInRef.current.children[0], modelInRef.current.children[1]], 'visible', true);
        switchAnatomyModule(index);
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

  const switchAnatomyModule = (index: AnatomyCamera) => {
    // 展示完全体
    if (index === AnatomyCamera.CAMERA0) {
      changeArrayData(models, 'visible', true);
    }
    // 去除肌肉
    if (index === AnatomyCamera.CAMERA1) {
      const muscleSystem = [models[0]];
      const otherSystem = models.filter((child) => !muscleSystem.includes(child));
      changeArrayData(muscleSystem, 'visible', false);
      changeArrayData(otherSystem, 'visible', true);
    }
    // 只保留血管
    if (index === AnatomyCamera.CAMERA2) {
      const vascularSystem = [models[4]];
      const otherSystem = models.filter((child) => !vascularSystem.includes(child));
      changeArrayData(vascularSystem, 'visible', true);
      changeArrayData(otherSystem, 'visible', false);
    }
    // 只展示心脏
    if (index === AnatomyCamera.CAMERA3) {
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
    if (index === AnatomyCamera.CAMERA4) {
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
    // 只保留血管
    if (index === AnatomyCamera.CAMERA10) {
      const vascularSystem = [models[4]];
      const otherSystem = models.filter((child) => !vascularSystem.includes(child));
      changeArrayData(vascularSystem, 'visible', true);
      changeArrayData(otherSystem, 'visible', false);
    }
  }

  useEventBus(MessageType.SWITCH_ANATOMY_MODULE, (payload: { index: AnatomyCamera }) => {
    switchAnatomyModule(payload.index);
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
