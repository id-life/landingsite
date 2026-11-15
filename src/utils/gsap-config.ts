import { PAGE_IDS } from '@/constants/pages';
import { beats, EASE } from '@/motion/tokens';
import { themes } from '@/styles/tokens';

// 主题过渡默认配置
// Inside the scrubbed section timelines, so the length is in beats (a share of the section's scroll).
export const THEME_TRANSITION_DEFAULTS = {
  duration: beats(0.5),
  ease: EASE.inOut,
};

// 主题色彩变换配置
export const THEME_TRANSITIONS = {
  // Vision: LIGHT theme (default CSS values)
  [PAGE_IDS.VISION]: { ...themes.light, '--gradient-via-percent': '50%', '--gradient-rotate': '90deg' },
  // Portfolio: BLACK_RED theme
  [PAGE_IDS.PORTFOLIO]: { ...themes.blackRed, '--gradient-via-percent': '50%', '--gradient-rotate': '90deg' },
  // Spectrum: BLACK_RED_2 theme
  [PAGE_IDS.SPECTRUM]: { ...themes.blackRed2, '--gradient-via-percent': '80%', '--gradient-rotate': '300deg' },
  // Engagement: BLACK theme
  // '--gradient-via-percent' matches Spectrum's 80% so the gradient does not jump.
  [PAGE_IDS.ENGAGEMENT]: { ...themes.black, '--gradient-via-percent': '80%', '--gradient-rotate': '300deg' },
  // Twin: LIGHT theme
  [PAGE_IDS.TWIN]: { ...themes.light, '--gradient-via-percent': '50%', '--gradient-rotate': '90deg' },
  // Insights: LIGHT theme
  [PAGE_IDS.INSIGHTS]: { ...themes.light, '--gradient-via-percent': '50%', '--gradient-rotate': '90deg' },
} as const;

// ScrollSmoother 默认配置
// smooth was true (= 0.8 s of trailing lag after every scroll); 0.5 s keeps the glide and makes a
// section change settle about 0.3 s sooner. No smoothing for visitors who prefer reduced motion.
const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
export const SCROLL_SMOOTHER_DEFAULTS: ScrollSmoother.Vars = {
  wrapper: '#wrapper',
  content: '#content',
  smooth: reduceMotion ? 0 : 0.5,
  effects: false,
  smoothTouch: 0.1,
  // ScrollSmoother scrolls any focused element that is off-screen into view. For focus outside the scrolled
  // content (the fixed nav, the SUBSCRIBE dialog animating in, the contact footer) that only jumps the page
  // to another section, so it is limited to elements inside #content.
  onFocusIn: (_smoother, event) => event.target instanceof Element && event.target.closest('#content') !== null,
};
