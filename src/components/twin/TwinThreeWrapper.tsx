'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { CameraControls, PerspectiveCamera, useGLTF, View } from '@react-three/drei';
import EnvironmentGroup, { preloadEnvironmentGroup } from '@/components/twin/EnvironmentGroup';
import ExtendedCameraControls from '@/components/twin/ExtendedCameraControls';
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
import Model0Out, { preloadModel0Out } from './model/Model0Out';
import Model1In from './model/Model1In';
import Model1Out from './model/Model1Out';
import Model3In from './model/Model3In';
import Model3Out from './model/Model3Out';
import Model2Out from './model/Model2Out';
import Model2In from './model/Model2In';
import { pollComponentMethod } from '@/components/twin/model/utils';
import YTBDemo from '@/app/twin/_components/YTBDemo';
import Loader from '@/components/twin/Loader';
import FrameDriver from '@/components/gl/FrameDriver';
import { useGpuTier } from '@/motion/gpuTier';
import GLBoundary, { ModelBoundary, onCanvasCreated } from '@/components/gl/GLBoundary';
import { DeferredSettled, useDeferredAssets, useDeferredWarm } from '@/hooks/useDeferredAssets';

/**
 * The avatar's field of view. Every View's camera is 45 degrees and 15 units away, so the avatar's height follows the
 * window's height: about 78 % of it on a laptop, but on a portrait tablet (820x1180) that is 920 px, wider than the
 * headline column and over every control. Portrait and square windows widen the field of view to 56 degrees, which
 * draws the avatar about 78 % as large (tan 28 / tan 22.5) without moving the camera that the controls animate.
 * (RWD-02 medium tier.)
 */
