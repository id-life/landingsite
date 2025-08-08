import {
  innerPageIndexAtom,
  innerPageNavigateToAtom,
  mobileCurrentPageAtom,
  mobileCurrentPageIndexAtom,
  mobileIsScrollingAtom,
} from '@/atoms';
import { VALUE_GL_CONFIG } from '@/components/gl/config/valueGLConfig';
import AnimalModel from '@/components/gl/model/value/AnimalModel';
import { NAV_LIST } from '@/components/nav/nav';

import { isMobileFooterContactShowAtom } from '@/atoms/footer';
import { VALUE_PAGE_INDEX } from '@/constants/config';
import { useMobileValueCrossAnimations } from '@/hooks/valueGL/useMobileValueCrossAnimations';
import { useMobileValueSVGAnimations } from '@/hooks/valueGL/useMobileValueSVGAnimations';
import { useGSAP } from '@gsap/react';
import { Center, Svg } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { memo, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const centerPoint = new THREE.Vector3(0, -10, 0);

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
    1: 0.425,
    2: 1, // 出邮箱
  },
} as const;

function MobileValueGL() {
  const { camera } = useThree();
  const [currentPage, setCurrentPage] = useAtom(mobileCurrentPageAtom);
  const setMobileIsScrolling = useSetAtom(mobileIsScrollingAtom);
  const modelRef = useRef<THREE.Group>(null);
  const page1Config = useMemo(() => VALUE_GL_CONFIG[0], []);
  const setInnerPageIndex = useSetAtom(innerPageIndexAtom);
  const [innerPageNavigateTo, setInnerPageNavigateTo] = useAtom(innerPageNavigateToAtom);
  const progressMap = useMemo(() => VALUE_PROGRESS_CONFIG.mobile, []);
  const startAnimTLRef = useRef<gsap.core.Timeline | null>(null);
  const currentPageIndex = useAtomValue(mobileCurrentPageIndexAtom);
  const isScrollingRef = useRef(false);
  const setIsSubscribeShow = useSetAtom(isMobileFooterContactShowAtom);

  const { createPage1SvgAnim, createPage2SvgAnim, createPage3SvgAnim } = useMobileValueSVGAnimations();
  const { createPage1CrossAnim, createPage2CrossAnim } = useMobileValueCrossAnimations({
    modelRef,
    isScrollingRef,
  });

  useEffect(() => {
    if (startAnimTLRef.current || !modelRef.current) return;
    const tl = gsap.timeline({
      onStart: () => {
        console.log('start anim start');
      },
      onReverseComplete: () => {
        console.log('reverse complete');
      },
    });
    tl.to(camera.position, { ...page1Config.to.camera.position });
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
    tl.to('#value-1-svg-mobile', { opacity: 1 }, '<');

    startAnimTLRef.current = tl;
    return () => {
      if (startAnimTLRef.current) startAnimTLRef.current.kill();
    };
  }, [camera, page1Config, setCurrentPage]);

  useEffect(() => {
    if (currentPage.id === NAV_LIST[VALUE_PAGE_INDEX].id) {
      startAnimTLRef.current?.play();
    } else {
      gsap.to(window, { scrollTo: 0 }); // 从 value 切换页面时，回到顶部，因为目前就他一个可以滚动的
      startAnimTLRef.current?.reverse();
    }
  }, [currentPage]);

  // Value 页动画
  useGSAP(() => {
    if (!modelRef.current) return;
    const tl = gsap.timeline({
      scrollTrigger: {
        id: 'valueTimeline',
        trigger: `#${NAV_LIST[5].id}`,
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
    tl.to(() => {}, { duration: 12 });
    createPage1CrossAnim(tl);

    // page2~3之间的 svg切换动画，红字消失变换为中文
    createPage2SvgAnim(tl);
    tl.to(() => {}, { duration: 12 });
    createPage2CrossAnim(tl);

    createPage3SvgAnim(tl);
  }, []);

  useEffect(() => {
    if (currentPageIndex !== VALUE_PAGE_INDEX || innerPageNavigateTo === null || isScrollingRef.current) return;
    const progress = progressMap[innerPageNavigateTo as keyof typeof progressMap];
    if (progress !== undefined) {
      if (innerPageNavigateTo === 2) {
        const st = ScrollTrigger.getById('valueTimeline');
        if (st) {
          isScrollingRef.current = true;
          setMobileIsScrolling(true);
          gsap.to(window, {
            duration: 3,
            scrollTo: st.start + (st.end - st.start) * progress,
            onComplete: () => {
              isScrollingRef.current = false;
              setMobileIsScrolling(false);
              setIsSubscribeShow(true);
            },
          });
        }
      } else {
        const st = ScrollTrigger.getById('valueTimeline');
        if (st) {
          isScrollingRef.current = true;
          setMobileIsScrolling(true);
          setIsSubscribeShow(false);
          gsap.to(window, {
            duration: 3,
            scrollTo: st.start + (st.end - st.start) * progress,
            onComplete: () => {
              isScrollingRef.current = false;
              setMobileIsScrolling(false);
            },
          });
        }
      }
      setInnerPageIndex(innerPageNavigateTo);
      setInnerPageNavigateTo(null);
    }
  }, [
    currentPageIndex,
    innerPageNavigateTo,
    progressMap,
    setInnerPageIndex,
    setInnerPageNavigateTo,
    setIsSubscribeShow,
    setMobileIsScrolling,
  ]);

  return (
    <group>
      <AnimalModel ref={modelRef} />
    </group>
  );
}

export default memo(MobileValueGL);
