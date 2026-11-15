import { Center, useGLTF } from '@react-three/drei';
import { useAvatarLoop } from './useAvatarLoop';

export default function Model1Out() {
  const { scene, animations } = useGLTF('https://resources.id.life/twin/m1-v2.glb');
  // Idle and PullingLever in turn; a deliberate rest pose with reduced motion (useAvatarLoop).
  useAvatarLoop(animations, scene);

  return (
    <Center scale={5.5}>
      <primitive visible={true} object={scene} />
    </Center>
  );
}
