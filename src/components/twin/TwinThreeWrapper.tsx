'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useMemo, useRef, useState } from 'react';
import { CameraControls, PerspectiveCamera, useGLTF, View } from '@react-three/drei';
import EnvironmentGroup from '@/components/twin/EnvironmentGroup';
import ExtendedCameraControls from '@/components/twin/ExtendedCameraControls';
import Loader from './Loader';
import LightGroup from '@/components/twin/LightGroup';
import SwitchModel from '@/app/twin/_components/SwitchModel';
import { useAtom, useSetAtom } from 'jotai';
import { AnatomyCamera, currentAnatomyCameraAtom, currentModelAtom, currentModelTypeAtom, PredictionModel } from '@/atoms/twin';
import SwitchSkin from '@/app/twin/_components/SwitchSkin';
import { ModelRef, ModelType } from './model/type';
import { MessageType } from '../event-bus/messageType';
import { useEventBus } from '../event-bus/useEventBus';
import * as THREE from 'three';
import SwitchAnatomyCamera from '@/app/twin/_components/SwitchAnatomyCamera';
import { eventBus } from '../event-bus/eventBus';
import ModelReport from '@/app/twin/_components/ModelReport';
import Model0In from './model/Model0In';
import Model0Out from './model/Model0Out';
import Model1In from './model/Model1In';
import Model1Out from './model/Model1Out';
import Model3In from './model/Model3In';
import Model3Out from './model/Model3Out';
import Model2Out from './model/Model2Out';
import Model2In from './model/Model2In';
import { pollComponentMethod } from '@/components/twin/model/utils';

