import { Suspense } from 'react';
import Geo from '@/components/model/Geo';
import { Canvas } from '@react-three/fiber';
import { NAV_LIST } from '@/components/nav/nav';
import Effects from '@/components/model/Effect';
import { OrbitControls } from '@react-three/drei';

export default function Intervention() {
  return (
    <div id={NAV_LIST[5].id} className="page-height mt-[16.625rem] flex flex-col p-12 mobile:mt-56 mobile:p-0">
      <h2 className="page-title">Regional Intervention Center</h2>
      <div className="mt-9 flex gap-7 mobile:mt-6 mobile:grid mobile:grid-cols-2 mobile:gap-3">
        <div className="processes-clip px-3.5 py-2 text-xl/5 font-medium capitalize text-white mobile:text-[.625rem]/3">
          &nbsp;Novel interventions
        </div>
        <div className="processes-clip px-3.5 py-2 text-xl/5 font-medium capitalize text-white mobile:text-[.625rem]/3">
          &nbsp;Minicircle follistatin gene therapy
        </div>
        <div className="processes-clip px-3.5 py-2 text-xl/5 font-medium capitalize text-white mobile:text-[.625rem]/3">
          &nbsp;Licensed and accredited
        </div>
        <div className="processes-clip px-3.5 py-2 text-xl/5 font-medium capitalize text-white mobile:text-[.625rem]/3">
          &nbsp;Clinic and medical staff
        </div>
      </div>
      <div className="flex-1"></div>
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
        <OrbitControls autoRotate enableDamping enableZoom={false} target={[0, 0, 0]} />
      </Canvas>
    </div>
  );
}
