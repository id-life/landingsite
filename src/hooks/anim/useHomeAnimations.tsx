import { currentPageAtom } from '@/atoms';
import { NAV_LIST } from '@/components/nav/nav';
import { PAGE_CONFIGS, PAGE_IDS, type PageConfig } from '@/constants/pages';
import { SCROLL_SMOOTHER_DEFAULTS, THEME_TRANSITIONS } from '@/utils/gsap-config';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useSetAtom } from 'jotai';
import { useCallback } from 'react';

// 主题处理映射表 - 将特殊逻辑抽象为配置
const THEME_HANDLERS = {
  [PAGE_IDS.VISION]: (timeline: gsap.core.Timeline, root: HTMLElement) => {
    // Vision 页面：先隐藏背景再切换主题
    timeline.to('.base-background2', { opacity: 0 });
    timeline.to(root, THEME_TRANSITIONS[PAGE_IDS.VISION]);
  },
  [PAGE_IDS.SPECTRUM]: (timeline: gsap.core.Timeline, root: HTMLElement) => {
    // Spectrum 页面：使用较长的切换时间
    timeline.to(root, {
      ...THEME_TRANSITIONS[PAGE_IDS.SPECTRUM],
      duration: 3,
    });
  },
  [PAGE_IDS.ENGAGEMENT]: (timeline: gsap.core.Timeline, root: HTMLElement) => {
    // Engagement 页面：快速预设后正常切换
    timeline.to(root, {
      ...THEME_TRANSITIONS[PAGE_IDS.ENGAGEMENT],
      duration: 0.01,
    });
    timeline.to(root, THEME_TRANSITIONS[PAGE_IDS.ENGAGEMENT]);
  },
  [PAGE_IDS.TWIN]: (timeline: gsap.core.Timeline, root: HTMLElement) => {
    // Twin 页面：切换主题后显示背景
    timeline.to(root, THEME_TRANSITIONS[PAGE_IDS.TWIN]);
    timeline.to('.base-background2', { opacity: 1 });
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
  const createConfigBasedAnimation = contextSafe((config: PageConfig) => {
    try {
      const timeline = gsap.timeline({
        scrollTrigger: {
          ...config.scrollTrigger,
          onEnter: () => handlePageChange(config.id, config.onEnter),
          onEnterBack: () => handlePageChange(config.id, config.onEnterBack),
          onLeave: config.onLeave,
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
      const animations = PAGE_CONFIGS.map((config) => {
        return createConfigBasedAnimation(config);
      }).filter(Boolean);

      console.log(`Successfully initialized ${animations.length} page animations`);
    } catch (error) {
      console.error('Failed to initialize animations:', error);
    }
  });

  return {
    initializeAnimations,
  };
}
