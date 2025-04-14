import { innerPageIndexAtom, innerPageNavigateToAtom, mobileCurrentPageAtom, mobileCurrentPageIndexAtom } from '@/atoms';
import { VALUE_GL_CONFIG } from '@/components/gl/config/valueGLConfig';
import AnimalModel from '@/components/gl/model/value/AnimalModel';
import { NAV_LIST } from '@/components/nav/nav';

import { isSubscribeShowAtom } from '@/atoms/footer';
import { globalLoadedAtom } from '@/atoms/geo';
import { VALUE_PAGE_INDEX } from '@/constants/config';
import { useMobileValueCrossAnimations } from '@/hooks/valueGL/useMobileValueCrossAnimations';
import { useMobileValueSVGAnimations } from '@/hooks/valueGL/useMobileValueSVGAnimations';
import { useGSAP } from '@gsap/react';
import { Center, Svg } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { memo, useEffect, useMemo, useRef } from 'react';
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
    1: 0.5385,
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
  const setIsSubscribeShow = useSetAtom(isSubscribeShowAtom);

  const { createPage1SvgAnim, createPage2SvgAnim, createPage3SvgAnim } = useMobileValueSVGAnimations();
  const { createPage1CrossAnim, createPage2CrossAnim } = useMobileValueCrossAnimations({
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
    // tl.fromTo(
    //   '#fixed-value-page-1',
    //   {
    //     rotationX: -45,
    //     rotationY: 30,
    //     z: 500,
    //     opacity: 0,
    //   },
    //   {
    //     rotationX: 0,
    //     rotationY: 0,
    //     z: 0,
    //     opacity: 1,
    //     duration: 2,
    //     ease: 'power3.inOut',
    //     transformOrigin: '50% 50%',
    //   },
    //   '<',
    // );
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
    tl.to('#value-1-svg-mobile', { opacity: 1 }, '<');

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
        // onUpdate: (self) => {
        //   console.log(self.progress);
        // },
      },
    });
    // page1~2之间的 svg切换动画，红字消失变换为中文
    createPage1SvgAnim(tl);
    createPage1CrossAnim(tl);

    // page2~3之间的 svg切换动画，红字消失变换为中文
    createPage2SvgAnim(tl);
    createPage2CrossAnim(tl);

    createPage3SvgAnim(tl);
  }, []);

  useEffect(() => {
    if (currentPageIndex !== VALUE_PAGE_INDEX || innerPageNavigateTo === null) return;
    const progress = progressMap[innerPageNavigateTo as keyof typeof progressMap];
    if (progress !== undefined) {
      if (innerPageNavigateTo === 2) {
        const st = ScrollTrigger.getById('valueTimeline');
        if (st) {
          setIsSubscribeShow(true);
          isScrollingRef.current = true;
          gsap.to(window, {
            duration: 1,
            scrollTo: st.start + (st.end - st.start) * progress,
            onComplete: () => {
              isScrollingRef.current = false;
            },
          });
        }
      } else {
        const st = ScrollTrigger.getById('valueTimeline');
        if (st) {
          isScrollingRef.current = true;
          setIsSubscribeShow(false);
          gsap.to(window, {
            duration: 2,
            scrollTo: st.start + (st.end - st.start) * progress,
            onComplete: () => {
              isScrollingRef.current = false;
            },
          });
        }
      }
      setInnerPageIndex(innerPageNavigateTo);
      setInnerPageNavigateTo(null);
    }
  }, [currentPageIndex, innerPageNavigateTo, progressMap, setInnerPageIndex, setInnerPageNavigateTo, setIsSubscribeShow]);

  return (
    <group>
      <AnimalModel ref={modelRef} />
    </group>
  );
}

export default memo(MobileValueGL);
