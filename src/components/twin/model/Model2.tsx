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

const Model2 = forwardRef<ModelRef>(function ({}, ref) {
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

Model2.displayName = 'Model2';

export default Model2;
