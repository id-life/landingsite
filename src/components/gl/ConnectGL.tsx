'use client';

import { currentPageAtom, mobileCurrentPageAtom } from '@/atoms';
import { PHONE } from '@/motion/original';
import AnimalModel from '@/components/gl/model/connect/AnimalModel';
import { NAV_LIST } from '@/components/nav/nav';
import { isLayoutRefreshing } from '@/motion/sectionController';
import { useConnectCrossAnimations } from '@/hooks/connectGL/useConnectCrossAnimations';
import { useGSAP } from '@gsap/react';
import { Center, Svg } from '@react-three/drei';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useSetAtom, useAtom } from 'jotai';
import { memo, RefObject, useCallback, useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { CONNECT_GL_CONFIG } from '@/components/gl/config/ConnectGLConfig';
import { isMobileFooterContactShowAtom } from '@/atoms/footer';
import { CONNECT_PAGE_INDEX } from '@/constants/config';
import { useThree } from '@react-three/fiber';
import { DURATION } from '@/motion/tokens';
import { isReducedMotion } from '@/motion/preference';

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

  // 1 s after Connect appears its red English words turn into Chinese, as on the original (the owner's answer 1A,
  // reversing CON-12); not with the reduced-motion preference, where nothing changes language by itself. Leaving
  // Connect cancels a pending turn.
  const { createPage1CrossAnim, playFooterEnterAnim, playFooterLeaveAnim, playEnToCnAnim } = useConnectCrossAnimations({
    modelRef,
  });
  const [currentPage] = useAtom(currentPageAtom);
  const currentPageRef = useRef(currentPage);
  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);
  const turnRef = useRef<gsap.core.Tween | null>(null);
  const cancelTurn = () => {
    turnRef.current?.kill();
    turnRef.current = null;
  };
  const scheduleTurn = () => {
    cancelTurn();
    if (isReducedMotion()) return;
    turnRef.current = gsap.delayedCall(1, () => {
      turnRef.current = null;
      if (currentPageRef.current?.id === 'connect_page') playEnToCnAnim();
    });
  };

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
            scheduleTurn();
          },
          onEnterBack: () => {
            if (isLayoutRefreshing()) return;
            cancelTurn();
            playFooterLeaveAnim();
          },
          onLeave: () => {
            if (isLayoutRefreshing()) return;
            // 立即显示底栏
            playFooterEnterAnim();
            scheduleTurn();
          },
          onLeaveBack: () => {
            if (isLayoutRefreshing()) return;
            cancelTurn();
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

gsap.registerPlugin(SplitText);

/** The original's phone turn into Chinese: each letter fades in 0.05 s, 0.05 s after the one before. */
const TURN_FADE = 0.05;
const TURN_STAGGER = 0.05;

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
  // The red words turn into Chinese letter by letter 1 s after Connect's entry has run, as on the original (the
  // owner's answer 1A, reversing CON-12): the English letters go out 0.05 s apart, then the Chinese come in. Not with
  // the reduced-motion preference. Each entry starts again from English.
  const splitsRef = useRef<SplitText[]>([]);
  const turnRef = useRef<gsap.core.Tween | null>(null);
  const resetTurn = useCallback(() => {
    turnRef.current?.kill();
    turnRef.current = null;
    splitsRef.current.forEach((split) => split.revert());
    splitsRef.current = [];
  }, []);
  const playTurn = useCallback(() => {
    resetTurn();
    gsap.set('#mobile-connect-content .connect-text-cn', { opacity: 1 });
    // Screen readers read each red word once, in the language drawn (CON-12 with 1A): the Chinese spans are
    // aria-hidden in the markup until the turn; at the turn the English goes hidden and the Chinese is read. The
    // splitter itself adds no accessible text (aria: 'none'; its default puts an aria-label on each span, which ARIA
    // prohibits on a span), and its letters are spans, read as the word they spell. A revert restores the markup's
    // state (English read, Chinese hidden), which is what each entry starts from.
    const en = new SplitText('#mobile-connect-content .connect-text-en.text-accent', {
      type: 'chars',
      aria: 'none',
      tag: 'span',
    });
    const cn = new SplitText('#mobile-connect-content .connect-text-cn', { type: 'chars', aria: 'none', tag: 'span' });
    splitsRef.current.push(en, cn);
    en.elements.forEach((el) => el.setAttribute('aria-hidden', 'true'));
    cn.elements.forEach((el) => el.removeAttribute('aria-hidden'));
    gsap.set(cn.chars, { opacity: 0 });
    const enTotal = en.chars.length * TURN_STAGGER + TURN_FADE;
    en.chars.forEach((char, i) =>
      gsap.to(char, { opacity: 0, duration: TURN_FADE, delay: i * TURN_STAGGER, ease: PHONE.connectTurnEase }),
    );
    cn.chars.forEach((char, i) =>
      gsap.to(char, { opacity: 1, duration: TURN_FADE, delay: enTotal + i * TURN_STAGGER, ease: PHONE.connectTurnEase }),
    );
  }, [resetTurn]);

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
        duration: PHONE.connectModel.duration,
        ease: PHONE.connectModel.ease,
      },
      0.5,
    );
    tl.fromTo(
      modelRef.current.rotation,
      { ...page1Config.from.model.rotation },
      {
        ...page1Config.to.model.rotation,
        duration: PHONE.connectModel.duration,
        ease: PHONE.connectModel.ease,
      },
      '<',
    );

    // Fade in content
    tl.to('#mobile-connect-content', { opacity: 1, duration: PHONE.connectContent.duration }, 0.2);

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
      resetTurn();
      gsap.set('#mobile-connect-content .connect-text-en.text-accent', { opacity: 1 });
      gsap.set('#mobile-connect-content .connect-text-cn', { opacity: 0 });

      // Reset and play entry animation, then the turn into Chinese 1 s after it.
      const tl = startAnimTLRef.current;
      tl?.restart();
      tl?.eventCallback('onComplete', () => {
        if (isReducedMotion()) return;
        turnRef.current = gsap.delayedCall(1, () => {
          turnRef.current = null;
          if (onConnectRef.current) playTurn();
        });
      });
    } else {
      resetTurn();
      // Reset scroll position when leaving Connect page
      gsap.to(window, { scrollTo: 0 });
      // Hide FixedConnect elements immediately
      gsap.set(CONNECT_FIXED_ELEMENTS, { visibility: 'hidden', opacity: 0 });
      // Hide footer
      setIsSubscribeShow(false);
      // Reverse entry animation. The canvas's opacity set on entry is cleared once it has run back: the class hides
      // the canvas off Mission and Connect, and an inline opacity left from Connect is a state a fresh load of the
      // section never has (the stylesheet's, so the next section that shows the canvas starts from its own).
      const tl = startAnimTLRef.current;
      if (tl) {
        tl.eventCallback('onReverseComplete', () => gsap.set('#vision-canvas', { clearProps: 'opacity' }));
        tl.reverse();
      } else gsap.set('#vision-canvas', { clearProps: 'opacity' });
    }
  }, [currentPage, setIsSubscribeShow, playTurn, resetTurn]);

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
