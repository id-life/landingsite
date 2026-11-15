import { useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import CenterLogo from './model/vision/CenterLogo';
import DragonModel from './model/vision/DragonModel';
import gsap from 'gsap';
import { NAV_LIST } from '@/components/nav/nav';
import * as THREE from 'three';
import { useGSAP } from '@gsap/react';
import { useLogoTextures } from '@/hooks/useLogoTextures';
import { fitHeroScale, LOGO_PLANE_HEIGHT } from './model/vision/heroFit';

export default function VisionGL() {
  const size = useThree((state) => state.size);
  const { logoEnAspectRatio } = useLogoTextures();
  const modelRef = useRef<THREE.Group>(null);

  // The wordmark (and the dragon with it) fits the frustum with a clear margin on every screen.
  const scale = useMemo(
    () => fitHeroScale(size.width / size.height, LOGO_PLANE_HEIGHT * logoEnAspectRatio, LOGO_PLANE_HEIGHT),
    [size.width, size.height, logoEnAspectRatio],
  );

  useGSAP(() => {
    // in connect page, hide dragon model
    gsap.timeline({
      scrollTrigger: {
        trigger: `#${NAV_LIST[6].id}`,
        scrub: true,
        onEnter: () => {
          if (!modelRef.current) return;
          gsap.set(modelRef.current, { visible: false });
        },
        onLeaveBack: () => {
          if (!modelRef.current) return;
          gsap.set(modelRef.current, { visible: true });
        },
      },
    });
  }, []);

  return (
    <group ref={modelRef} scale={scale}>
      <CenterLogo />
      <DragonModel />
    </group>
  );
}
