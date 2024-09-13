import { Suspense, useRef } from 'react';
import Geo from '@/components/model/Geo';
import { Canvas } from '@react-three/fiber';
import { NAV_LIST } from '@/components/nav/nav';
import Effects from '@/components/model/Effect';
import { OrbitControls } from '@react-three/drei';

export default function Intervention() {
  const controls = useRef<any>();

  return (
    <div id={NAV_LIST[4].id} className="page-height mt-37 px-12">
      <h2 className="page-title">Intervention Center</h2>
      <p className="font-migrena text-2xl/12 font-bold uppercase">Thailand</p>
      <div className="mt-8 flex gap-7">
        <div className="processes-clip px-3.5 py-2 text-xl/5 font-semibold capitalize text-white">
          &nbsp;Novel interventions
        </div>
        <div className="processes-clip px-3.5 py-2 text-xl/5 font-semibold capitalize text-white">
          &nbsp;minicircle follistatin gene therapy
        </div>
        <div className="processes-clip px-3.5 py-2 text-xl/5 font-semibold capitalize text-white">
          &nbsp;Novel interventions
        </div>
        <div className="processes-clip px-3.5 py-2 text-xl/5 font-semibold capitalize text-white">
          &nbsp;Novel interventions
        </div>
      </div>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 10], far: 1000 }}
        gl={{ powerPreference: 'high-performance', depth: false }}
      >
        <pointLight position={[-10, -10, -10]} intensity={1} />
        <ambientLight intensity={0.4} />
        <spotLight
          castShadow
          angle={0.3}
          penumbra={1}
          position={[0, 10, 20]}
          intensity={5}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <spotLight
          castShadow
          angle={0.3}
          penumbra={1}
          position={[0, 10, 20]}
          intensity={5}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <Suspense fallback={null}>
          <Geo />
        </Suspense>
        <Effects />
        <OrbitControls
          autoRotate
          ref={controls}
          enableZoom={false}
          target={[0, -1, 0]}
          autoRotateSpeed={-0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
