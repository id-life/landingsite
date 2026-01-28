'use client';

import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { SkeletonUtils } from 'three-stdlib';
import { Center, useGLTF } from '@react-three/drei';
import AnimationGroup, { AnimationGroupHandle } from './AnimationGroupM3';
import { ModelRef, ModelType } from './type';
import { changeArrayData } from './utils';
import { AnatomyCamera } from '@/atoms/twin';

const Model3 = forwardRef<ModelRef>(function ({}, ref) {
  const [cloth, integumentarySystem, vascularSystem] = useGLTF([
    'https://resources.id.life/full_male/cloth-v1.glb',
    'https://resources.id.life/m3/integumentary_system_fat.glb',
    'https://resources.id.life/landingsite/twin/vascular_system.glb',
  ]);

  const clothScene = useMemo(() => SkeletonUtils.clone(cloth.scene), [cloth.scene]);
  const integumentarySystemScene = useMemo(() => SkeletonUtils.clone(integumentarySystem.scene), [integumentarySystem.scene]);
  const vascularSystemScene = useMemo(() => SkeletonUtils.clone(vascularSystem.scene), [vascularSystem.scene]);

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
        changeArrayData(modelInRef.current.children, 'visible', true);
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
        <primitive visible={false} object={vascularSystemScene} />
      </group>
    </Center>
  );
});

Model3.displayName = 'Model3';

export default Model3;
