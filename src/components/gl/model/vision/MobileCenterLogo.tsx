import { Center } from '@react-three/drei';
import MergedSvg from './MergedSvg';

/**
 * The phone wordmark and tagline, one mesh per fill colour each (MergedSvg). English only: the Chinese lockups were
 * drawn at opacity 0 (CON-12 retired the tap-to-switch) and still cost their draw calls; a /zh locale would swap the
 * src here instead.
 */
export default function MobileCenterLogo() {
  return (
    <group>
      <Center scale={0.7} position={[0, 0, -5]}>
        <MergedSvg scale={0.06} src="/svgs/logo-en.svg" />
      </Center>
      <Center position={[0, -2.6, 0]}>
        <MergedSvg scale={0.01} src="/svgs/main-description.svg" />
      </Center>
    </group>
  );
}
