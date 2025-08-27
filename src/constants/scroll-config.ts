// 统一的滚动动画配置
export const SCROLL_ANIMATION_CONFIG = {
  // 动画持续时间（毫秒）
  DURATION: {
    FAST: 2000, // Vision, Portfolio, Spectrum, Engagement
    SLOW: 3000, // Twin, Value
  },

  // 节流时间（毫秒）
  THROTTLE_TIME: 500,

  // 滚动状态重置延迟（毫秒）
  RESET_DELAY: 2500,

  // 最小速度阈值
  MIN_VELOCITY: 5,

  // 动画缓动函数
  EASING: {
    DEFAULT: 'power4.inOut',
    SMOOTH: 'power3.out',
  },
} as const;

// 滚动状态枚举
export enum ScrollState {
  IDLE = 'idle',
  SCROLLING = 'scrolling',
  LOCKED = 'locked',
}
