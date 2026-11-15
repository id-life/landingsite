import { Environment } from '@react-three/drei';
import { RGBELoader } from 'three-stdlib';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import MODELS from '@/components/gl/models-manifest.json';

// PERF-14: the 1024x512 HDR from resources.id.life (772 kB), resampled to 256x128 and served with the models (131 kB);
// it is only seen as a blurred environment at 45 % opacity. scripts/optimize-models.mjs writes it.
const HDR_URL = MODELS.environment;

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
