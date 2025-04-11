import { innerPageIndexAtom, innerPageNavigateToAtom, mobileCurrentPageAtom, mobileCurrentPageIndexAtom } from '@/atoms';
import { VALUE_GL_CONFIG } from '@/components/gl/config/valueGLConfig';
import AnimalModel from '@/components/gl/model/value/AnimalModel';
import { NAV_LIST } from '@/components/nav/nav';

import { globalLoadedAtom } from '@/atoms/geo';
import { VALUE_PAGE_INDEX } from '@/constants/config';
import { useValueCrossAnimations } from '@/hooks/valueGL/useValueCrossAnimations';
import { useGSAP } from '@gsap/react';
import { Center, Svg } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const centerPoint = new THREE.Vector3(0, -10, 0);
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText, DrawSVGPlugin);

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

const VALUE_PROGRESS_CONFIG = {
  mobile: {
    0: 0,
    1: 0.69,
    2: 1, // 出邮箱
  },
} as const;
function MobileValueGL() {
  const { camera } = useThree();
  const [currentPage, setCurrentPage] = useAtom(mobileCurrentPageAtom);
  const modelRef = useRef<THREE.Group>(null);
  const page1Config = useMemo(() => VALUE_GL_CONFIG[0], []);
  const setInnerPageIndex = useSetAtom(innerPageIndexAtom);
  const [innerPageNavigateTo, setInnerPageNavigateTo] = useAtom(innerPageNavigateToAtom);
  const progressMap = useMemo(() => VALUE_PROGRESS_CONFIG.mobile, []);
  const startAnimTLRef = useRef<gsap.core.Timeline | null>(null);
  const globalLoaded = useAtomValue(globalLoadedAtom);
  const currentPageIndex = useAtomValue(mobileCurrentPageIndexAtom);
  const isScrollingRef = useRef(false);
  const enableScroll = useCallback(() => {
    document.body.style.overflow = '';
  }, []);

  const { createPage1CrossAnim, createPage2CrossAnim } = useValueCrossAnimations({
    modelRef,
    isScrollingRef,
  });

  useEffect(() => {
    if (!globalLoaded || startAnimTLRef.current || !modelRef.current) return;
    const tl = gsap.timeline({
      onStart: () => {
        console.log('start anim start');
      },
      onReverseComplete: () => {
        console.log('reverse complete');
      },
    });
    tl.to(camera.position, { ...page1Config.to.camera.position });
    tl.to('#fixed-value', { opacity: 1 }, '<');
    tl.to(
      camera.rotation,
      {
        ...page1Config.to.camera.rotation,
        onComplete: () => {
          camera.lookAt(centerPoint);
        },
      },
      '<',
    );
    tl.to('#vision-canvas', { zIndex: 1, opacity: 1 });
    tl.fromTo(
      modelRef.current.position,
      { ...page1Config.from.model.position },
      {
        ...page1Config.to.model.position,
        ease: 'power3.inOut',
      },
    );
    tl.fromTo(
      modelRef.current.rotation,
      { ...page1Config.from.model.rotation },
      {
        ...page1Config.to.model.rotation,
        ease: 'power3.inOut',
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
        duration: 2,
        ease: 'power3.inOut',
        transformOrigin: '50% 50%',
      },
      '<',
    );
    // const title1 = gsap.utils.toArray('.value-title1 path');
    // const title2 = gsap.utils.toArray('.value-title2 path');
    // title1.forEach((item) => {
    //   if (!item) return;
    //   tl.fromTo(
    //     item,
    //     {
    //       stroke: '#BB1212',
    //       fill: 'none',
    //       drawSVG: 0,
    //     },
    //     {
    //       drawSVG: true,
    //       duration: 0.5,
    //       delay: 0.5,
    //       ease: 'power3.inOut',
    //     },
    //     '<',
    //   );
    //   tl.to(
    //     item,
    //     {
    //       fill: '#BB1212',
    //       duration: 0.3,
    //       delay: 0.3,
    //     },
    //     '<',
    //   );
    // });
    // title2.forEach((item) => {
    //   if (!item) return;
    //   tl.fromTo(
    //     item,
    //     {
    //       stroke: '#BB1212',
    //       fill: 'none',
    //       drawSVG: 0,
    //     },
    //     {
    //       drawSVG: true,
    //       duration: 1,
    //       delay: 0.5,
    //       ease: 'power3.inOut',
    //     },
    //     '<',
    //   );
    //   tl.to(
    //     item,
    //     {
    //       fill: '#BB1212',
    //       duration: 0.3,
    //       delay: 1,
    //     },
    //     '<',
    //   );
    // });

    startAnimTLRef.current = tl;
    return () => {
      if (startAnimTLRef.current) startAnimTLRef.current.kill();
    };
  }, [camera, globalLoaded, page1Config, setCurrentPage]);

  useEffect(() => {
    if (globalLoaded) {
      if (currentPage.id === NAV_LIST[VALUE_PAGE_INDEX].id) startAnimTLRef.current?.play();
      else {
        gsap.to(window, { scrollTo: 0 }); // 从 value 切换页面时，回到顶部，因为目前就他一个可以滚动的
        startAnimTLRef.current?.reverse();
      }
    }
  }, [currentPage, globalLoaded]);
  // Value 页动画
  useGSAP(() => {
    if (!modelRef.current) return;
    const tl = gsap.timeline({
      scrollTrigger: {
        id: 'valueTimeline',
        trigger: `#${NAV_LIST[4].id}`,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        immediateRender: false,
      },
    });
    createPage1CrossAnim(tl);
    createPage2CrossAnim(tl);
  }, []);

  useEffect(() => {
    if (currentPageIndex !== VALUE_PAGE_INDEX || innerPageNavigateTo === null) return;
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

export default memo(MobileValueGL);
