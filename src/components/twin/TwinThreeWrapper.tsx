'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useMemo, useRef } from 'react';
import { CameraControls, PerspectiveCamera, useGLTF, View } from '@react-three/drei';
import Model0 from '@/components/twin/model/Model0';
import EnvironmentGroup from '@/components/twin/EnvironmentGroup';
import ExtendedCameraControls from '@/components/twin/ExtendedCameraControls';
import Model1 from '@/components/twin/model/Model1';
import Model2 from '@/components/twin/model/Model2';
import Model3 from '@/components/twin/model/Model3';
import Loader from './Loader';
import LightGroup from '@/components/twin/LightGroup';
import SwitchModel from '@/app/twin/_components/SwitchModel';
import { useAtomValue, useSetAtom } from 'jotai';
import { currentModelAtom, currentModelTypeAtom, PredictionModel } from '@/atoms/twin';
import SwitchSkin from '@/app/twin/_components/SwitchSkin';
import { ModelRef, ModelType } from './model/type';
import { MessageType } from '../event-bus/messageType';
import { useEventBus } from '../event-bus/useEventBus';
import * as THREE from 'three';
import SwitchAnatomyCamera from '@/app/twin/_components/SwitchAnatomyCamera';


export default function TwinThreeWrapper() {
  const modelRefs = [useRef<ModelRef>(null), useRef<ModelRef>(null)];
  const currentModel = useAtomValue(currentModelAtom);
  const setCurrentModelType = useSetAtom(currentModelTypeAtom);
  const controlRef1 = useRef<CameraControls>(null);
  const controlRef2 = useRef<CameraControls>(null);
  const isSyncingRef = useRef(false);
  const controlRefs = useMemo(() => [controlRef1, controlRef2], [controlRef1, controlRef2]);
  useGLTF.preload([
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

  // 切换模型
  useEventBus(MessageType.SWITCH_MODEL, (payload: { type: ModelType }) => {
    modelRefs.forEach((modelRef) => {
      if (!modelRef.current) return;
      modelRef.current.switchModelShow(payload.type);
    });
    console.log('switch model', payload.type);
    setCurrentModelType(payload.type);
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

  return (
    <div id="twin-three-wrapper" className="invisible fixed left-0 top-0 z-0 grid h-screen w-screen grid-cols-1 opacity-0">
      <SwitchModel />
      <SwitchSkin />
      <SwitchAnatomyCamera />
      <div
        style={{
          position: 'relative',
          height: '100%',
          display: 'grid',
          gridTemplateColumns: currentModel ? '1fr 1fr' : '1fr',
          paddingLeft: currentModel ? '40%' : '0%',
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
            <Model0 ref={modelRefs[0]} />
            <EnvironmentGroup />
            <LightGroup ambientIntensity={1.6} />
            <ExtendedCameraControls ref={controlRefs[0]} />
          </View>
        )}
        {currentModel === PredictionModel.M1 && (
          <View index={2} style={{ overflow: 'hidden', width: '100%', height: '100vh' }}>
            <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} near={0.1} far={10000} />
            <Model1 ref={modelRefs[1]} />
            <EnvironmentGroup />
            <LightGroup ambientIntensity={1.6} />
            <ExtendedCameraControls ref={controlRefs[1]} />
          </View>
        )}
        {currentModel === PredictionModel.M2 && (
          <View index={2} style={{ overflow: 'hidden', width: '100%', height: '100vh' }}>
            <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} near={0.1} far={10000} />
            <Model2 ref={modelRefs[1]} />
            <EnvironmentGroup />
            <LightGroup ambientIntensity={1.6} />
            <ExtendedCameraControls ref={controlRefs[1]} />
          </View>
        )}
        {currentModel === PredictionModel.M3 && (
          <View index={2} style={{ overflow: 'hidden', width: '100%', height: '100vh' }}>
            <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} near={0.1} far={10000} />
            <Model3 ref={modelRefs[1]} />
            <EnvironmentGroup />
            <LightGroup ambientIntensity={1.6} />
            <ExtendedCameraControls ref={controlRefs[1]} />
          </View>
        )}
      </div>
    </div>
  );
}
