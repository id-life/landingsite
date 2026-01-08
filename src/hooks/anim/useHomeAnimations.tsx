import { currentPageAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { PAGE_CONFIGS, PAGE_IDS, type PageConfig } from '@/constants/pages';
import { SCROLL_SMOOTHER_DEFAULTS, THEME_TRANSITION_DEFAULTS, THEME_TRANSITIONS } from '@/utils/gsap-config';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useSetAtom } from 'jotai';
import { useCallback } from 'react';

// 背景点阵过渡配置
const BG_TRANSITION = {
  duration: THEME_TRANSITION_DEFAULTS.duration,
  ease: THEME_TRANSITION_DEFAULTS.ease,
};

// 主题处理映射表 - 将特殊逻辑抽象为配置
const THEME_HANDLERS = {
  [PAGE_IDS.VISION]: (timeline: gsap.core.Timeline, root: HTMLElement) => {
    // Vision 页面：浅色主题，显示背景点阵
    timeline.to(root, {
      ...THEME_TRANSITIONS[PAGE_IDS.VISION],
      ...THEME_TRANSITION_DEFAULTS,
    });
    timeline.to('.base-background2', { opacity: 1, ...BG_TRANSITION }, '<');
  },
  [PAGE_IDS.PORTFOLIO]: (timeline: gsap.core.Timeline, root: HTMLElement) => {
    // Portfolio 页面：先隐藏背景再切换到黑红主题
    timeline.to('.base-background2', { opacity: 0, ...BG_TRANSITION });
    timeline.to(
      root,
      {
        ...THEME_TRANSITIONS[PAGE_IDS.PORTFOLIO],
        ...THEME_TRANSITION_DEFAULTS,
      },
      '<',
    );
  },
  [PAGE_IDS.INSIGHTS]: (timeline: gsap.core.Timeline, root: HTMLElement) => {
    // Insights 页面：浅色主题，显示背景
    timeline.to(root, {
      ...THEME_TRANSITIONS[PAGE_IDS.INSIGHTS],
      ...THEME_TRANSITION_DEFAULTS,
    });
    timeline.to('.base-background2', { opacity: 1, ...BG_TRANSITION }, '<');
  },
  [PAGE_IDS.SPECTRUM]: (timeline: gsap.core.Timeline, root: HTMLElement) => {
    // Spectrum 页面：隐藏背景，使用较长的切换时间
    timeline.to('.base-background2', { opacity: 0, ...BG_TRANSITION });
    timeline.to(
      root,
      {
        ...THEME_TRANSITIONS[PAGE_IDS.SPECTRUM],
        duration: 1,
        ease: THEME_TRANSITION_DEFAULTS.ease,
      },
      '<',
    );
  },
  [PAGE_IDS.ENGAGEMENT]: (timeline: gsap.core.Timeline, root: HTMLElement) => {
    // Engagement 页面：隐藏背景，平滑切换
    timeline.to('.base-background2', { opacity: 0, ...BG_TRANSITION });
    timeline.to(
      root,
      {
        ...THEME_TRANSITIONS[PAGE_IDS.ENGAGEMENT],
        ...THEME_TRANSITION_DEFAULTS,
      },
      '<',
    );
  },
  [PAGE_IDS.TWIN]: (timeline: gsap.core.Timeline, root: HTMLElement) => {
    // Twin 页面：切换主题后显示背景
    timeline.to(root, {
      ...THEME_TRANSITIONS[PAGE_IDS.TWIN],
      ...THEME_TRANSITION_DEFAULTS,
    });
    timeline.to('.base-background2', { opacity: 1, ...BG_TRANSITION }, '<');
  },
} as const;

/**
 * Home 页面动画管理
 */
export function useHomeAnimations() {
  const setCurrentPage = useSetAtom(currentPageAtom);
  const { contextSafe } = useGSAP();
  // 处理页面状态更新的统一逻辑
  const handlePageChange = useCallback(
    (pageId: string, callback?: () => void) => {
      const navItem = NAV_LIST.find((item) => item.id === pageId);
      if (navItem) {
        setCurrentPage(navItem);
      }
      callback?.();
    },
    [setCurrentPage],
  );

  // 处理主题动画
  const applyThemeAnimation = useCallback((timeline: gsap.core.Timeline, config: PageConfig) => {
    const root = document.documentElement;
    const themeHandler = THEME_HANDLERS[config.id as keyof typeof THEME_HANDLERS];
    themeHandler?.(timeline, root);
  }, []);

  // 创建基于配置的动画函数
  const createConfigBasedAnimation = contextSafe((config: PageConfig, index: number) => {
    try {
      // 获取上一个页面 ID（用于 onLeaveBack）
      // index 0 是 Portfolio，上一个是 Vision (NAV_LIST[0])
      const previousPageId = index === 0 ? NAV_LIST[0].id : PAGE_CONFIGS[index - 1].id;

      const timeline = gsap.timeline({
        scrollTrigger: {
          ...config.scrollTrigger,
          onEnter: () => handlePageChange(config.id, config.onEnter),
          onEnterBack: () => handlePageChange(config.id, config.onEnterBack),
          onLeave: config.onLeave,
          onLeaveBack: () => handlePageChange(previousPageId),
        },
      });

      // 应用主题动画
      applyThemeAnimation(timeline, config);
      return timeline;
    } catch (error) {
      console.error(`Failed to create animation for page ${config.id}:`, error);
      return null;
    }
  });

  // 初始化所有动画
  const initializeAnimations = contextSafe(() => {
    try {
      // 初始化 ScrollSmoother
      ScrollSmoother.create(SCROLL_SMOOTHER_DEFAULTS);

      // 基于配置创建所有页面动画
      PAGE_CONFIGS.forEach((config, index) => {
        createConfigBasedAnimation(config, index);
      });
    } catch (error) {
      console.error('Failed to initialize animations:', error);
    }
  });

  return {
    initializeAnimations,
  };
}
