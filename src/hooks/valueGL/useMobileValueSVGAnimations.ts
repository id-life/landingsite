import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
gsap.registerPlugin(SplitText);

export const useMobileValueSVGAnimations = () => {
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
    createMobileTextAnim(tl, 1);
  };

  const createPage2SvgAnim = (tl: GSAPTimeline) => {
    createMobileTextAnim(tl, 2);
  };

  const createPage3SvgAnim = (tl: GSAPTimeline) => {
    createMobileTextAnim(tl, 3);
  };

  const createPage4SvgAnim = (tl: GSAPTimeline) => {
    createMobileTextAnim(tl, 4);
  };
  return {
    createPage1SvgAnim,
    createPage2SvgAnim,
    createPage3SvgAnim,
    createPage4SvgAnim,
  };
};
