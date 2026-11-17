'use client';

import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Center, useGLTF } from '@react-three/drei';
import AnimationGroup, { AnimationGroupHandle } from './AnimationGroupM0';
import { SkeletonUtils } from 'three-stdlib';
import { ModelRef, ModelType } from './type';
import { changeArrayData } from './utils';
import { AnatomyCamera, currentAnatomyCameraAtom, fittedTwinView } from '@/atoms/twin';
import { jotaiStore } from '@/atoms/store';
import { useEventBus } from '@/components/event-bus/useEventBus';
import { MessageType } from '@/components/event-bus/messageType';
import { eventBus } from '@/components/event-bus/eventBus';

export const LIVER_NAME = ['liver_left', 'liver_right'];
export const BICEP_NAME = ['R_bicep_brachii_long_head', 'R_bicep_brachii_short_head', 'R_bicipital_aponeurosis'];

const Model0In = forwardRef<ModelRef>(function ({}, ref) {
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
    'https://resources.id.life/full_male/cloth-v1.glb',
    'https://resources.id.life/full_male/integumentary_system_tin.glb',
    'https://resources.id.life/landingsite/twin/muscular_system.glb',
    'https://resources.id.life/twin/m0/connective_tissue.glb',
    'https://resources.id.life/landingsite/twin/organs.glb',
    'https://resources.id.life/twin/m0/lymphatic_system.glb',
    'https://resources.id.life/landingsite/twin/vascular_system.glb',
    'https://resources.id.life/twin/m0/nervous_system.glb',
    'https://resources.id.life/twin/m0/cartilage_tissue.glb',
    'https://resources.id.life/landingsite/twin/skeletal_system.glb',
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
    switchAnatomyModule(index);
  };

  const moduleRun = useRef(0);
  // On mount (the anatomy view is entered), the view marked now: a view pressed before this model was mounted has no
  // listener yet, and the stage's call below may still carry the view of the moment anatomy was pressed. This model is
  // the one every view's camera is framed on (the stage fits the camera to its scenes), so it also frames the camera
  // for that view if nothing has framed it yet (fittedTwinView): pressed before the mount, the view's own camera move
  // found no scene to fit and did nothing, and the stage's late framing gives up if this model takes over a second. It
  // waits two frames, until <Center> has placed the model; framed only once, from the camera a slow press starts from.
  useEffect(() => {
    switchAnatomyModule(jotaiStore.get(currentAnatomyCameraAtom));
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        const view = jotaiStore.get(currentAnatomyCameraAtom);
        if (fittedTwinView() !== view) eventBus.next({ type: MessageType.SWITCH_CAMERA, payload: { index: view } });
      });
    });
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once, on mount
  }, []);

  const switchAnatomyModule = (index: AnatomyCamera) => {
    // A newer view stops this one's staged changes (one object per frame) instead of being overwritten by them.
    moduleRun.current += 1;
    const run = moduleRun.current;
    const live = () => run === moduleRun.current;
    // 展示完全体
    if (index === AnatomyCamera.CAMERA0) {
      changeArrayData(models, 'visible', true, 0, live);
    }
    // 去除肌肉
    if (index === AnatomyCamera.CAMERA1) {
      const muscleSystem = [models[0]];
      const otherSystem = models.filter((child) => !muscleSystem.includes(child));
      changeArrayData(muscleSystem, 'visible', false, 0, live);
      changeArrayData(otherSystem, 'visible', true, 0, live);
    }
    // 只保留血管
    if (index === AnatomyCamera.CAMERA2) {
      const vascularSystem = [models[4]];
      const otherSystem = models.filter((child) => !vascularSystem.includes(child));
      changeArrayData(vascularSystem, 'visible', true, 0, live);
      changeArrayData(otherSystem, 'visible', false, 0, live);
    }
    // 只展示心脏
    if (index === AnatomyCamera.CAMERA3) {
      const vascularSystem = [models[4]];
      const otherSystem = models.filter((child) => !vascularSystem.includes(child));
      changeArrayData(otherSystem, 'visible', false, 0, live);
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
      changeArrayData(otherSystem, 'visible', false, 0, live);
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
      changeArrayData(muscleSystem, 'visible', false, 0, live);
      changeArrayData(otherSystem, 'visible', true, 0, live);
    }
    // 只保留骨骼
    if (index === AnatomyCamera.CAMERA6) {
      const skeletalSystem = [models[7]];
      const otherSystem = models.filter((child) => !skeletalSystem.includes(child));
      changeArrayData(skeletalSystem, 'visible', true, 0, live);
      changeArrayData(otherSystem, 'visible', false, 0, live);
    }
    // 展示完全体
    if (index === AnatomyCamera.CAMERA7) {
      changeArrayData(models, 'visible', true, 0, live);
    }
    // 只展示肝脏
    if (index === AnatomyCamera.CAMERA8) {
      const organs = [models[2]];
      const otherSystem = models.filter((child) => !organs.includes(child));
      changeArrayData(otherSystem, 'visible', false, 0, live);
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
      changeArrayData(otherSystem, 'visible', false, 0, live);
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
      changeArrayData(vascularSystem, 'visible', true, 0, live);
      changeArrayData(otherSystem, 'visible', false, 0, live);
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

Model0In.displayName = 'Model0In';

export default Model0In;