export default function TwinThreeWrapper() {
  const modelRefs = [useRef<ModelRef>(null), useRef<ModelRef>(null)];
  const [currentModel, setCurrentModel] = useAtom(currentModelAtom);
  const setCurrentModelType = useSetAtom(currentModelTypeAtom);
  const setCurrentAnatomyCamera = useSetAtom(currentAnatomyCameraAtom);
  const controlRef1 = useRef<CameraControls>(null);
  const controlRef2 = useRef<CameraControls>(null);
  const isSyncingRef = useRef(false);
  const controlRefs = useMemo(() => [controlRef1, controlRef2], [controlRef1, controlRef2]);
  const [modelType, setModelType] = useState<ModelType>(ModelType.Skin);
  useGLTF.preload(['https://cdn.id.life/full_male/test-v2.glb']);

  // 切换模型
  useEventBus(MessageType.SWITCH_MODEL, (payload: { type: ModelType; model: PredictionModel }) => {
    const controls1 = controlRefs[0]?.current;
    const controls2 = controlRefs[1]?.current;
    // 重制镜头
    if (payload.type === ModelType.Skin) {
      controls1?.setLookAt(0, 0, 15, 0, 0, 0, true).then(() => {
        setCurrentModel(payload.model);
      });
      controls2?.setLookAt(0, 0, 15, 0, 0, 0, true);
      setCurrentAnatomyCamera(AnatomyCamera.CAMERA0);
    }
    let index = AnatomyCamera.CAMERA0;
    if (payload.type === ModelType.Anatomy) {
      if (payload.model === PredictionModel.M0 || payload.model === PredictionModel.M1) {
        index = AnatomyCamera.CAMERA0;
      }
      if (payload.model === PredictionModel.M2) {
        index = AnatomyCamera.CAMERA7;
      }
      if (payload.model === PredictionModel.M3) {
        index = AnatomyCamera.CAMERA10;
      }
      setCurrentAnatomyCamera(index);
      setCurrentModel(payload.model);
    }
    setCurrentModelType(payload.type);
    setModelType(payload.type);
    pollComponentMethod(modelRefs[0], 'switchModelShow', [payload.type, index]).then(() => {
      eventBus.next({ type: MessageType.SWITCH_CAMERA, payload: { index } })
    });
    pollComponentMethod(modelRefs[1], 'switchModelShow', [payload.type, index]).then();
  });

  //对比视角同步
  const syncCameras = (source: CameraControls, target: CameraControls) => {
    if (isSyncingRef.current) return;
    isSyncingRef.current = true;
    const targetPosition = new THREE.Vector3();
    const cameraPosition = new THREE.Vector3();
    source.getTarget(targetPosition);
    cameraPosition.copy(source.camera.position);

    target.setLookAt(
      cameraPosition.x,
      cameraPosition.y,
      cameraPosition.z,
      targetPosition.x,
      targetPosition.y,
      targetPosition.z,
      false,
    );

    isSyncingRef.current = false;
  };

  useEventBus(MessageType.SYNC_CAMERA, (source) => {
    const controls1 = controlRefs[0]?.current;
    const controls2 = controlRefs[1]?.current;
    if (!controls1 || !controls2) return;
    if (source === controls1) {
      syncCameras(controls1, controls2);
    } else {
      syncCameras(controls2, controls1);
    }
  });

  // 镜头控制
  useEventBus(MessageType.SWITCH_CAMERA, (payload: { index: AnatomyCamera }) => {
    const controls1 = controlRefs[0]?.current;
    const controls2 = controlRefs[1]?.current;
    if (payload.index === AnatomyCamera.CAMERA0) {
      controls1?.setLookAt(0, 0, 15, 0, 0, 0, true);
      controls2?.setLookAt(0, 0, 15, 0, 0, 0, true);
    }
    if (payload.index === AnatomyCamera.CAMERA1) {
      controls1?.setLookAt(0, 0, 15, 0, 0, 0, true);
      controls2?.setLookAt(0, 0, 15, 0, 0, 0, true);
    }
    if (payload.index === AnatomyCamera.CAMERA2) {
      controls1?.setLookAt(0, 0, 15, 0, 0, 0, true);
      controls2?.setLookAt(0, 0, 15, 0, 0, 0, true);
    }
    if (payload.index === AnatomyCamera.CAMERA3) {
      modelRefs[0].current?.scenes?.vascular_system.traverse((object: any) => {
        controls1?.fitToBox(object, true, { cover: false, paddingLeft: 1, paddingRight: 1 });
      });
    }
    if (payload.index === AnatomyCamera.CAMERA4) {
      modelRefs[0].current?.scenes?.nervous_system.traverse((object: any) => {
        if (object.name === 'brain') {
          controls1?.fitToBox(object, true, { cover: false, paddingLeft: 1, paddingRight: 1 });
          controls1?.rotateAzimuthTo(-Math.PI / 4, true);
        }
      });
    }
    if (payload.index === AnatomyCamera.CAMERA5) {
      modelRefs[0].current?.scenes?.skeletal_system.traverse((object: any) => {
        if (object.name === 'Scene') {
          controls1?.fitToBox(object, true);
          controls1?.rotateAzimuthTo(-Math.PI / 2, true);
          controls2?.fitToBox(object, true);
          controls2?.rotateAzimuthTo(-Math.PI / 2, true);
        }
      });
    }
    if (payload.index === AnatomyCamera.CAMERA6) {
      modelRefs[0].current?.scenes?.skeletal_system.traverse((object: any) => {
        if (object.name === 'Scene') {
          controls1?.fitToBox(object, true, { cover: true, paddingLeft: 0, paddingRight: 0 });
          controls1?.rotateAzimuthTo(Math.PI / 4, true);
          controls2?.fitToBox(object, true, { cover: true, paddingLeft: 0, paddingRight: 0 });
          controls2?.rotateAzimuthTo(Math.PI / 4, true);
        }
      });
    }
    if (payload.index === AnatomyCamera.CAMERA7) {
      modelRefs[0].current?.scenes?.muscular_system.traverse((object: any) => {
        if (object.name === 'R_pectoralis_minor') {
          controls1?.fitToBox(object, true, { cover: false, paddingLeft: 1, paddingRight: 1 });
          controls1?.rotateAzimuthTo(-Math.PI / 4, true);
          controls2?.fitToBox(object, true, { cover: false, paddingLeft: 1, paddingRight: 1 });
          controls2?.rotateAzimuthTo(-Math.PI / 4, true);
        }
      });
    }
    if (payload.index === AnatomyCamera.CAMERA8) {
      modelRefs[0].current?.scenes?.organs.traverse((object: any) => {
        if (object.name === 'liver_left') {
          controls1?.fitToBox(object, true, { cover: false, paddingLeft: 1, paddingRight: 1 });
          controls2?.fitToBox(object, true, { cover: false, paddingLeft: 1, paddingRight: 1 });
        }
      });
    }
    if (payload.index === AnatomyCamera.CAMERA9) {
      modelRefs[0].current?.scenes?.muscular_system.traverse((object: any) => {
        if (object.name === 'R_bicep_brachii_long_head') {
          controls1?.fitToBox(object, true, { cover: false, paddingLeft: 1, paddingRight: 1 });
          controls2?.fitToBox(object, true, { cover: false, paddingLeft: 1, paddingRight: 1 });
        }
      });
    }
    if (payload.index === AnatomyCamera.CAMERA10) {
      controls1?.dollyTo(8, true);
      controls2?.dollyTo(8, true);
      controls1?.rotateAzimuthTo(Math.PI / 5, true);
      controls2?.rotateAzimuthTo(Math.PI / 5, true);
      controls1?.rotatePolarTo((Math.PI / 4) * 2.5, true);
      controls2?.rotatePolarTo((Math.PI / 4) * 2.5, true);
    }
  });

  return (
    <div id="twin-three-wrapper" className="invisible fixed left-0 top-0 z-0 grid h-screen w-screen grid-cols-1 opacity-0">
      <SwitchModel />
      <SwitchSkin />
      <SwitchAnatomyCamera />
      <ModelReport />
      <div
        style={{
          position: 'relative',
          height: '100%',
          display: 'grid',
          gridTemplateColumns: currentModel ? '1fr 1fr' : '1fr',
          paddingLeft: currentModel ? '35%' : '0%',
          paddingRight: currentModel ? '10%' : '0%',
        }}
      >
        <Canvas
          id="model-canvas"
          dpr={[1, 2]}
          gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
          style={{
            pointerEvents: 'none',
            position: 'absolute',
            top: '0px',
            height: '100vh',
          }}
        >
          <Suspense fallback={<Loader />}>
            <View.Port />
          </Suspense>
        </Canvas>
        {currentModel && (
          <View index={1} style={{ overflow: 'hidden', width: '100%', height: '100vh' }}>
            <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} near={0.1} far={10000} />
            {modelType === ModelType.Skin && <Model0Out />}
            {modelType === ModelType.Anatomy && <Model0In ref={modelRefs[0]} />}
            <EnvironmentGroup />
            <LightGroup ambientIntensity={1.6} />
            <ExtendedCameraControls ref={controlRefs[0]} />
          </View>
        )}
        {currentModel === PredictionModel.M1 && (
          <View index={2} style={{ overflow: 'hidden', width: '100%', height: '100vh' }}>
            <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} near={0.1} far={10000} />
            {modelType === ModelType.Skin && <Model1Out />}
            {modelType === ModelType.Anatomy && <Model1In ref={modelRefs[1]} />}
            <EnvironmentGroup />
            <LightGroup ambientIntensity={1.6} />
            <ExtendedCameraControls ref={controlRefs[1]} />
          </View>
        )}
        {currentModel === PredictionModel.M2 && (
          <View index={2} style={{ overflow: 'hidden', width: '100%', height: '100vh' }}>
            <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} near={0.1} far={10000} />
            {modelType === ModelType.Skin && <Model2Out />}
            {modelType === ModelType.Anatomy && <Model2In ref={modelRefs[1]} />}
            <EnvironmentGroup />
            <LightGroup ambientIntensity={1.6} />
            <ExtendedCameraControls ref={controlRefs[1]} />
          </View>
        )}
        {currentModel === PredictionModel.M3 && (
          <View index={2} style={{ overflow: 'hidden', width: '100%', height: '100vh' }}>
            <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} near={0.1} far={10000} />
            {modelType === ModelType.Skin && <Model3Out />}
            {modelType === ModelType.Anatomy && <Model3In ref={modelRefs[1]} />}
            <EnvironmentGroup />
            <LightGroup ambientIntensity={1.6} />
            <ExtendedCameraControls ref={controlRefs[1]} />
          </View>
        )}
      </div>
    </div>
  );
}
