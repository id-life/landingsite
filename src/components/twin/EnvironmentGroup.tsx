import { Environment } from '@react-three/drei';
import { RGBELoader } from 'three-stdlib';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

function EnvironmentGroup() {
  const texture = useLoader(RGBELoader, 'https://cdn.id.life/env/neutral.hdr');
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