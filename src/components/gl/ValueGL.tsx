import { currentPageIndexAtom, valuePageIndexAtom, valuePageNavigateToAtom } from '@/atoms';
import { model2VisibleAtom, model3VisibleAtom, model4VisibleAtom } from '@/atoms/geo';
import { MODEL_CONFIG } from '@/components/gl/config/animalConfig';
import { VALUE_GL_CONFIG } from '@/components/gl/config/valueGLConfig';
import AnimalModel from '@/components/gl/model/value/AnimalModel';
import { NAV_LIST } from '@/components/nav/nav';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useScrollLock } from '@/hooks/useScrollLock';
import { useGSAP } from '@gsap/react';
import { Center, Svg } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { throttle } from 'lodash-es';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText);

export type Position = {
  x: number;
  y: number;
  z: number;
};

const centerPoint = new THREE.Vector3(0, -10, 0);
const defaultWidth = 1912;

const modelConfig = MODEL_CONFIG[2];

export default function ValueGL() {
  const { camera, size, scene } = useThree();
  const modelRef = useRef<THREE.Group>(null);
  const title1Ref = useRef<THREE.Group>(null);
  const title2Ref = useRef<THREE.Group>(null);
  const title3Ref = useRef<THREE.Group>(null);
  const title4Ref = useRef<THREE.Group>(null);
  const page1Config = useMemo(() => VALUE_GL_CONFIG[0], []);
  const page2Config = useMemo(() => VALUE_GL_CONFIG[1], []);
  const page3Config = useMemo(() => VALUE_GL_CONFIG[2], []);
  const page4Config = useMemo(() => VALUE_GL_CONFIG[3], []);
  const page5Config = useMemo(() => VALUE_GL_CONFIG[4], []);
  const page6Config = useMemo(() => VALUE_GL_CONFIG[5], []);
  const isMobile = useIsMobile();
  // const canAnimatingRef = useRef(true);
  const scaleRatio = useMemo(() => Math.min(1, size.width / defaultWidth), [size.width]);
  // const timer1Ref = useRef<NodeJS.Timeout | null>(null);
  const [model2Visible, setModel2Visible] = useAtom(model2VisibleAtom);
  const [model3Visible, setModel3Visible] = useAtom(model3VisibleAtom);
  const [model4Visible, setModel4Visible] = useAtom(model4VisibleAtom);
  const setValuePageIndex = useSetAtom(valuePageIndexAtom);
  const [valuePageNavigateTo, setValuePageNavigateTo] = useAtom(valuePageNavigateToAtom);

  const currentPageIndex = useAtomValue(currentPageIndexAtom);
  const { lockScroll, unlockScroll } = useScrollLock();
  const isScrollingRef = useRef(false);

  const disableScroll = useCallback(() => {
    document.body.style.overflow = 'hidden';
  }, []);

  const enableScroll = useCallback(() => {
    document.body.style.overflow = '';
  }, []);

  const getScalePosition = useCallback(
    (pos: Position) => {
      const backScale = 1 / scaleRatio;
      return { x: pos.x * backScale, y: pos.y * backScale, z: pos.z * backScale };
    },
    [scaleRatio],
  );

  const getVectorPosition = useCallback((pos: Position) => new THREE.Vector3(pos.x, pos.y, pos.z), []);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          immediateRender: isMobile,
          trigger: `#${NAV_LIST[2].id}`,
          start: isMobile ? 'top bottom+=400' : 'top bottom+=500',
          end: 'top top',
          scrub: true,
          onEnter: () => {
            if (isMobile) lockScroll('up');
          },
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
      if (isMobile) tl.to('#value-1-svg-mobile', { opacity: 1, onComplete: () => lockScroll('up') }, '<30%');
    },
    { dependencies: [isMobile] },
  );

  const createMobileTextAnim = (tl: GSAPTimeline, index: number) => {
    const value1TextRedEn = new SplitText(`#value-${index}-svg-mobile .value-text-en.text-red-500`, {
      type: 'lines,words,chars',
    });
    const value1TextNormalEn = new SplitText(`#value-${index}-svg-mobile .value-text-en:not(.text-red-500)`, {
      type: 'lines,words,chars',
    });

    // 中文文本
    const value1TextCn = new SplitText(`#value-${index}-svg-mobile .value-text-cn`, {
      type: 'lines,words,chars',
    });

    if (index === 1) {
      tl.from([value1TextRedEn.chars, value1TextNormalEn.chars], {
        opacity: 1,
        y: 0,
      });
    } else
      tl.fromTo(
        [value1TextRedEn.chars, value1TextNormalEn.chars],
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.02,
        },
      );
    // 只让红字淡出
    tl.to(value1TextRedEn.chars, {
      opacity: 0,
      y: -50,
      duration: 0.8,
      stagger: 0.02,
      onComplete: () => {
        if (isMobile) unlockScroll();
      },
      onReverseComplete: () => {
        if (isMobile) lockScroll('up');
      },
    })
      // 中文淡入
      .fromTo(
        value1TextCn.chars,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.02,
        },
      );
  };

  const createPage1SvgAnim = (tl: GSAPTimeline) => {
    if (isMobile) {
      createMobileTextAnim(tl, 1);
    } else {
      const svg1 = scene.getObjectByName('title1-svg') as THREE.Object3D;
      const svg1Cn = scene.getObjectByName('title1-cn-svg') as THREE.Object3D;
      const changeTL = gsap.timeline({
        paused: true,
        immediateRender: false,
        onComplete: () => {
          // console.log('complete');
          enableScroll();
        },
        onReverseComplete: () => {
          // console.log('reverse complete');
          enableScroll();
        },
      });
      // 设置初始状态
      svg1Cn.translateY(0.6); // 偏移
      svg1?.traverse((child) => {
        if ((child as any).material) {
          const material = (child as any).material;
          material.transparent = true;
          material.opacity = 1; // 设置初始透明度为1
        }
      });
      svg1Cn?.traverse((child) => {
        if ((child as any).material) {
          const material = (child as any).material;
          material.transparent = true;
          material.opacity = 0; // 设置初始透明度为0
        }
      });

      let materialCount = 0;
      // 红字消失变换为中文
      svg1?.traverse((child) => {
        if ((child as any).material) {
          materialCount++;
          if (materialCount < 14) return;
          const material = (child as any).material;
          changeTL.to(material, { opacity: 0, ease: 'power3.inOut', duration: 0.1 });
        }
      });
      materialCount = 0;
      const svg1CnAnimGroup = gsap.timeline();
      svg1Cn?.traverse((child) => {
        materialCount++;
        if (materialCount < 16) return;
        const material = (child as any).material;
        svg1CnAnimGroup.to(material, { opacity: 1, ease: 'power3.inOut', duration: 0.2 });
      });
      changeTL.add(svg1CnAnimGroup, '-=1');
      tl.to(
        {},
        {
          duration: 5,
          onComplete: () => {
            if (isScrollingRef?.current) return;
            disableScroll();
            changeTL.play();
          },
          onReverseComplete: () => {
            if (isScrollingRef?.current) return;
            disableScroll();
            changeTL.reverse();
          },
        },
      );
      tl.to({}, { duration: 5 }); // 停顿
    }
  };

  const createPage2SvgAnim = (tl: GSAPTimeline) => {
    if (isMobile) {
      createMobileTextAnim(tl, 2);
    } else {
      const changeTL = gsap.timeline({
        paused: true,
        immediateRender: false,
        onComplete: () => {
          enableScroll();
        },
        onReverseComplete: () => {
          enableScroll();
        },
      });

      const svg2 = scene.getObjectByName('title2-svg') as THREE.Object3D;
      const svg2Cn = scene.getObjectByName('title2-cn-svg') as THREE.Object3D;
      // 设置初始状态
      // svg2Cn.translateY(0.6); // 偏移
      svg2?.traverse((child) => {
        if ((child as any).material) {
          const material = (child as any).material;
          material.transparent = true;
          material.opacity = 1; // 设置初始透明度为1
        }
      });
      svg2Cn?.traverse((child) => {
        if ((child as any).material) {
          const material = (child as any).material;
          material.transparent = true;
          material.opacity = 0; // 设置初始透明度为0
        }
      });
      let materialCount = 0;
      // 红字消失变换为中文
      svg2?.traverse((child) => {
        if ((child as any).material) {
          materialCount++;
          if (materialCount < 11 || materialCount > 20) return;
          const material = (child as any).material;
          changeTL.to(material, { opacity: 0, ease: 'power3.inOut', duration: 0.1 });
        }
      });
      materialCount = 0;
      const svg2CnAnimGroup = gsap.timeline();
      svg2Cn?.traverse((child) => {
        materialCount++;
        if (materialCount < 11 || materialCount > 30) return;
        const material = (child as any).material;
        svg2CnAnimGroup.to(material, { opacity: 1, ease: 'power3.inOut', duration: 0.1 });
      });
      changeTL.add(svg2CnAnimGroup, '-=1.2');
      tl.to(
        {},
        {
          duration: 5,
          onComplete: () => {
            if (isScrollingRef?.current) return;
            disableScroll();
            changeTL.play();
          },
          onReverseComplete: () => {
            if (isScrollingRef?.current) return;
            disableScroll();
            changeTL.reverse();
          },
        },
      );
      tl.to({}, { duration: 5 }); // 停顿
    }
  };

  const createPage3SvgAnim = (tl: GSAPTimeline) => {
    if (isMobile) {
      createMobileTextAnim(tl, 3);
    } else {
      const changeTL = gsap.timeline({
        paused: true,
        immediateRender: false,
        onComplete: () => {
          enableScroll();
        },
        onReverseComplete: () => {
          enableScroll();
        },
      });

      const svg3 = scene.getObjectByName('title3-svg') as THREE.Object3D;
      const svg3Cn = scene.getObjectByName('title3-cn-svg') as THREE.Object3D;
      // 设置初始状态
      // svg2Cn.translateY(0.6); // 偏移
      svg3?.traverse((child) => {
        if ((child as any).material) {
          const material = (child as any).material;
          material.transparent = true;
          material.opacity = 1; // 设置初始透明度为1
        }
      });
      svg3Cn?.traverse((child) => {
        if ((child as any).material) {
          const material = (child as any).material;
          material.transparent = true;
          material.opacity = 0; // 设置初始透明度为0
        }
      });
      let materialCount = 0;
      // 红字消失变换为中文
      svg3?.traverse((child) => {
        if ((child as any).material) {
          materialCount++;
          if (materialCount < 25) return;
          const material = (child as any).material;
          changeTL.to(material, { opacity: 0, ease: 'power3.inOut', duration: 0.1 });
        }
      });
      materialCount = 0;
      const svg3CnAnimGroup = gsap.timeline();
      svg3Cn?.traverse((child) => {
        materialCount++;
        if (materialCount < 25) return;
        const material = (child as any).material;
        svg3CnAnimGroup.to(material, { opacity: 1, ease: 'power3.inOut', duration: 0.2 });
      });
      changeTL.add(svg3CnAnimGroup, '-=1.4');
      tl.to(
        {},
        {
          duration: 5,
          onComplete: () => {
            if (isScrollingRef?.current) return;
            disableScroll();
            changeTL.play();
          },
          onReverseComplete: () => {
            if (isScrollingRef?.current) return;
            disableScroll();
            changeTL.reverse();
          },
        },
      );
      tl.to({}, { duration: 5 }); // 停顿
    }
  };

  const createPage4SvgAnim = (tl: GSAPTimeline) => {
    if (isMobile) {
      createMobileTextAnim(tl, 4);
    } else {
      const changeTL = gsap.timeline({
        paused: true,
        immediateRender: false,
        onComplete: () => {
          enableScroll();
        },
        onReverseComplete: () => {
          enableScroll();
        },
      });
      const svg4 = scene.getObjectByName('title4-svg') as THREE.Object3D;
      const svg4Cn = scene.getObjectByName('title4-cn-svg') as THREE.Object3D;
      // 设置初始状态
      svg4Cn.translateY(0.5); // 偏移
      svg4Cn.translateX(4); // 偏移
      svg4?.traverse((child) => {
        if ((child as any).material) {
          const material = (child as any).material;
          material.transparent = true;
          material.opacity = 1; // 设置初始透明度为1
        }
      });
      svg4Cn?.traverse((child) => {
        if ((child as any).material) {
          const material = (child as any).material;
          material.transparent = true;
          material.opacity = 0; // 设置初始透明度为0
        }
      });
      let materialCount = 0;
      // 红字消失变换为中文
      svg4?.traverse((child) => {
        if ((child as any).material) {
          materialCount++;
          if (materialCount >= 15) return;
          const material = (child as any).material;
          changeTL.to(material, { opacity: 0, ease: 'power3.inOut', duration: 0.15 });
        }
      });
      // console.log('1', materialCount);
      materialCount = 0;
      const svg4CnAnimGroup = gsap.timeline();
      svg4Cn?.traverse((child) => {
        materialCount++;
        if (materialCount > 7) return;
        const material = (child as any).material;
        svg4CnAnimGroup.to(material, { opacity: 1, ease: 'power3.inOut', duration: 0.2 });
      });
      changeTL.add(svg4CnAnimGroup, '-=0.2');
      tl.to(
        {},
        {
          duration: 5,
          onComplete: () => {
            if (isScrollingRef?.current) return;
            disableScroll();
            changeTL.play();
          },
          onReverseComplete: () => {
            if (isScrollingRef?.current) return;
            disableScroll();
            changeTL.reverse();
          },
        },
      );
      tl.to({}, { duration: 5 }); // 停顿
    }
  };

  // page cross anim
  const createPage1CrossAnim = (tl: GSAPTimeline) => {
    if (!title1Ref.current || !modelRef.current) return;
    tl.to(title1Ref.current.position, {
      ...getScalePosition(page2Config.to.prevTitle.position),
      ease: 'power3.inOut',
      duration: 8,
    });
    tl.to(
      modelRef.current.position,
      {
        ...(isMobile ? page2Config.to.model.mobilePos : page2Config.to.model.position),
        ease: 'power3.inOut',
        duration: 8,
        onStart: () => {
          if (!isScrollingRef.current) setValuePageIndex(0);
        },
        onComplete: () => {
          if (!isScrollingRef.current) setValuePageIndex(1);
        },
      },
      '<',
    );
    tl.to(
      modelRef.current.rotation,
      {
        ...page2Config.to.model.rotation,
        ease: 'power3.inOut',
        duration: 8,
      },
      '<',
    );
    tl.to(
      camera.position,
      {
        ...page2Config.to.camera.position,
        duration: 8,
        ease: 'power3.inOut',
        onUpdate: () => {
          if (!modelRef.current) return;
          camera.lookAt(centerPoint);
        },
      },
      '<',
    );

    tl.to('#page-value-1', { opacity: 0, duration: 3.5, ease: 'power3.in' }, '<');
    if (isMobile) tl.to('#value-1-svg-mobile', { opacity: 0, duration: 3.5, ease: 'power3.in' }, '<');
    tl.to('#page-value-2', { opacity: 1, duration: 3.5, ease: 'power3.out' }, '-=3.5');
    if (isMobile) tl.to('#value-2-svg-mobile', { opacity: 1, duration: 3.5, ease: 'power3.out' }, '-=3.5');
  };

  const createPage2CrossAnim = (tl: GSAPTimeline) => {
    if (!title2Ref.current || !title3Ref.current || !modelRef.current) return;

    const throttleSetModel3Visible = throttle(() => {
      // console.log('model 小精灵出现');
      if (title2Ref.current) title2Ref.current.visible = false;
      if (model3Visible) return;
      setModel2Visible(false);
      setModel3Visible(true);
      setModel4Visible(false);
    }, 500);
    const throttleSetModel2Visible = throttle(() => {
      // console.log('model 水母出现');
      if (title2Ref.current) title2Ref.current.visible = true;
      if (model2Visible) return;
      setModel2Visible(true);
      setModel3Visible(false);
      setModel4Visible(false);
    }, 500);

    tl.to(title2Ref.current.position, {
      ...getScalePosition(page3Config.to.prevTitle.position),
      ease: 'power3.inOut',
      duration: 8,
      onUpdate() {
        // console.log('progress:', this.progress());
        const progress = this.progress();
        if (progress > 0.5) {
          throttleSetModel3Visible();
        }
        if (progress < 0.5) {
          throttleSetModel2Visible();
        }
      },
    });
    tl.to(
      title3Ref.current.position,
      {
        ...getScalePosition(page3Config.to.title.position),
        ease: 'power3.inOut',
        duration: 8,
      },
      '<',
    );
    tl.to(
      modelRef.current.position,
      {
        ...(isMobile ? page3Config.to.model.mobilePos : page3Config.to.model.position),
        ease: 'power3.inOut',
        duration: 8,
        onStart: () => {
          if (!isScrollingRef.current) setValuePageIndex(1);
        },
        onComplete: () => {
          if (!isScrollingRef.current) setValuePageIndex(2);
        },
      },
      '<',
    );
    tl.to(
      modelRef.current.children[0].position,
      {
        x: modelConfig.pos1[0].x,
        y: modelConfig.pos1[0].y,
        z: modelConfig.pos1[0].z,
        ease: 'power3.inOut',
        duration: 8,
      },
      '<',
    );
    tl.to(
      modelRef.current.children[1].position,
      {
        x: modelConfig.pos1[1].x,
        y: modelConfig.pos1[1].y,
        z: modelConfig.pos1[1].z,
        ease: 'power3.inOut',
        duration: 8,
      },
      '<',
    );
    tl.to(
      modelRef.current.children[2].position,
      {
        x: modelConfig.pos1[2].x,
        y: modelConfig.pos1[2].y,
        z: modelConfig.pos1[2].z,
        ease: 'power3.inOut',
        duration: 8,
      },
      '<',
    );
    tl.to(
      modelRef.current.rotation,
      {
        ...(isMobile ? page3Config.to.model.mobileRot : page3Config.to.model.rotation),
        ease: 'power3.inOut',
        duration: 8,
      },
      '<',
    );
    tl.to(
      camera.position,
      {
        ...page3Config.to.camera.position,
        duration: 8,
        ease: 'power3.inOut',
        onUpdate: () => {
          if (!modelRef.current) return;
          camera.lookAt(centerPoint);
        },
      },
      '<',
    );
    tl.to('#page-value-2', { opacity: 0, duration: 3.5, ease: 'power3.in' }, '<');
    if (isMobile) tl.to('#value-2-svg-mobile', { opacity: 0, duration: 3.5, ease: 'power3.in' }, '<');
    tl.to('#page-value-3', { opacity: 1, duration: 3.5, ease: 'power3.out' }, '-=3.5');
    if (isMobile) tl.to('#value-3-svg-mobile', { opacity: 1, duration: 3.5, ease: 'power3.out' }, '-=3.5');
  };

  const createPage3CrossAnim = (tl: GSAPTimeline) => {
    if (!title3Ref.current || !title4Ref.current || !modelRef.current) return;

    tl.to(title3Ref.current.position, {
      ...getScalePosition(page4Config.to.prevTitle.position),
      duration: 8,
      ease: 'power3.inOut',
    });
    tl.to(
      title4Ref.current.position,
      {
        ...getScalePosition(page4Config.to.title.position),
        duration: 8,
        ease: 'power3.inOut',
      },
      '<',
    );
    tl.to(
      modelRef.current.position,
      {
        ...(isMobile ? page4Config.to.model.mobilePos : page4Config.to.model.position),
        duration: 8,
        ease: 'power3.inOut',
        onStart: () => {
          if (!isScrollingRef.current) setValuePageIndex(2);
        },
        onComplete: () => {
          if (!isScrollingRef.current) setValuePageIndex(3);
        },
      },
      '<',
    );
    tl.to(
      modelRef.current.rotation,
      {
        ...(isMobile ? page4Config.to.model.mobileRot : page4Config.to.model.rotation),
        duration: 8,
        ease: 'power3.inOut',
      },
      '<',
    );
    tl.to(
      camera.position,
      {
        ...page4Config.to.camera.position,
        duration: 8,
        ease: 'power3.inOut',
        onUpdate: () => {
          if (!modelRef.current) return;
          camera.lookAt(centerPoint);
        },
      },
      '<',
    );
    tl.to('#page-value-3', { opacity: 0, duration: 3.5, ease: 'power3.in' }, '<');
    if (isMobile) tl.to('#value-3-svg-mobile', { opacity: 0, duration: 3.5, ease: 'power3.in' }, '<');
    tl.to('#page-value-4', { opacity: 1, duration: 3.5, ease: 'power3.out' }, '-=3.5');
    if (isMobile) tl.to('#value-4-svg-mobile', { opacity: 1, duration: 3.5, ease: 'power3.out' }, '-=3.5');
  };

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
        // onUpdate: (self) => {
        // console.log('self progress:', self?.progress);
        // },
      },
    });

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

    // End
    // const throttleSetModel4Visible = throttle(() => {
    //   // if (model4Visible) return;
    //   console.log('model 海马出现');
    //   setModel2Visible(false);
    //   setModel3Visible(false);
    //   setModel4Visible(true);
    // }, 500);
    // const throttleSetModel2Visible = throttle(() => {
    //   // if (model2Visible) return;
    //   console.log('model 水母出现');
    //   setModel2Visible(true);
    //   setModel3Visible(false);
    //   setModel4Visible(false);
    // }, 500);

    tl.to(title4Ref.current.position, {
      ...getScalePosition(page5Config.to.prevTitle.position),
      duration: 3,
      ease: 'power3.inOut',
    });
    tl.to(
      modelRef.current.children[0].position,
      {
        x: modelConfig.pos2[0].x,
        y: modelConfig.pos2[0].y,
        z: modelConfig.pos2[0].z,
        ease: 'power3.inOut',
        duration: 3,
        // onUpdate() {
        //   const progress = this.progress();
        //   console.log('progress', progress);
        //   if (progress < 0.5) throttleSetModel2Visible();
        //   if (progress > 0.5) throttleSetModel4Visible();
        // },
      },
      '<',
    );
    tl.to(
      modelRef.current.children[1].position,
      {
        x: modelConfig.pos2[1].x,
        y: modelConfig.pos2[1].y,
        z: modelConfig.pos2[1].z,
        ease: 'power3.inOut',
        duration: 3,
      },
      '<',
    );
    tl.to(
      modelRef.current.children[2].position,
      {
        x: isMobile ? 0 : modelConfig.pos2[2].x,
        y: modelConfig.pos2[2].y,
        z: modelConfig.pos2[2].z,
        ease: 'power3.inOut',
        duration: 3,
      },
      '<',
    );
    tl.to(
      camera.position,
      {
        ...page5Config.to.camera.position,
        duration: 3,
        ease: 'power3.inOut',
        onUpdate: () => {
          if (!modelRef.current) return;
          camera.lookAt(centerPoint);
        },
      },
      '<',
    );
    tl.to('#page-value-4', { opacity: 0, duration: 3, ease: 'power3.in' }, '<');
    if (isMobile) tl.to('#value-4-svg-mobile', { opacity: 0, duration: 3.5, ease: 'power3.in' }, '<');
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
    tl.to(modelRef.current.rotation, {
      ...(isMobile ? page6Config.to.model.mobileRot : page6Config.to.model.rotation),
      duration: 4,
      ease: 'none',
    });
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
    tl.to('#value-end-1', { autoAlpha: 1, duration: 1, ease: 'power3.out' }, '<');
    // if (isMobile) tl.to('#value-end-1', { autoAlpha: 0, duration: 5, ease: 'power3.out' }, '<');
    tl.to('#value-end-2', { autoAlpha: 1, duration: 1, ease: 'power3.out' }, '<');
    // tl.to({}, { duration: 10 }); // 停顿
    if (isMobile) tl.to('#value-end-1', { autoAlpha: 0, duration: 5, ease: 'none' });
    if (isMobile) tl.to('#value-end-2', { autoAlpha: 0, duration: 5, ease: 'none' }, '<');
  }, [isMobile]);

  useEffect(() => {
    if (currentPageIndex !== 2 || valuePageNavigateTo === null) return;
    // console.log('valuePageNavigateTo', valuePageNavigateTo);

    const mobileProgressMap = {
      0: 0,
      1: 0.224,
      2: 0.437,
      3: 0.65,
      4: 0.85,
    };

    const progressMap = {
      0: 0,
      1: 0.25,
      2: 0.485,
      3: 0.77,
      4: 1,
    };

    const progress = (isMobile ? mobileProgressMap : progressMap)[valuePageNavigateTo as keyof typeof progressMap];
    if (progress !== undefined) {
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
    setValuePageIndex(valuePageNavigateTo);
    setValuePageNavigateTo(null);
  }, [currentPageIndex, valuePageNavigateTo, isMobile]);

  return (
    <group>
      <group scale={scaleRatio} visible={!isMobile}>
        <Center ref={title1Ref} position={getVectorPosition(getScalePosition(page1Config.from.title.position))}>
          <Svg scale={0.0107} name="title1-svg" src="/svgs/value/title1.svg" />
          <Svg scale={0.0107} name="title1-cn-svg" src="/svgs/value/title1-cn.svg" />
        </Center>
        <Center
          ref={title2Ref}
          position={getVectorPosition(getScalePosition(page2Config.from.title.position))}
          rotation={[0, -2.4, 0]}
        >
          <Svg scale={0.0136} name="title2-svg" src="/svgs/value/title2.svg" />
          <Svg scale={0.0136} name="title2-cn-svg" src="/svgs/value/title2-cn.svg" />
        </Center>
        <Center
          ref={title3Ref}
          position={getVectorPosition(getScalePosition(page3Config.from.title.position))}
          rotation={[2.608, -0.075, 3.098]}
        >
          <Svg scale={0.0121} name="title3-svg" src="/svgs/value/title3.svg" />
          <Svg scale={0.0121} name="title3-cn-svg" src="/svgs/value/title3-cn.svg" />
        </Center>
        <Center
          ref={title4Ref}
          position={getVectorPosition(getScalePosition(page4Config.from.title.position))}
          rotation={[-2.156, 0.114, 2.972]}
        >
          <Svg scale={0.0143} name="title4-svg" src="/svgs/value/title4.svg" />
          <Svg scale={0.0143} name="title4-cn-svg" src="/svgs/value/title4-cn.svg" />
        </Center>
      </group>
      <AnimalModel ref={modelRef} />
    </group>
  );
}
