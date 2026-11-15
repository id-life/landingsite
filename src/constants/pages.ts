import { NAV } from '@/components/nav/nav';

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

// 页面ID常量，提供类型安全 (新顺序: Mission, Portfolio, Insights, Spectrum, Presence, Twin, Connect)
export const PAGE_IDS = {
  VISION: NAV.vision_page.id,
  PORTFOLIO: NAV.portfolio_page.id,
  INSIGHTS: NAV.insights_page.id,
  SPECTRUM: NAV.spectrum_page.id,
  ENGAGEMENT: NAV.engagement_page.id,
  TWIN: NAV.twin_page.id,
  VALUE: NAV.connect_page.id,
} as const;

export type PageId = (typeof PAGE_IDS)[keyof typeof PAGE_IDS];

/**
 * 页面动画配置
 * 将原本散布在 useHomeAnimations 中的硬编码逻辑抽象为配置
 * 注意：只包含原代码中实际存在动画的页面，保持完全一致性
 */
export const PAGE_CONFIGS: readonly PageConfig[] = [
  // Vision uses default CSS LIGHT theme - no ScrollTrigger needed

  // Portfolio 页
  {
    id: PAGE_IDS.PORTFOLIO,
    scrollTrigger: {
      trigger: `#${PAGE_IDS.PORTFOLIO}`,
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
] as const;

/**
 * 根据页面 ID 获取页面配置
 */
export const getPageConfig = (pageId: string): PageConfig | undefined => {
  return PAGE_CONFIGS.find((config) => config.id === pageId);
};
