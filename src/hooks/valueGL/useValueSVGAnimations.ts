import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { Object3D } from 'three';
import { useIsMobile } from '../useIsMobile';
gsap.registerPlugin(SplitText);

export const useValueSVGAnimations = () => {
  const isMobile = useIsMobile();
  const { scene } = useThree();

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
      const svg1 = scene.getObjectByName('title1-svg') as Object3D;
      const svg1Cn = scene.getObjectByName('title1-cn-svg') as Object3D;
      // const changeTL = gsap.timeline({
      //   paused: true,
      //   immediateRender: false,
      //   onComplete: () => {
      //     // console.log('complete');
      //     enableScroll();
      //   },
      //   onReverseComplete: () => {
      //     // console.log('reverse complete');
      //     enableScroll();
      //   },
      // });
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
          tl.to(material, { opacity: 0, ease: 'power3.inOut', duration: 0.1 });
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
      tl.add(svg1CnAnimGroup, '-=1.5');
      // tl.to(
      //   {},
      //   {
      //     duration: 5,
      //     onComplete: () => {
      //       if (isScrollingRef?.current) return;
      //       disableScroll();
      //       changeTL.play();
      //     },
      //     onReverseComplete: () => {
      //       if (isScrollingRef?.current) return;
      //       disableScroll();
      //       changeTL.reverse();
      //     },
      //   },
      // );
      // tl.to({}, { duration: 5 }); // 停顿
    }
  };

  const createPage2SvgAnim = (tl: GSAPTimeline) => {
    if (isMobile) {
      createMobileTextAnim(tl, 2);
    } else {
      // const changeTL = gsap.timeline({
      //   paused: true,
      //   immediateRender: false,
      //   onComplete: () => {
      //     enableScroll();
      //   },
      //   onReverseComplete: () => {
      //     enableScroll();
      //   },
      // });

      const svg2 = scene.getObjectByName('title2-svg') as Object3D;
      const svg2Cn = scene.getObjectByName('title2-cn-svg') as Object3D;
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
          tl.to(material, { opacity: 0, ease: 'power3.inOut', duration: 0.1 });
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
      tl.add(svg2CnAnimGroup, '-=1.2');
      // tl.to(
      //   {},
      //   {
      //     duration: 5,
      //     onComplete: () => {
      //       if (isScrollingRef?.current) return;
      //       disableScroll();
      //       changeTL.play();
      //     },
      //     onReverseComplete: () => {
      //       if (isScrollingRef?.current) return;
      //       disableScroll();
      //       changeTL.reverse();
      //     },
      //   },
      // );
      // tl.to({}, { duration: 5 }); // 停顿
    }
  };

  const createPage3SvgAnim = (tl: GSAPTimeline) => {
    if (isMobile) {
      createMobileTextAnim(tl, 3);
    } else {
      // const changeTL = gsap.timeline({
      //   paused: true,
      //   immediateRender: false,
      //   onComplete: () => {
      //     enableScroll();
      //   },
      //   onReverseComplete: () => {
      //     enableScroll();
      //   },
      // });

      const svg3 = scene.getObjectByName('title3-svg') as Object3D;
      const svg3Cn = scene.getObjectByName('title3-cn-svg') as Object3D;
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
          tl.to(material, { opacity: 0, ease: 'power3.inOut', duration: 0.1 });
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
      tl.add(svg3CnAnimGroup, '-=1.4');
      // tl.to(
      //   {},
      //   {
      //     duration: 5,
      //     onComplete: () => {
      //       if (isScrollingRef?.current) return;
      //       disableScroll();
      //       changeTL.play();
      //     },
      //     onReverseComplete: () => {
      //       if (isScrollingRef?.current) return;
      //       disableScroll();
      //       changeTL.reverse();
      //     },
      //   },
      // );
      // tl.to({}, { duration: 5 }); // 停顿
    }
  };

  const createPage4SvgAnim = (tl: GSAPTimeline) => {
    if (isMobile) {
      createMobileTextAnim(tl, 4);
    } else {
      // const changeTL = gsap.timeline({
      //   paused: true,
      //   immediateRender: false,
      //   onComplete: () => {
      //     enableScroll();
      //   },
      //   onReverseComplete: () => {
      //     enableScroll();
      //   },
      // });
      const svg4 = scene.getObjectByName('title4-svg') as Object3D;
      const svg4Cn = scene.getObjectByName('title4-cn-svg') as Object3D;
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
          tl.to(material, { opacity: 0, ease: 'power3.inOut', duration: 0.15 });
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
      tl.add(svg4CnAnimGroup, '-=1.2');
      // tl.to(
      //   {},
      //   {
      //     duration: 5,
      //     onComplete: () => {
      //       if (isScrollingRef?.current) return;
      //       disableScroll();
      //       changeTL.play();
      //     },
      //     onReverseComplete: () => {
      //       if (isScrollingRef?.current) return;
      //       disableScroll();
      //       changeTL.reverse();
      //     },
      //   },
      // );
      // tl.to({}, { duration: 5 }); // 停顿
    }
  };
  return {
    createPage1SvgAnim,
    createPage2SvgAnim,
    createPage3SvgAnim,
    createPage4SvgAnim,
  };
};