const PORTRAIT_QUERY = '(max-aspect-ratio: 1/1)';
function useTwinFov() {
  const [portrait, setPortrait] = useState(() => typeof window !== 'undefined' && window.matchMedia(PORTRAIT_QUERY).matches);
  useEffect(() => {
    const mq = window.matchMedia(PORTRAIT_QUERY);
    const update = () => setPortrait(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return portrait ? 56 : 45;
}

/**
 * The Digital Twin's 3D stage: the twin canvas (avatar and anatomy models in drei Views), its controls (deck
 * "desktop") and the reports. Mounted once by the deck shell, outside the scrolled content (Home today); the section
 * (src/app/twin/Twin.tsx) reveals it through #twin-three-wrapper.
 */
export default function TwinThreeWrapper() {
  const fov = useTwinFov();
  // The avatar and its HDR (about 6 MB) mount when the visitor comes within one section of the
  // twin (or lands on /digitaltwin), and are warmed into the cache one section earlier.
  const deferredReady = useDeferredAssets('twin');
  // The twin canvas renders as the original did on every device: pixel ratio up to 2, antialiased.
  const { tier, budget } = useGpuTier();
  const warm = useDeferredWarm('twin');
  useEffect(() => {
    if (!warm) return;
    preloadModel0Out();
    preloadEnvironmentGroup();
  }, [warm]);
  const modelRefs = [useRef<ModelRef>(null), useRef<ModelRef>(null)];
  const [currentModel, setCurrentModel] = useAtom(currentModelAtom);
  const setCurrentModelType = useSetAtom(currentModelTypeAtom);
  const setCurrentAnatomyCamera = useSetAtom(currentAnatomyCameraAtom);
  const controlRef1 = useRef<CameraControls>(null);
  const controlRef2 = useRef<CameraControls>(null);
  const isSyncingRef = useRef(false);
  const controlRefs = useMemo(() => [controlRef1, controlRef2], [controlRef1, controlRef2]);
  const [modelType, setModelType] = useState<ModelType>(ModelType.Skin);

  // 切换模型
  useEventBus(MessageType.SWITCH_MODEL, (payload: { type: ModelType; model: PredictionModel }) => {
    // 重制镜头
    let index = AnatomyCamera.CAMERA0;
    if (payload.type === ModelType.Skin) {
      const controls1 = controlRefs[0]?.current;
      const controls2 = controlRefs[1]?.current;
      controls1?.setLookAt(0, 0, 15, 0, 0, 0, true).then(() => {
        setCurrentModel(payload.model);
        setCurrentAnatomyCamera(index);
        eventBus.next({ type: MessageType.SWITCH_CAMERA, payload: { index } });
      });
      controls2?.setLookAt(0, 0, 15, 0, 0, 0, true);
    }
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
      pollComponentMethod(modelRefs[0], 'switchModelShow', [payload.type, index]).then(() => {
        eventBus.next({ type: MessageType.SWITCH_CAMERA, payload: { index } });
      });
      if (payload.model !== PredictionModel.M0) {
        pollComponentMethod(modelRefs[1], 'switchModelShow', [payload.type, index]).then();
      }
    }
    setCurrentModelType(payload.type);
    setModelType(payload.type);
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

  useEventBus(MessageType.RESET_ANIMATION, () => {});

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
      <SwitchModel deck="desktop" />
      <SwitchSkin deck="desktop" />
      <SwitchAnatomyCamera deck="desktop" />
      <ModelReport />
      <YTBDemo deck="desktop" />
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
        <GLBoundary canvas="twin">
          <Canvas
            id="model-canvas"
            frameloop="never"
            onCreated={onCanvasCreated('twin')}
            dpr={[1, budget.dprCap]}
            data-tier={tier}
            data-dpr={Math.min(budget.dprCap, typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1)}
            gl={{ alpha: true, antialias: true, powerPreference: budget.powerPreference }}
            style={{
              pointerEvents: 'none',
              position: 'absolute',
              top: '0px',
              height: '100vh',
            }}
          >
            <FrameDriver />
            <Suspense fallback={<Loader />}>
              <View.Port />
            </Suspense>
          </Canvas>
          {/* Avatar, anatomy models and the HDR load on approach (about 6 MB), never with the hero. */}
          {deferredReady && (
            <>
              {currentModel && (
                <View index={1} style={{ overflow: 'hidden', width: '100%', height: '100vh' }}>
                  <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={fov} near={0.1} far={10000} />
                  {modelType === ModelType.Skin && (
                    <ModelBoundary suspense={false} canvas="twin" model="Model0Out">
                      <Model0Out />
                    </ModelBoundary>
                  )}
                  {modelType === ModelType.Anatomy && (
                    <ModelBoundary suspense={false} canvas="twin" model="Model0In">
                      <Model0In ref={modelRefs[0]} />
                    </ModelBoundary>
                  )}
                  <ModelBoundary suspense={false} canvas="twin" model="environment">
                    <EnvironmentGroup />
                  </ModelBoundary>
                  <LightGroup ambientIntensity={1.6} />
                  <ExtendedCameraControls ref={controlRefs[0]} />
                  <DeferredSettled group="twin" />
                </View>
              )}
              {currentModel === PredictionModel.M1 && (
                <View index={2} style={{ overflow: 'hidden', width: '100%', height: '100vh' }}>
                  <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={fov} near={0.1} far={10000} />
                  {modelType === ModelType.Skin && (
                    <ModelBoundary suspense={false} canvas="twin" model="Model1Out">
                      <Model1Out />
                    </ModelBoundary>
                  )}
                  {modelType === ModelType.Anatomy && (
                    <ModelBoundary suspense={false} canvas="twin" model="Model1In">
                      <Model1In ref={modelRefs[1]} />
                    </ModelBoundary>
                  )}
                  <ModelBoundary suspense={false} canvas="twin" model="environment">
                    <EnvironmentGroup />
                  </ModelBoundary>
                  <LightGroup ambientIntensity={1.6} />
                  <ExtendedCameraControls ref={controlRefs[1]} />
                </View>
              )}
              {currentModel === PredictionModel.M2 && (
                <View index={2} style={{ overflow: 'hidden', width: '100%', height: '100vh' }}>
                  <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={fov} near={0.1} far={10000} />
                  {modelType === ModelType.Skin && (
                    <ModelBoundary suspense={false} canvas="twin" model="Model2Out">
                      <Model2Out />
                    </ModelBoundary>
                  )}
                  {modelType === ModelType.Anatomy && (
                    <ModelBoundary suspense={false} canvas="twin" model="Model2In">
                      <Model2In ref={modelRefs[1]} />
                    </ModelBoundary>
                  )}
                  <ModelBoundary suspense={false} canvas="twin" model="environment">
                    <EnvironmentGroup />
                  </ModelBoundary>
                  <LightGroup ambientIntensity={1.6} />
                  <ExtendedCameraControls ref={controlRefs[1]} />
                </View>
              )}
              {currentModel === PredictionModel.M3 && (
                <View index={2} style={{ overflow: 'hidden', width: '100%', height: '100vh' }}>
                  <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={fov} near={0.1} far={10000} />
                  {modelType === ModelType.Skin && (
                    <ModelBoundary suspense={false} canvas="twin" model="Model3Out">
                      <Model3Out />
                    </ModelBoundary>
                  )}
                  {modelType === ModelType.Anatomy && (
                    <ModelBoundary suspense={false} canvas="twin" model="Model3In">
                      <Model3In ref={modelRefs[1]} />
                    </ModelBoundary>
                  )}
                  <ModelBoundary suspense={false} canvas="twin" model="environment">
                    <EnvironmentGroup />
                  </ModelBoundary>
                  <LightGroup ambientIntensity={1.6} />
                  <ExtendedCameraControls ref={controlRefs[1]} />
                </View>
              )}
            </>
          )}
        </GLBoundary>
      </div>
    </div>
  );
}
