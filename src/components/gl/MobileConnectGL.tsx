import { mobileCurrentPageAtom } from '@/atoms';
import { CONNECT_GL_CONFIG } from '@/components/gl/config/ConnectGLConfig';
import AnimalModel from '@/components/gl/model/connect/AnimalModel';
import { NAV_LIST } from '@/components/nav/nav';

import { isMobileFooterContactShowAtom } from '@/atoms/footer';
import { CONNECT_PAGE_INDEX } from '@/constants/config';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { useAtom, useSetAtom } from 'jotai';
import { memo, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const centerPoint = new THREE.Vector3(0, -10, 0);

// Updated selector for new single-page mobile layout
const CONNECT_FIXED_ELEMENTS = '#mobile-connect-content, .page-connect-item, #connect-end-1, #connect-end-2';

function MobileConnectGL() {
  const { camera } = useThree();
  const [currentPage] = useAtom(mobileCurrentPageAtom);
  const modelRef = useRef<THREE.Group>(null);
  const page1Config = useMemo(() => CONNECT_GL_CONFIG[0], []);
  const startAnimTLRef = useRef<gsap.core.Timeline | null>(null);
  const setIsSubscribeShow = useSetAtom(isMobileFooterContactShowAtom);
  // The headlines stay in English. Their red words used to turn into Chinese letter by letter 1 s
  // after Connect appeared (playMobileEnToCnAnim), so each line read half in one language (CON-12).

  // Setup entry animation timeline
  useEffect(() => {
    if (startAnimTLRef.current || !modelRef.current) return;
    const tl = gsap.timeline({ paused: true });

    // Canvas and camera animation
    tl.set('#vision-canvas', { zIndex: 1, opacity: 1 }, 0);
    tl.to(camera.position, { ...page1Config.to.camera.position, duration: 0.8 }, 0);
    tl.to(
      camera.rotation,
      {
        ...page1Config.to.camera.rotation,
        duration: 0.8,
        onComplete: () => {
          camera.lookAt(centerPoint);
        },
      },
      '<',
    );

    // Model animation (delayed to avoid jank)
    tl.fromTo(
      modelRef.current.position,
      { ...page1Config.from.model.position },
      {
        ...page1Config.to.model.position,
        duration: 0.8,
        ease: 'power3.out',
      },
      0.5,
    );
    tl.fromTo(
      modelRef.current.rotation,
      { ...page1Config.from.model.rotation },
      {
        ...page1Config.to.model.rotation,
        duration: 0.8,
        ease: 'power3.out',
      },
      '<',
    );

    // Fade in content
    tl.to('#mobile-connect-content', { opacity: 1, duration: 0.5 }, 0.2);

    startAnimTLRef.current = tl;
    return () => {
      if (startAnimTLRef.current) startAnimTLRef.current.kill();
    };
  }, [camera, page1Config]);

  // Handle page entry/exit
  useEffect(() => {
    if (currentPage.id === NAV_LIST[CONNECT_PAGE_INDEX].id) {
      // 立即显示底栏，不等动画完成
      setIsSubscribeShow(true);

      // Show canvas immediately
      gsap.set('#vision-canvas', { opacity: 1 });
      // Restore FixedConnect elements visibility
      gsap.set(CONNECT_FIXED_ELEMENTS, { visibility: 'visible' });

      // English visible, Chinese hidden
      gsap.set('#mobile-connect-content .connect-text-en.text-red-500', { opacity: 1 });
      gsap.set('#mobile-connect-content .connect-text-cn', { opacity: 0 });

      // Reset and play entry animation
      startAnimTLRef.current?.restart();
    } else {
      // Reset scroll position when leaving Connect page
      gsap.to(window, { scrollTo: 0 });
      // Hide FixedConnect elements immediately
      gsap.set(CONNECT_FIXED_ELEMENTS, { visibility: 'hidden', opacity: 0 });
      // Hide footer
      setIsSubscribeShow(false);
      // Reverse entry animation
      startAnimTLRef.current?.reverse();
    }
  }, [currentPage, setIsSubscribeShow]);

  return (
    <group>
      <AnimalModel ref={modelRef} />
    </group>
  );
}

export default memo(MobileConnectGL);
