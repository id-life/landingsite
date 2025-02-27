import { currentPageIndexAtom, valuePageIndexAtom, valuePageNavigateToAtom } from '@/atoms';
import { MODEL_CONFIG } from '@/components/gl/config/animalConfig';
import { VALUE_GL_CONFIG } from '@/components/gl/config/valueGLConfig';
import AnimalModel from '@/components/gl/model/value/AnimalModel';
import { NAV_LIST } from '@/components/nav/nav';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useValueCalcPosition } from '@/hooks/valueGL/useValueCalcPosition';
import { useValueCrossAnimations } from '@/hooks/valueGL/useValueCrossAnimations';
import { useValueSVGAnimations } from '@/hooks/valueGL/useValueSVGAnimations';
import { useGSAP } from '@gsap/react';
import { Center, Svg } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);

const centerPoint = new THREE.Vector3(0, -10, 0);
const modelConfig = MODEL_CONFIG[2];

export const VALUE_PROGRESS_CONFIG = {
  mobile: {
    0: 0,
    1: 0.245,
    2: 0.475,
    3: 0.704,
    4: 0.85,
    5: 1, // 出邮箱
  },
  desktop: {
    0: 0,
    1: 0.25,
    2: 0.486,
    3: 0.742,
    4: 1,
    5: 1, // 出邮箱
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
  const modelRef = useRef<THREE.Group>(null);
  const title1Ref = useRef<THREE.Group>(null);
  const title2Ref = useRef<THREE.Group>(null);
  const title3Ref = useRef<THREE.Group>(null);
  const title4Ref = useRef<THREE.Group>(null);
  const page1Config = useMemo(() => VALUE_GL_CONFIG[0], []);
  const page2Config = useMemo(() => VALUE_GL_CONFIG[1], []);
  const page3Config = useMemo(() => VALUE_GL_CONFIG[2], []);
  const page4Config = useMemo(() => VALUE_GL_CONFIG[3], []);
  const page6Config = useMemo(() => VALUE_GL_CONFIG[5], []);
  const isMobile = useIsMobile();
  const setValuePageIndex = useSetAtom(valuePageIndexAtom);
  const [valuePageNavigateTo, setValuePageNavigateTo] = useAtom(valuePageNavigateToAtom);
  const progressMap = useMemo(() => (isMobile ? VALUE_PROGRESS_CONFIG.mobile : VALUE_PROGRESS_CONFIG.desktop), [isMobile]);

  const currentPageIndex = useAtomValue(currentPageIndexAtom);
  const { lockScroll, unlockScroll } = useScrollLock();
  const isScrollingRef = useRef(false);
  const enableScroll = useCallback(() => {
    document.body.style.overflow = '';
  }, []);

  const { createPage1SvgAnim, createPage2SvgAnim, createPage3SvgAnim, createPage4SvgAnim } = useValueSVGAnimations();
  const { createPage1CrossAnim, createPage2CrossAnim, createPage3CrossAnim, createPage4CrossAnim } = useValueCrossAnimations({
    title1Ref,
    title2Ref,
    title3Ref,
    title4Ref,
    modelRef,
    isScrollingRef,
  });

  const { scaleRatio, getScalePosition, getVectorPosition } = useValueCalcPosition();

  const titlesConfig: TitleProps[] = useMemo(
    () => [
      {
        titleRef: title1Ref,
        position: getVectorPosition(getScalePosition(page1Config.from.title.position)),
        rotation: undefined,
        scale: 0.0107,
        titleName: 'title1',
      },
      {
        titleRef: title2Ref,
        position: getVectorPosition(getScalePosition(page2Config.from.title.position)),
        rotation: new THREE.Euler(0, -2.4, 0),
        scale: 0.0136,
        titleName: 'title2',
      },
      {
        titleRef: title3Ref,
        position: getVectorPosition(getScalePosition(page3Config.from.title.position)),
        rotation: new THREE.Euler(2.608, -0.075, 3.098),
        scale: 0.0121,
        titleName: 'title3',
      },
      {
        titleRef: title4Ref,
        position: getVectorPosition(getScalePosition(page4Config.from.title.position)),
        rotation: new THREE.Euler(-2.156, 0.114, 2.972),
        scale: 0.0143,
        titleName: 'title4',
      },
    ],
    [page1Config, page2Config, page3Config, page4Config, getVectorPosition, getScalePosition],
  );

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          immediateRender: isMobile,
          trigger: `#${NAV_LIST[2].id}`,
          start: isMobile ? 'top bottom+=400' : 'top bottom+=500',
          end: 'top top',
          scrub: true,
        },
      });
      tl.to(camera.position, { ...page1Config.to.camera.position });
      tl.to('#vision-canvas', { zIndex: 1, opacity: 1 });
      if (!title1Ref.current || !modelRef.current) return;
      tl.fromTo(
        title1Ref.current.position,
        { ...getScalePosition(page1Config.from.title.position) },
        { ...getScalePosition(page1Config.to.title.position), ease: 'power1.out' },
        '<10%',
      );
      tl.fromTo(
        title1Ref.current.rotation,
        { ...page1Config.from.title.rotation },
        { ...page1Config.to.title.rotation, ease: 'power1.out' },
        '<',
      );
      tl.fromTo(
        modelRef.current.position,
        { ...page1Config.from.model.position },
        {
          ...(isMobile ? page1Config.to.model.mobilePos : page1Config.to.model.position),
          ease: 'power3.out',
        },
        '<',
      );
      tl.fromTo(
        modelRef.current.rotation,
        { ...page1Config.from.model.rotation },
        {
          ...page1Config.to.model.rotation,
          ease: 'power3.out',
          onComplete: () => {
            if (isMobile) enableScroll();
          },
        },
        '<',
      );
      tl.to(
        '#page-value-1',
        {
          opacity: 1,
        },
        '<30%',
      );
      if (isMobile) tl.to('#value-1-svg-mobile', { opacity: 1 }, '<30%');
    },
    { dependencies: [isMobile] },
  );

  useGSAP(() => {
    if (!modelRef.current || !title1Ref.current || !title2Ref.current || !title3Ref.current || !title4Ref.current) return;
    modelRef.current.children[0].position.copy(modelConfig.init[0]);
    modelRef.current.children[1].position.copy(modelConfig.init[1]);
    modelRef.current.children[2].position.copy(modelConfig.init[2]);

    const tl = gsap.timeline({
      scrollTrigger: {
        id: 'valueTimeline',
        trigger: `#${NAV_LIST[2].id}`,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        immediateRender: isMobile,
        // onUpdate: (self) => {
        //   console.log('progress ', self?.progress);
        // },
      },
    });

    tl.add(() => {
      if (isMobile) {
        // console.log('isMobile anim start lock');
        lockScroll('up');
      }
    });
    tl.add(() => {
      if (isMobile) {
        // console.log('isMobile anim end unlock');
        unlockScroll();
      }
    }, '+=0.1');

    // page1~2之间的 svg切换动画，红字消失变换为中文
    createPage1SvgAnim(tl);
    // page1 to page2
    createPage1CrossAnim(tl);

    // page2~3之间的 svg切换动画，红字消失变换为中文
    createPage2SvgAnim(tl);
    // page2 to page3
    createPage2CrossAnim(tl);

    // page3~4之间的 svg切换动画，红字消失变换为中文
    createPage3SvgAnim(tl);
    // page3 to page4
    createPage3CrossAnim(tl);

    // page4之后的 svg切换动画，红字消失变换为中文
    createPage4SvgAnim(tl);
    createPage4CrossAnim(tl);

    // End
    // 移动整个模型到最终位置（第五页到第六页的过渡）
    tl.to(modelRef.current.position, {
      ...(isMobile ? page6Config.to.model.mobilePos : page6Config.to.model.position),
      duration: 4,
      ease: 'none',
      onStart: () => {
        if (!isScrollingRef.current) setValuePageIndex(3);
      },
      onComplete: () => {
        if (!isScrollingRef.current) setValuePageIndex(4);
      },
    });
    tl.to(
      modelRef.current.rotation,
      {
        ...(isMobile ? page6Config.to.model.mobileRot : page6Config.to.model.rotation),
        duration: 4,
        ease: 'none',
      },
      '<',
    );
    tl.to(
      camera.position,
      {
        ...page6Config.to.camera.position,
        duration: 4,
        ease: 'none',
        onUpdate: () => {
          if (!modelRef.current) return;
          camera.lookAt(centerPoint);
        },
      },
      '<',
    );

    // 显示结束文字
    tl.to('#value-end-1', { autoAlpha: 1, duration: 1, ease: 'power3.out' }, '<');
    tl.to('#value-end-2', { autoAlpha: 1, duration: 1, ease: 'power3.out' }, '<');

    // 移动端特殊处理，文字消失再出 SUBSCRIBE
    if (isMobile) tl.to('#value-end-1', { autoAlpha: 0, duration: 5, ease: 'none' });
    if (isMobile) tl.to('#value-end-2', { autoAlpha: 0, duration: 5, ease: 'none' }, '<');
  }, [isMobile]);

  useEffect(() => {
    if (currentPageIndex !== 2 || valuePageNavigateTo === null) return;
    const progress = progressMap[valuePageNavigateTo as keyof typeof progressMap];
    if (progress !== undefined) {
      if (valuePageNavigateTo === 5) {
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
              if (valuePageNavigateTo === 0 && title1Ref.current)
                gsap.set(title1Ref.current.position, { ...getScalePosition(page1Config.to.title.position) });
            },
          });
        }
      }
      setValuePageIndex(valuePageNavigateTo);
      setValuePageNavigateTo(null);
    }
  }, [
    currentPageIndex,
    valuePageNavigateTo,
    isMobile,
    progressMap,
    setValuePageIndex,
    setValuePageNavigateTo,
    enableScroll,
    getScalePosition,
    page1Config.to.title.position,
  ]);

  return (
    <group>
      <group scale={scaleRatio} visible={!isMobile}>
        {titlesConfig.map((config, index) => (
          <TitleSVG key={config.titleName} {...config} />
        ))}
      </group>
      <AnimalModel ref={modelRef} />
    </group>
  );
}
export default memo(ValueGL);
