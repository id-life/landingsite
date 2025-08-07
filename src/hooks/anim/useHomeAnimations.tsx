import { currentPageAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { SCROLL_SMOOTHER_DEFAULTS, THEME_TRANSITIONS } from '@/utils/gsap-config';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSetAtom } from 'jotai';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

/**
 * Home 页面动画管理 Hook
 */
export function useHomeAnimations() {
  const setCurrentPage = useSetAtom(currentPageAtom);
  const { contextSafe } = useGSAP();

  // 创建视觉动画序列
  const createVisionAnimation = contextSafe(() => {
    const root = document.documentElement;
    const visionTL = gsap.timeline({
      scrollTrigger: {
        trigger: `#${NAV_LIST[0].id}`,
        start: 'center top',
        end: 'bottom top',
        scrub: true,
        onEnter: () => {
          setCurrentPage(NAV_LIST[0]);
        },
        onEnterBack: () => {
          setCurrentPage(NAV_LIST[0]);
        },
      },
    });
    visionTL.to('.base-background2', { opacity: 0 });

    // 主题颜色转换
    visionTL.to(root, THEME_TRANSITIONS.vision);

    return visionTL;
  });

  // 创建 Spectrum 动画序列
  const createSpectrumAnimation = contextSafe(() => {
    const root = document.documentElement;
    const spectrumTL = gsap.timeline({
      scrollTrigger: {
        trigger: `#${NAV_LIST[2].id}`,
        start: 'top bottom',
        end: 'top center',
        scrub: true,
      },
    });

    spectrumTL.to(root, {
      ...THEME_TRANSITIONS.spectrum,
      duration: 3,
    });

    return spectrumTL;
  });

  // 创建 Engagement 动画序列
  const createEngagementAnimation = contextSafe(() => {
    const root = document.documentElement;
    const engagementTL = gsap.timeline({
      scrollTrigger: {
        trigger: `#${NAV_LIST[3].id}`,
        start: 'top bottom',
        end: 'top center',
        scrub: true,
      },
    });

    engagementTL.to(root, {
      ...THEME_TRANSITIONS.engagement,
      duration: 0.01,
    });

    engagementTL.to(root, THEME_TRANSITIONS.engagement);

    return engagementTL;
  });

  // 创建 Twin 动画序列
  const createTwinAnimation = contextSafe(() => {
    const root = document.documentElement;

    const twinTL = gsap.timeline({
      scrollTrigger: {
        trigger: `#${NAV_LIST[4].id}`,
        start: 'top bottom',
        end: 'top center',
        scrub: true,
      },
    });
    // 主题转换到白色
    twinTL.to(root, THEME_TRANSITIONS.twin);

    // 背景透明度恢复
    twinTL.to('.base-background2', { opacity: 1 });

    return twinTL;
  });

  // 初始化所有动画
  const initializeAnimations = contextSafe(() => {
    // 初始化 ScrollSmoother
    ScrollSmoother.create(SCROLL_SMOOTHER_DEFAULTS);

    // 创建各页面动画
    createVisionAnimation();
    createSpectrumAnimation();
    createEngagementAnimation();
    createTwinAnimation();
  });

  return {
    initializeAnimations,
  };
}
