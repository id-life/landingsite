// 统一的滚动动画配置
export const SCROLL_ANIMATION_CONFIG = {
  // Section-to-section transition length (ms). Was 2000 / 3000 ms with input locked throughout,
  // 2 to 6x longer than motion guidance (NN/g 100-500 ms, Material 3 tops out at 1000 ms).
  DURATION: {
    FAST: 900, // Vision, Portfolio, Spectrum, Engagement, Insights
    SLOW: 1200, // Twin, Connect (camera move through the 3D scene)
  },

  // 节流时间（毫秒）
  THROTTLE_TIME: 100,

  // 最小速度阈值
  MIN_VELOCITY: 0.01,
  // 动画缓动函数
  EASING: {
    DEFAULT: 'power2.inOut',
  },
} as const;

/** True when the visitor asked the OS for less motion. */
export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
}

/** Section transition duration in seconds; near-instant for visitors who prefer reduced motion. */
export function sectionDuration(kind: keyof typeof SCROLL_ANIMATION_CONFIG.DURATION) {
  return prefersReducedMotion() ? 0.05 : SCROLL_ANIMATION_CONFIG.DURATION[kind] / 1000;
}

// 滚动状态枚举
export enum ScrollState {
  IDLE = 'idle',
  SCROLLING = 'scrolling',
  LOCKED = 'locked',
}
