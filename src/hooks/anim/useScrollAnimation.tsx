import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SCROLL_TRIGGER_DEFAULTS, ANIMATION_PRESETS } from '@/utils/gsap-config';

interface ScrollAnimationConfig {
  /** 触发器选择器 */
  trigger: string;
  /** ScrollTrigger 配置 */
  scrollTrigger?: ScrollTrigger.Vars;
  /** 动画元素选择器 */
  target?: string;
  /** 动画配置 */
  animation?: gsap.TweenVars;
  /** 入场回调 */
  onEnter?: () => void;
  /** 退场回调 */
  onLeave?: () => void;
  /** 依赖项 */
  dependencies?: any[];
}

/**
 * 滚动触发动画的 Hook
 */
export function useScrollAnimation({
  trigger,
  scrollTrigger = {},
  target = trigger,
  animation = ANIMATION_PRESETS.entrance,
  onEnter,
  onLeave,
  dependencies = [],
}: ScrollAnimationConfig) {
  const { contextSafe } = useGSAP();

  const createScrollTrigger = contextSafe(() => {
    return ScrollTrigger.create({
      trigger,
      ...SCROLL_TRIGGER_DEFAULTS,
      ...scrollTrigger,
      onEnter: () => {
        onEnter?.();
      },
      onLeave: () => {
        onLeave?.();
      },
      onEnterBack: () => {
        onEnter?.();
      },
      onLeaveBack: () => {
        onLeave?.();
      },
    });
  });

  useGSAP(
    () => {
      createScrollTrigger();
    },
    { dependencies },
  );

  return { createScrollTrigger };
}

/**
 * 页面切换动画的 Hook
 */
export function usePageTransition(pageId: string, onPageChange?: (pageId: string) => void, config?: ScrollTrigger.Vars) {
  const { contextSafe } = useGSAP();

  const createPageTrigger = contextSafe(() => {
    return ScrollTrigger.create({
      trigger: `#${pageId}`,
      ...SCROLL_TRIGGER_DEFAULTS,
      ...config,
      onEnter: () => {
        onPageChange?.(pageId);
      },
      onEnterBack: () => {
        onPageChange?.(pageId);
      },
    });
  });

  return { createPageTrigger };
}
