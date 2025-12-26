// 统一的滚动动画配置
export const SCROLL_ANIMATION_CONFIG = {
  // 动画持续时间（毫秒）
  DURATION: {
    FAST: 2000, // Vision, Portfolio, Spectrum, Engagement, Insights
    SLOW: 3000, // Twin, Connect
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

// 滚动状态枚举
export enum ScrollState {
  IDLE = 'idle',
  SCROLLING = 'scrolling',
  LOCKED = 'locked',
}
