'use client';

import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';
import { Center, useGLTF } from '@react-three/drei';
import AnimationGroup, { AnimationGroupHandle } from './AnimationGroupM3';
import { ModelRef, ModelType } from './type';
import { changeArrayData } from './utils';

const Model3 = forwardRef<ModelRef>(function ({}, ref) {
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
    'https://cdn.id.life/m3/integumentary_system_fat.glb',
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

  useEffect(() => {
    if (!integumentarySystemScene) return;
    integumentarySystemScene.traverse((object: any) => {
      if (object.isMesh && object.name === 'Mesh43_3') {
        object.material.color.set(0xff0000);
      }
    });
  }, [integumentarySystemScene]);

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

Model3.displayName = 'Model3';

export default Model3;
