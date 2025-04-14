import { currentPageAtom, currentPageIndexAtom, innerPageIndexAtom, innerPageNavigateToAtom } from '@/atoms';
import { VALUE_GL_CONFIG } from '@/components/gl/config/valueGLConfig';
import AnimalModel from '@/components/gl/model/value/AnimalModel';
import { NAV_LIST } from '@/components/nav/nav';

import { useValueCrossAnimations } from '@/hooks/valueGL/useValueCrossAnimations';
import { useGSAP } from '@gsap/react';
import { Center, Svg } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { SplitText } from 'gsap/SplitText';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const centerPoint = new THREE.Vector3(0, -10, 0);
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText, DrawSVGPlugin);

export const VALUE_PROGRESS_CONFIG = {
  desktop: {
    0: 0,
    1: 0.69,
    2: 1, // 出邮箱
  },
} as const;

type TitleProps = {
  titleRef: React.RefObject<THREE.Group>;
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

function ValueGL() {
  const { camera } = useThree();
  const setCurrentPage = useSetAtom(currentPageAtom);
  const modelRef = useRef<THREE.Group>(null);
  const page1Config = useMemo(() => VALUE_GL_CONFIG[0], []);
  const setInnerPageIndex = useSetAtom(innerPageIndexAtom);
  const [innerPageNavigateTo, setInnerPageNavigateTo] = useAtom(innerPageNavigateToAtom);
  const progressMap = useMemo(() => VALUE_PROGRESS_CONFIG.desktop, []);

  const currentPageIndex = useAtomValue(currentPageIndexAtom);
  const isScrollingRef = useRef(false);
  const enableScroll = useCallback(() => {
    document.body.style.overflow = '';
  }, []);

  const { createPage1CrossAnim, createPage2CrossAnim } = useValueCrossAnimations({
    modelRef,
    isScrollingRef,
  });

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          immediateRender: false,
          trigger: `#${NAV_LIST[4].id}`,
          start: 'top bottom',
          end: 'center bottom',
          scrub: true,
          onEnter: () => {
            setCurrentPage(NAV_LIST[4]);
          },
          onEnterBack: () => {
            setCurrentPage(NAV_LIST[4]);
          },
        },
      });
      tl.to('.fixed-top', { opacity: 1, top: '9.25rem' });
      tl.to('.fixed-bottom', { opacity: 1, bottom: '9.25rem', top: 'auto' }, '<');
      tl.to(camera.position, { ...page1Config.to.camera.position });
      tl.to('#fixed-value', { opacity: 1 }, '<');
      tl.to('#vision-canvas', { zIndex: 1, opacity: 1 });
      if (!modelRef.current) return;
      tl.fromTo(
        modelRef.current.position,
        { ...page1Config.from.model.position },
        {
          ...page1Config.to.model.position,
          ease: 'power3.inOut',
          duration: 10,
        },
      );
      tl.fromTo(
        modelRef.current.rotation,
        { ...page1Config.from.model.rotation },
        {
          ...page1Config.to.model.rotation,
          ease: 'power3.inOut',
          duration: 8,
        },
        '<',
      );
      tl.to(
        camera.rotation,
        {
          ...page1Config.to.camera.rotation,
          duration: 8,
          onUpdate: () => {
            camera.lookAt(centerPoint);
          },
          onComplete: () => {
            camera.lookAt(centerPoint);
          },
        },
        '<',
      );
      tl.fromTo(
        '#fixed-value-page-1',
        {
          rotationX: -45,
          rotationY: 30,
          z: 500,
          opacity: 0,
        },
        {
          rotationX: 0,
          rotationY: 0,
          z: 0,
          opacity: 1,
          ease: 'power3.inOut',
          transformOrigin: '50% 50%',
          duration: 8,
          delay: 5,
        },
        '<',
      );
      const title6 = gsap.utils.toArray('.value-title6 path');
      const title7 = gsap.utils.toArray('.value-title7 path');
      title6.forEach((item) => {
        if (!item) return;
        tl.fromTo(
          item,
          {
            stroke: 'black',
            fill: 'none',
            drawSVG: 0,
          },
          {
            drawSVG: true,
            duration: 0.1,
            delay: 0.3,
            ease: 'power3.inOut',
          },
          '<',
        );
        tl.to(
          item,
          {
            fill: 'black',
            duration: 0.1,
            delay: 0.3,
          },
          '<',
        );
      });
      title7.forEach((item) => {
        if (!item) return;
        tl.fromTo(
          item,
          {
            stroke: 'black',
            fill: 'none',
            drawSVG: 0,
          },
          {
            drawSVG: true,
            duration: 0.1,
            delay: 0.3,
            ease: 'power3.inOut',
          },
          '<',
        );
        tl.to(
          item,
          {
            fill: 'black',
            duration: 0.1,
            delay: 0.3,
          },
          '<',
        );
      });
    },
    { dependencies: [] },
  );

  // Value 页动画
  useGSAP(() => {
    if (!modelRef.current) return;
    const tl = gsap.timeline({
      scrollTrigger: {
        id: 'valueTimeline',
        trigger: `#${NAV_LIST[4].id}`,
        start: 'center bottom',
        end: 'bottom bottom',
        scrub: true,
        immediateRender: false,
      },
    });
    createPage1CrossAnim(tl);
    createPage2CrossAnim(tl);
  }, []);

  useEffect(() => {
    if (currentPageIndex !== 4 || innerPageNavigateTo === null) return;
    const progress = progressMap[innerPageNavigateTo as keyof typeof progressMap];
    if (progress !== undefined) {
      if (innerPageNavigateTo === 2) {
        const st = ScrollTrigger.getById('footerTimeline');
        if (st) {
          isScrollingRef.current = true;
          gsap.to(window, {
            duration: 0.5,
            scrollTo: st.end,
            onComplete: () => {
              isScrollingRef.current = false;
              enableScroll();
            },
          });
        }
      } else {
        const st = ScrollTrigger.getById('valueTimeline');
        if (st) {
          isScrollingRef.current = true;
          gsap.to(window, {
            duration: 1,
            scrollTo: st.start + (st.end - st.start) * progress,
            onComplete: () => {
              isScrollingRef.current = false;
              enableScroll();
            },
          });
        }
      }
      setInnerPageIndex(innerPageNavigateTo);
      setInnerPageNavigateTo(null);
    }
  }, [currentPageIndex, innerPageNavigateTo, progressMap, setInnerPageIndex, setInnerPageNavigateTo, enableScroll]);

  return (
    <group>
      <AnimalModel ref={modelRef} />
    </group>
  );
}

export default memo(ValueGL);
