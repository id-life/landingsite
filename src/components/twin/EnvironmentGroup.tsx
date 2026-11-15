import { Environment } from '@react-three/drei';
import { RGBELoader } from 'three-stdlib';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const HDR_URL = 'https://resources.id.life/env/neutral.hdr';

/** Fetch the HDR into the loader cache before EnvironmentGroup mounts (see useDeferredWarm). */
export const preloadEnvironmentGroup = () => useLoader.preload(RGBELoader, HDR_URL);

function EnvironmentGroup() {
  const texture = useLoader(RGBELoader, HDR_URL);
  return (
    <Environment>
      <mesh scale={100} rotation={[0, 1.56, 0]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial transparent opacity={0.45} map={texture} side={THREE.BackSide} toneMapped={false} />
      </mesh>
    </Environment>
  );
}

EnvironmentGroup.displayName = 'EnvironmentGroup';

export default EnvironmentGroup;
