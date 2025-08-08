import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

export const useMobileValueSVGAnimations = () => {
  // const createMobileTextAnim = (
  //   tl: GSAPTimeline,
  //   index: number,
  //   opts?: { hasRedEnterAnim?: boolean; hasRedExitAnim?: boolean },
  // ) => {
  //   const { hasRedEnterAnim = true, hasRedExitAnim = true } = opts || {};
  //   const value1TextRedEn = new SplitText(`#value-${index}-svg-mobile .value-text-en.text-red-500`, {
  //     type: 'lines,words,chars',
  //   });
  //   const value1TextNormalEn = new SplitText(`#value-${index}-svg-mobile .value-text-en:not(.text-red-500)`, {
  //     type: 'lines,words,chars',
  //   });

  //   // 中文文本
  //   const value1TextCn = new SplitText(`#value-${index}-svg-mobile .value-text-cn`, {
  //     type: 'lines,words,chars',
  //   });

  //   if (!value1TextRedEn?.chars?.length || !value1TextNormalEn?.chars?.length) return;
  //   if (!hasRedEnterAnim) {
  //     //  红字&正常字直接进入。
  //     tl.from([value1TextRedEn.chars, value1TextNormalEn.chars], {
  //       opacity: 1,
  //     });
  //   } else {
  //     // 红字&正常字渐入
  //     tl.fromTo(
  //       [value1TextRedEn.chars, value1TextNormalEn.chars],
  //       {
  //         opacity: 0,
  //         // y: 50,
  //       },
  //       {
  //         opacity: 1,
  //         duration: 0.8,
  //         stagger: 0.2,
  //       },
  //     );
  //   }
  //   if (hasRedExitAnim) {
  //     // 只让红字淡出
  //     tl.to(value1TextRedEn.chars, {
  //       opacity: 0,
  //       // y: -50,
  //       duration: 0.8,
  //       stagger: 0.2,
  //     })
  //       // 中文淡入
  //       .fromTo(
  //         value1TextCn.chars,
  //         {
  //           opacity: 0,
  //           // y: 50,
  //         },
  //         {
  //           opacity: 1,
  //           // y: 0,
  //           duration: 0.8,
  //           stagger: 0.2,
  //           onComplete: () => {
  //             console.log('SVG Complete');
  //           },
  //         },
  //         '-=3',
  //       );
  //   }
  // };

  const createPage1SvgAnim = (tl: GSAPTimeline) => {
    const value1TextRedEn = new SplitText(`#value-1-svg-mobile .value-text-en.text-red-500`, {
      type: 'lines,words,chars',
    });
    const value1TextRedEn1 = new SplitText(`#value-1-svg-mobile .value-text-en-1`, {
      type: 'lines,words,chars',
    });
    const value1TextRedEn2 = new SplitText(`#value-1-svg-mobile .value-text-en-2`, {
      type: 'lines,words,chars',
    });
    const value1TextNormalEn = new SplitText(`#value-1-svg-mobile .value-text-en:not(.text-red-500)`, {
      type: 'lines,words,chars',
    });
    // 中文文本
    const value1TextCn1 = new SplitText(`#value-1-svg-mobile .value-text-cn-1`, {
      type: 'lines,words,chars',
    });
    const value1TextCn2 = new SplitText(`#value-1-svg-mobile .value-text-cn-2`, {
      type: 'lines,words,chars',
    });

    if (!value1TextRedEn1?.chars?.length || !value1TextNormalEn?.chars?.length) return;
    //  红字&正常字直接进入。
    tl.from([value1TextRedEn.chars, value1TextNormalEn.chars], {
      opacity: 1,
    });
    const tl1 = gsap.timeline();
    const tl2 = gsap.timeline();
    // 红字英文淡出
    tl1.to(value1TextRedEn1.chars, {
      opacity: 0,
      // y: -50,
      duration: 0.8,
      stagger: 0.8,
    });
    tl2.to(
      value1TextRedEn2.chars,
      {
        opacity: 0,
        // y: -50,
        duration: 0.8,
        stagger: -0.8,
      },
      '<',
    );
    // 红字中文淡入
    tl1.fromTo(
      value1TextCn1.chars,
      {
        opacity: 0,
        // y: 50,
      },
      {
        opacity: 1,
        // y: 0,
        duration: 0.8,
        stagger: 0.8,
      },
      '-=4',
    );
    tl2.fromTo(
      value1TextCn2.chars,
      {
        opacity: 0,
        // y: 50,
      },
      {
        opacity: 1,
        // y: 0,
        duration: 0.8,
        stagger: -0.8,
      },
      '-=2.4',
    );
    tl1.timeScale(0.5);
    tl2.timeScale(0.5);
    tl.add(tl1);
    tl.add(tl2, '<+=3');
  };

  const createPage2SvgAnim = (tl: GSAPTimeline) => {
    const valueTextRedEn = new SplitText(`#value-2-svg-mobile .value-text-en.text-red-500`, {
      type: 'lines,words,chars',
    });
    const valueTextRedEn1 = new SplitText(`#value-2-svg-mobile .value-text-en-1`, {
      type: 'lines,words,chars',
    });
    const valueTextRedEn2 = new SplitText(`#value-2-svg-mobile .value-text-en-2`, {
      type: 'lines,words,chars',
    });
    const valueTextRedEn3 = new SplitText(`#value-2-svg-mobile .value-text-en-3`, {
      type: 'lines,words,chars',
    });
    const valueTextBlackEn4 = new SplitText(`#value-2-svg-mobile .value-text-en-4`, {
      type: 'lines,words,chars',
    });
    const valueTextNormalEn = new SplitText(`#value-2-svg-mobile .value-text-en:not(.text-red-500)`, {
      type: 'lines,words,chars',
    });
    // 中文文本
    const valueTextCn1 = new SplitText(`#value-2-svg-mobile .value-text-cn-1`, {
      type: 'lines,words,chars',
    });
    const valueTextCn2 = new SplitText(`#value-2-svg-mobile .value-text-cn-2`, {
      type: 'lines,words,chars',
    });
    const valueTextCn3 = new SplitText(`#value-2-svg-mobile .value-text-cn-3`, {
      type: 'lines,words,chars',
    });

    if (!valueTextRedEn1?.chars?.length || !valueTextNormalEn?.chars?.length) return;
    const tl1 = gsap.timeline();
    const tl2 = gsap.timeline();
    const tl3 = gsap.timeline();
    // 红字英文淡出
    tl1.to([...valueTextRedEn1.chars, ...valueTextBlackEn4.chars], {
      opacity: 0,
      // y: -50,
      duration: 0.8,
      stagger: 0.8,
    });
    tl2.to(
      valueTextRedEn2.chars,
      {
        opacity: 0,
        // y: -50,
        duration: 0.8,
        stagger: -0.8,
      },
      '<',
    );
    tl3.to(
      valueTextRedEn3.chars,
      {
        opacity: 0,
        // y: -50,
        duration: 0.8,
        stagger: -0.8,
      },
      '<',
    );
    // 红字中文淡入
    tl1.fromTo(
      valueTextCn1.chars,
      {
        opacity: 0,
        // y: 50,
      },
      {
        opacity: 1,
        // y: 0,
        duration: 0.8,
        stagger: 0.8,
      },
      '-=3',
    );
    tl2.fromTo(
      valueTextCn2.chars,
      {
        opacity: 0,
        // y: 50,
      },
      {
        opacity: 1,
        // y: 0,
        duration: 0.8,
        stagger: -0.8,
      },
      '-=1',
    );
    tl3.fromTo(
      valueTextCn3.chars,
      {
        opacity: 0,
        // y: 50,
      },
      {
        opacity: 1,
        // y: 0,
        duration: 0.8,
        stagger: -0.8,
      },
      '-=3.4',
    );
    tl1.timeScale(0.5);
    tl2.timeScale(0.5);
    tl3.timeScale(0.5);
    tl.add(tl1);
    tl.add(tl2, '<+=2');
    tl.add(tl3, '<');
  };

  const createPage3SvgAnim = (tl: GSAPTimeline) => {
    tl.fromTo('#value-3-svg-mobile p', { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power3.out' });
  };

  return {
    createPage1SvgAnim,
    createPage2SvgAnim,
    createPage3SvgAnim,
  };
};
