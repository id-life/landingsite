import { mobileCurrentPageAtom } from '@/atoms';
import { CONNECT_GL_CONFIG } from '@/components/gl/config/ConnectGLConfig';
import AnimalModel from '@/components/gl/model/connect/AnimalModel';
import { NAV_LIST } from '@/components/nav/nav';

import { isMobileFooterContactShowAtom } from '@/atoms/footer';
import { CONNECT_PAGE_INDEX } from '@/constants/config';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useAtom, useSetAtom } from 'jotai';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
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
  const hasPlayedEnToCnRef = useRef(false);

  // Store SplitText instances for cleanup
  const splitTextRef = useRef<SplitText[]>([]);

  // EN→CN transition animation - character by character like PC version
  const playMobileEnToCnAnim = useCallback(() => {
    // Clean up previous SplitText instances
    splitTextRef.current.forEach((split) => split.revert());
    splitTextRef.current = [];

    // Get CN parent elements and set them visible (they have opacity-0 class)
    const cnParents = gsap.utils.toArray<HTMLElement>('#mobile-connect-content .connect-text-cn');
    gsap.set(cnParents, { opacity: 1 });

    // Split EN red text into characters
    const enSplit = new SplitText('#mobile-connect-content .connect-text-en.text-red-500', {
      type: 'chars',
    });
    // Split CN text into characters
    const cnSplit = new SplitText('#mobile-connect-content .connect-text-cn', {
      type: 'chars',
    });
    splitTextRef.current.push(enSplit, cnSplit);

    const enChars = enSplit.chars;
    const cnChars = cnSplit.chars;

    // Set initial state for CN chars (parent is now visible, but chars start hidden)
    gsap.set(cnChars, { opacity: 0 });

    const staggerTime = 0.05; // Time between each character
    const duration = 0.05; // Duration for each character fade
    const enTotalTime = enChars.length * staggerTime + duration;

    // Fade out EN red text character by character
    enChars.forEach((char, index) => {
      gsap.to(char, { opacity: 0, duration, delay: index * staggerTime, ease: 'power2.out' });
    });

    // Fade in CN text character by character (after EN animation)
    cnChars.forEach((char, index) => {
      gsap.to(char, { opacity: 1, duration, delay: enTotalTime + index * staggerTime, ease: 'power2.out' });
    });

    // After text animation completes, show footer with slide-up
    const cnTotalTime = cnChars.length * staggerTime + duration;
    gsap.delayedCall(enTotalTime + cnTotalTime + 0.3, () => {
      setIsSubscribeShow(true);
    });
  }, [setIsSubscribeShow]);

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
      // Show canvas immediately
      gsap.set('#vision-canvas', { opacity: 1 });
      // Restore FixedConnect elements visibility
      gsap.set(CONNECT_FIXED_ELEMENTS, { visibility: 'visible' });

      // Clean up previous SplitText instances and reset text
      splitTextRef.current.forEach((split) => split.revert());
      splitTextRef.current = [];

      // Reset text opacity to initial state (EN visible, CN hidden) for fresh animation
      gsap.set('#mobile-connect-content .connect-text-en.text-red-500', { opacity: 1 });
      gsap.set('#mobile-connect-content .connect-text-cn', { opacity: 0 });

      // Reset and play entry animation
      hasPlayedEnToCnRef.current = false;
      startAnimTLRef.current?.restart();

      // After entry animation completes, play EN→CN transition
      startAnimTLRef.current?.eventCallback('onComplete', () => {
        if (!hasPlayedEnToCnRef.current) {
          hasPlayedEnToCnRef.current = true;
          // 延迟1秒播放EN→CN动画
          gsap.delayedCall(1, () => {
            playMobileEnToCnAnim();
          });
        }
      });
    } else {
      // Clean up SplitText instances
      splitTextRef.current.forEach((split) => split.revert());
      splitTextRef.current = [];

      // Reset scroll position when leaving Connect page
      gsap.to(window, { scrollTo: 0 });
      // Hide FixedConnect elements immediately
      gsap.set(CONNECT_FIXED_ELEMENTS, { visibility: 'hidden', opacity: 0 });
      // Hide footer
      setIsSubscribeShow(false);
      // Reset EN→CN animation flag
      hasPlayedEnToCnRef.current = false;
      // Reverse entry animation
      startAnimTLRef.current?.reverse();
    }
  }, [currentPage, playMobileEnToCnAnim, setIsSubscribeShow]);

  return (
    <group>
      <AnimalModel ref={modelRef} />
    </group>
  );
}

export default memo(MobileConnectGL);
