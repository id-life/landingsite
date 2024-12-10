import { useCallback, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import * as THREE from 'three';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';
import { useThree } from '@react-three/fiber';
import { Center, Svg } from '@react-three/drei';
import { NAV_LIST } from '@/components/nav/nav';
import { useIsMobile } from '@/hooks/useIsMobile';
import AnimalModel from '@/components/gl/model/value/AnimalModel';
import { MODEL_CONFIG } from '@/components/gl/config/animalConfig';
import { VALUE_GL_CONFIG } from '@/components/gl/config/valueGLConfig';

gsap.registerPlugin(SplitText);

export type Position = {
  x: number;
  y: number;
  z: number;
};

const centerPoint = new THREE.Vector3(0, -10, 0);
const defaultWidth = 1912;

const randomIndex = Math.floor(Math.random() * 2);
const modelConfig = MODEL_CONFIG[randomIndex];

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
  const canAnimatingRef = useRef(true);
  const scaleRatio = useMemo(() => Math.min(1, size.width / defaultWidth), [size.width]);
  const timer1Ref = useRef<NodeJS.Timeout | null>(null);

  const enableScroll = useCallback(() => {
    if (isMobile) document.body.style.overflow = '';
  }, [isMobile]);

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
            if (!isMobile) return;
            canAnimatingRef.current = false;
            if (timer1Ref.current) clearTimeout(timer1Ref.current);
            timer1Ref.current = setTimeout(() => {
              canAnimatingRef.current = true;
            }, 3000);
          },
          onLeave: () => {
            if (timer1Ref.current) clearTimeout(timer1Ref.current);
          },
          onUpdate: (self) => {
            if (!isMobile) return;
            if (canAnimatingRef.current && self?.direction < 0) {
              const height = window.innerHeight;
              gsap.to(window, {
                duration: 1.5,
                scrollTo: { y: `#${NAV_LIST[1].id}`, offsetY: height * 0.85 },
                onComplete: () => {
                  canAnimatingRef.current = false;
                },
              });
            }
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
        { ...page1Config.to.model.rotation, ease: 'power3.out', onComplete: enableScroll },
        '<',
      );
      tl.to('#page-value-1', { opacity: 1 }, '<30%');
      if (isMobile) tl.to('#value-1-svg-mobile', { opacity: 1 }, '<30%');
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
          tl.to(material, { opacity: 0, ease: 'power3.inOut', duration: 0.5 });
        }
      });
      materialCount = 0;
      const svg1CnAnimGroup = gsap.timeline();
      svg1Cn?.traverse((child) => {
        materialCount++;
        if (materialCount < 16) return;
        const material = (child as any).material;
        svg1CnAnimGroup.to(material, { opacity: 1, ease: 'power3.inOut', duration: 1 });
      });
      tl.add(svg1CnAnimGroup, '-=3.5');
    }
  };

  const createPage2SvgAnim = (tl: GSAPTimeline) => {
    if (isMobile) {
      createMobileTextAnim(tl, 2);
    } else {
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
          tl.to(material, { opacity: 0, ease: 'power3.inOut', duration: 0.5 });
        }
      });
      materialCount = 0;
      const svg2CnAnimGroup = gsap.timeline();
      svg2Cn?.traverse((child) => {
        materialCount++;
        if (materialCount < 11 || materialCount > 30) return;
        const material = (child as any).material;
        svg2CnAnimGroup.to(material, { opacity: 1, ease: 'power3.inOut', duration: 1 });
      });
      tl.add(svg2CnAnimGroup, '-=6');
    }
  };

  const createPage3SvgAnim = (tl: GSAPTimeline) => {
    if (isMobile) {
      createMobileTextAnim(tl, 3);
    } else {
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
          tl.to(material, { opacity: 0, ease: 'power3.inOut', duration: 0.5 });
        }
      });
      materialCount = 0;
      const svg3CnAnimGroup = gsap.timeline();
      svg3Cn?.traverse((child) => {
        materialCount++;
        if (materialCount < 25) return;
        const material = (child as any).material;
        svg3CnAnimGroup.to(material, { opacity: 1, ease: 'power3.inOut', duration: 1 });
      });
      tl.add(svg3CnAnimGroup, '-=6');
    }
  };

  const createPage4SvgAnim = (tl: GSAPTimeline) => {
    if (isMobile) {
      createMobileTextAnim(tl, 4);
    } else {
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
          tl.to(material, { opacity: 0, ease: 'power3.inOut', duration: 0.5 });
        }
      });
      // console.log('1', materialCount);
      materialCount = 0;
      const svg4CnAnimGroup = gsap.timeline();
      svg4Cn?.traverse((child) => {
        materialCount++;
        if (materialCount > 7) return;
        const material = (child as any).material;
        svg4CnAnimGroup.to(material, { opacity: 1, ease: 'power3.inOut', duration: 1 });
      });
      tl.add(svg4CnAnimGroup, '-=3.5');
      // console.log('2', materialCount);
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
    tl.to(title2Ref.current.position, {
      ...getScalePosition(page3Config.to.prevTitle.position),
      ease: 'power3.inOut',
      duration: 8,
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

  // 清理计时器
  useEffect(() => {
    return () => {
      if (timer1Ref.current) {
        clearTimeout(timer1Ref.current);
      }
    };
  }, []);

  useGSAP(() => {
    if (!modelRef.current || !title1Ref.current || !title2Ref.current || !title3Ref.current || !title4Ref.current) return;
    modelRef.current.children[0].position.copy(modelConfig.init[0]);
    modelRef.current.children[1].position.copy(modelConfig.init[1]);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: `#${NAV_LIST[2].id}`,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
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
    tl.to(title4Ref.current.position, {
      ...getScalePosition(page5Config.to.prevTitle.position),
      duration: 8,
      ease: 'power3.inOut',
    });
    tl.to(
      camera.position,
      {
        ...page5Config.to.camera.position,
        duration: 8,
        ease: 'power3.inOut',
        onUpdate: () => {
          if (!modelRef.current) return;
          camera.lookAt(centerPoint);
        },
      },
      '<',
    );
    tl.to('#page-value-4', { opacity: 0, duration: 3.5, ease: 'power3.in' }, '<');
    if (isMobile) tl.to('#value-4-svg-mobile', { opacity: 0, duration: 3.5, ease: 'power3.in' }, '<');
    tl.to('#value-end-1', { autoAlpha: 1, duration: 3.5, ease: 'power3.out' }, '-=3.5');
    tl.to(modelRef.current.position, {
      ...(isMobile ? page6Config.to.model.mobilePos : page6Config.to.model.position),
      duration: 8,
      ease: 'none',
    });
    tl.to(modelRef.current.rotation, {
      ...(isMobile ? page6Config.to.model.mobileRot : page6Config.to.model.rotation),
      duration: 8,
      ease: 'none',
    });
    tl.to(
      camera.position,
      {
        ...page6Config.to.camera.position,
        duration: 8,
        ease: 'none',
        onUpdate: () => {
          if (!modelRef.current) return;
          camera.lookAt(centerPoint);
        },
      },
      '<',
    );
    if (isMobile) tl.to('#value-end-1', { autoAlpha: 0, duration: 3.5, ease: 'power3.out' }, '<');
    tl.to('#value-end-2', { autoAlpha: 1, duration: 3.5, ease: 'power3.out' }, '-=3.5');
    tl.to('#value-end-1', { autoAlpha: 0, duration: 3.5, ease: 'none' });
    tl.to('#value-end-2', { autoAlpha: 0, duration: 3.5, ease: 'none' }, '<');
  }, [isMobile]);

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
