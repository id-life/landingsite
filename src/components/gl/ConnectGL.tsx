'use client';

import { currentPageAtom, mobileCurrentPageAtom } from '@/atoms';
import AnimalModel from '@/components/gl/model/connect/AnimalModel';
import { NAV_LIST } from '@/components/nav/nav';
import { isLayoutRefreshing } from '@/motion/sectionController';
import { useConnectCrossAnimations } from '@/hooks/connectGL/useConnectCrossAnimations';
import { useGSAP } from '@gsap/react';
import { Center, Svg } from '@react-three/drei';
import gsap from 'gsap';
import { useSetAtom, useAtom } from 'jotai';
import { memo, RefObject, useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { CONNECT_GL_CONFIG } from '@/components/gl/config/ConnectGLConfig';
import { isMobileFooterContactShowAtom } from '@/atoms/footer';
import { CONNECT_PAGE_INDEX } from '@/constants/config';
import { useThree } from '@react-three/fiber';
import { DURATION, EASE } from '@/motion/tokens';

type TitleProps = {
  titleRef: RefObject<THREE.Group | null>;
  position: THREE.Vector3;
  rotation?: THREE.Euler;
  scale: number;
  titleName: string;
};
const TitleSVG = memo(({ titleRef, position, rotation, scale, titleName }: TitleProps) => (
  <Center ref={titleRef} position={position} rotation={rotation}>
    <Svg scale={scale} name={`${titleName}-svg`} src={`/svgs/value/${titleName}.svg`} />
    <Svg scale={scale} name={`${titleName}-cn-svg`} src={`/svgs/value/${titleName}-cn.svg`} />
  </Center>
));

TitleSVG.displayName = 'TitleSVG';

function ConnectGLImpl() {
  const setCurrentPage = useSetAtom(currentPageAtom);
  const modelRef = useRef<THREE.Group>(null);
  // The camera the timeline flies to the jellyfish. It must be the one the canvas renders with: on the first render
  // this is still React Three Fiber's built-in camera, until <PerspectiveCamera makeDefault> takes over. Since the
  // jellyfish loads on approach in its own boundary (wave 0), nothing here suspends any more, so the timeline was
  // built in that first commit around the built-in camera and moved a camera nobody renders with: the jellyfish sat
  // below the screen. The timeline is rebuilt whenever the camera changes.
  const camera = useThree((state) => state.camera);

  // The headlines stay in English: they used to turn into Chinese word by word 1 s after Connect
  // appeared (playEnToCnAnim), so a reader lost the sentence being read (CON-12).
  const { createPage1CrossAnim, playFooterEnterAnim, playFooterLeaveAnim } = useConnectCrossAnimations({
    modelRef,
  });

  useGSAP(
    () => {
      const tl1 = gsap.timeline({
        scrollTrigger: {
          id: 'connect-page1-scroll-trigger',
          trigger: `#connect-page1`,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: true,
          onEnter: () => {
            if (isLayoutRefreshing()) return;
            setCurrentPage(NAV_LIST[6]);
            // 立即显示底栏. (It also used to pause the smoother and auto-scroll for 3 s to the end of this
            // trigger; the section controller now lands on the timeline's 'rest' label, MOT-01.)
            playFooterEnterAnim();
          },
          onEnterBack: () => {
            if (isLayoutRefreshing()) return;
            playFooterLeaveAnim();
          },
          onLeave: () => {
            if (isLayoutRefreshing()) return;
            // 立即显示底栏
            playFooterEnterAnim();
          },
          onLeaveBack: () => {
            if (isLayoutRefreshing()) return;
            playFooterLeaveAnim();
          },
        },
      });
      createPage1CrossAnim(tl1);
    },
    { dependencies: [camera], revertOnUpdate: true },
  );

  return (
    <group position={[0, -10, 0]}>
      <AnimalModel ref={modelRef} />
    </group>
  );
}

const DesktopConnectGL = memo(ConnectGLImpl);

const centerPoint = new THREE.Vector3(0, -10, 0);

// The single-page phone layout (the criteria and values are in flow inside it).
const CONNECT_FIXED_ELEMENTS = '#mobile-connect-content';

function MobileConnectGL() {
  const { camera } = useThree();
  const [currentPage] = useAtom(mobileCurrentPageAtom);
  const modelRef = useRef<THREE.Group>(null);
  const page1Config = useMemo(() => CONNECT_GL_CONFIG[0], []);
  const startAnimTLRef = useRef<gsap.core.Timeline | null>(null);
  const setIsSubscribeShow = useSetAtom(isMobileFooterContactShowAtom);
  const onConnectRef = useRef(false);
  // Declared before the timeline effect, so it is current when that effect runs.
  useEffect(() => {
    onConnectRef.current = currentPage.id === NAV_LIST[CONNECT_PAGE_INDEX].id;
  }, [currentPage]);
  // The headlines stay in English. Their red words used to turn into Chinese letter by letter 1 s
  // after Connect appeared (playMobileEnToCnAnim), so each line read half in one language (CON-12).

  // Setup entry animation timeline
  useEffect(() => {
    if (startAnimTLRef.current || !modelRef.current) return;
    const tl = gsap.timeline({ paused: true });

    // Canvas and camera animation
    tl.set('#vision-canvas', { zIndex: 1, opacity: 1 }, 0);
    tl.to(camera.position, { ...page1Config.to.camera.position, duration: DURATION.section }, 0);
    tl.to(
      camera.rotation,
      {
        ...page1Config.to.camera.rotation,
        duration: DURATION.section,
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
        duration: DURATION.section,
        ease: EASE.out,
      },
      0.5,
    );
    tl.fromTo(
      modelRef.current.rotation,
      { ...page1Config.from.model.rotation },
      {
        ...page1Config.to.model.rotation,
        duration: DURATION.section,
        ease: EASE.out,
      },
      '<',
    );

    // Fade in content
    tl.to('#mobile-connect-content', { opacity: 1, duration: DURATION.moderate }, 0.2);

    startAnimTLRef.current = tl;
    // A rebuild while Connect is showing (a deep link lands there before the camera is final) plays at once.
    if (onConnectRef.current) tl.restart();
    // Rebuilt when the camera changes (see ConnectGLImpl): the first one is React Three Fiber's built-in camera.
    return () => {
      tl.kill();
      startAnimTLRef.current = null;
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
      gsap.set('#mobile-connect-content .connect-text-en.text-accent', { opacity: 1 });
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

const PhoneConnectGL = memo(MobileConnectGL);

/**
 * Connect's 3D scene (the jellyfish), one component for both decks (RWD-02; it was ConnectGL and MobileConnectGL). By
 * deck: the desktop deck follows ScrollTrigger and runs the footer animations; the phone deck runs a camera timeline
 * per page.
 */
export default function ConnectGL({ deck }: { deck: 'desktop' | 'phone' }) {
  return deck === 'phone' ? <PhoneConnectGL /> : <DesktopConnectGL />;
}
