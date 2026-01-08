import { PAGE_IDS } from '@/constants/pages';

// 主题过渡默认配置
export const THEME_TRANSITION_DEFAULTS = {
  duration: 0.5, // timeline 中的相对时长
  ease: 'power2.inOut',
};

// 主题色彩变换配置
export const THEME_TRANSITIONS = {
  // Vision: LIGHT theme (default CSS values)
  [PAGE_IDS.VISION]: {
    '--gradient-from': '#FFFFFF',
    '--gradient-via': '#e5ebf5',
    '--gradient-via-percent': '50%',
    '--gradient-to': '#CBD6EA',
    '--background': '#F0F0F0',
    '--foreground': '#000000',
    '--audio-player': '#2E2F31',
    '--audio-content': '#E2E8F4',
    '--audio-border': '#EEF4FF',
    '--audio-order': '#ffffff',
    '--audio-desc': '#222222',
    '--subscribe-border': '#ffffff',
    '--subscribe-bg': '#ffffff33',
    '--gradient-rotate': '90deg',
  },
  // Portfolio: BLACK_RED theme
  [PAGE_IDS.PORTFOLIO]: {
    '--gradient-from': '#000000',
    '--gradient-via': '#1E0000',
    '--gradient-via-percent': '50%',
    '--gradient-to': '#C111114C',
    '--background': '#000000',
    '--foreground': '#F0F0F0',
    '--audio-player': '#F0F0F0',
    '--audio-content': '#101010',
    '--audio-border': '#1C1C1C',
    '--audio-order': '#222222',
    '--audio-desc': '#999999',
    '--subscribe-border': '#57595C80',
    '--subscribe-bg': '#00000033',
    '--gradient-rotate': '90deg',
  },
  // Spectrum: BLACK_RED_2 theme
  [PAGE_IDS.SPECTRUM]: {
    '--gradient-from': '#000000',
    '--gradient-via': '#C1111111',
    '--gradient-via-percent': '80%',
    '--gradient-to': '#C111114C',
    '--background': '#000000',
    '--foreground': '#F0F0F0',
    '--gradient-rotate': '300deg',
    '--subscribe-border': '#57595C80',
    '--subscribe-bg': '#00000033',
  },
  // Engagement: BLACK theme
  [PAGE_IDS.ENGAGEMENT]: {
    '--gradient-from': '#000000',
    '--gradient-via': '#000000',
    '--gradient-via-percent': '80%', // 与 Spectrum 保持一致，避免跳变
    '--gradient-to': '#000000',
    '--background': '#000000',
    '--foreground': '#FFFFFF',
    '--gradient-rotate': '300deg',
    '--subscribe-border': '#57595C80',
    '--subscribe-bg': '#00000033',
  },
  // Twin: LIGHT theme
  [PAGE_IDS.TWIN]: {
    '--gradient-from': '#FFFFFF',
    '--gradient-via': '#e5ebf5',
    '--gradient-via-percent': '50%',
    '--gradient-to': '#CBD6EA',
    '--background': '#F0F0F0',
    '--foreground': '#000000',
    '--audio-player': '#2E2F31',
    '--audio-content': '#E2E8F4',
    '--audio-border': '#EEF4FF',
    '--audio-order': '#ffffff',
    '--audio-desc': '#222222',
    '--subscribe-border': '#ffffff',
    '--subscribe-bg': '#ffffff33',
    '--gradient-rotate': '90deg',
  },
  // Insights: LIGHT theme
  [PAGE_IDS.INSIGHTS]: {
    '--gradient-from': '#FFFFFF',
    '--gradient-via': '#e5ebf5',
    '--gradient-via-percent': '50%',
    '--gradient-to': '#CBD6EA',
    '--background': '#F0F0F0',
    '--foreground': '#000000',
    '--audio-player': '#2E2F31',
    '--audio-content': '#E2E8F4',
    '--audio-border': '#EEF4FF',
    '--audio-order': '#ffffff',
    '--audio-desc': '#222222',
    '--subscribe-border': '#ffffff',
    '--subscribe-bg': '#ffffff33',
    '--gradient-rotate': '90deg',
  },
} as const;

// ScrollSmoother 默认配置
export const SCROLL_SMOOTHER_DEFAULTS: ScrollSmoother.Vars = {
  wrapper: '#wrapper',
  content: '#content',
  smooth: true,
  effects: false,
  smoothTouch: 0.1,
  // onUpdate: (self) => {
  //   console.log('scroll smoother update', self.progress);
  // },
};
