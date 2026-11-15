import { DURATION, EASE } from '@/motion/tokens';

// 统一的滚动动画配置
export const SCROLL_ANIMATION_CONFIG = {
  // Every section-to-section transition plays the section token (src/motion/tokens.ts, MOT-08). They were
  // 2000 / 3000 ms with input locked, then 900 / 1200 ms after wave 0.
  DURATION: {
    FAST: DURATION.section, // Vision, Portfolio, Spectrum, Engagement, Insights
    SLOW: DURATION.section, // Twin, Connect (camera move through the 3D scene)
  },

  // 节流时间（毫秒）
  THROTTLE_TIME: 100,

  // 最小速度阈值
  MIN_VELOCITY: 0.01,
  // 动画缓动函数
  EASING: {
    DEFAULT: EASE.inOut,
  },
} as const;

/** True when the visitor asked the OS for less motion. */
export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
}

/** Section transition duration in seconds; near-instant for visitors who prefer reduced motion. */
export function sectionDuration(kind: keyof typeof SCROLL_ANIMATION_CONFIG.DURATION) {
  return prefersReducedMotion() ? DURATION.instant : SCROLL_ANIMATION_CONFIG.DURATION[kind];
}
