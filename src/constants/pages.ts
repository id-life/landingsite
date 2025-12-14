import { NAV_LIST } from '@/components/nav/nav';

export interface ScrollTriggerConfig {
  trigger: string;
  start: string;
  end: string;
  scrub?: boolean;
}

export interface PageConfig {
  readonly id: string;
  readonly scrollTrigger: ScrollTriggerConfig;
  readonly onEnter?: () => void;
  readonly onEnterBack?: () => void;
  readonly onLeave?: () => void;
}

// 页面ID常量，提供类型安全
export const PAGE_IDS = {
  VISION: NAV_LIST[0].id,
  PORTFOLIO: NAV_LIST[1].id,
  SPECTRUM: NAV_LIST[2].id,
  ENGAGEMENT: NAV_LIST[3].id,
  TWIN: NAV_LIST[4].id,
  INSIGHTS: NAV_LIST[5].id,
  VALUE: NAV_LIST[6].id,
} as const;

export type PageId = (typeof PAGE_IDS)[keyof typeof PAGE_IDS];

/**
 * 页面动画配置
 * 将原本散布在 useHomeAnimations 中的硬编码逻辑抽象为配置
 * 注意：只包含原代码中实际存在动画的页面，保持完全一致性
 */
export const PAGE_CONFIGS: readonly PageConfig[] = [
  // Vision 页
  {
    id: PAGE_IDS.VISION,
    scrollTrigger: {
      trigger: `#${PAGE_IDS.VISION}`,
      start: 'center top',
      end: 'bottom top',
      scrub: true,
    },
  },

  // Spectrum 页
  {
    id: PAGE_IDS.SPECTRUM,
    scrollTrigger: {
      trigger: `#${PAGE_IDS.SPECTRUM}`,
      start: 'top bottom',
      end: 'top center',
      scrub: true,
    },
  },

  // Engagement 页
  {
    id: PAGE_IDS.ENGAGEMENT,
    scrollTrigger: {
      trigger: `#${PAGE_IDS.ENGAGEMENT}`,
      start: 'top bottom',
      end: 'top center',
      scrub: true,
    },
  },

  // Twin 页
  {
    id: PAGE_IDS.TWIN,
    scrollTrigger: {
      trigger: `#${PAGE_IDS.TWIN}`,
      start: 'top bottom',
      end: 'top center',
      scrub: true,
    },
  },

  // Insights 页
  {
    id: PAGE_IDS.INSIGHTS,
    scrollTrigger: {
      trigger: `#${PAGE_IDS.INSIGHTS}`,
      start: 'top bottom',
      end: 'top center',
      scrub: true,
    },
  },
] as const;

/**
 * 根据页面 ID 获取页面配置
 */
export const getPageConfig = (pageId: string): PageConfig | undefined => {
  return PAGE_CONFIGS.find((config) => config.id === pageId);
};
