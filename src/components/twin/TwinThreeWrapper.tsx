import { Canvas } from '@react-three/fiber';
import { Suspense, useMemo, useRef } from 'react';
import { CameraControls, PerspectiveCamera, View } from '@react-three/drei';
import Model0 from '@/components/twin/model/Model0';
import EnvironmentGroup from '@/components/twin/EnvironmentGroup';
import ExtendedCameraControls from '@/components/twin/ExtendedCameraControls';
import Model1 from '@/components/twin/model/Model1';
import Loader from '@/components/gl/Loader';
import LightGroup from '@/components/twin/LightGroup';

export default function TwinThreeWrapper() {
  const modelRefs = [useRef<{}>(null), useRef<{}>(null)];
  const controlRef1 = useRef<CameraControls>(null);
  const controlRef2 = useRef<CameraControls>(null);
  const controlRefs = useMemo(() => [controlRef1, controlRef2], [controlRef1, controlRef2]);

  return (
    <div className="fixed left-0 top-0 z-10 grid h-screen w-screen grid-cols-1">
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
      <View index={1} style={{ overflow: 'hidden', width: '100%', height: '100vh' }}>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} near={0.1} far={10000} />
        <Model0 ref={modelRefs[0]} />
        <EnvironmentGroup />
        <LightGroup ambientIntensity={1.6} />
        <ExtendedCameraControls ref={controlRefs[0]} />
      </View>
      {/*<View index={2} style={{ overflow: 'hidden', width: '100%', height: '100vh' }}>*/}
      {/*  <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} near={0.1} far={10000} />*/}
      {/*  <Model1 ref={modelRefs[1]} />*/}
      {/*  <EnvironmentGroup />*/}
      {/*  <LightGroup ambientIntensity={1.6} />*/}
      {/*  <ExtendedCameraControls ref={controlRefs[1]} />*/}
      {/*</View>*/}
    </div>
  );
}
