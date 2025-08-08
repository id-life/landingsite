// 动画时长配置
export const ANIMATION_DURATIONS = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.6,
  very_slow: 1.0,
} as const;

// 缓动函数配置
export const EASING_FUNCTIONS = {
  smooth: 'power2.out',
  bounce: 'back.out(1.7)',
  elastic: 'elastic.out(1, 0.3)',
  sharp: 'power4.inOut',
  linear: 'none',
} as const;

// 交错动画配置
export const STAGGER_CONFIGS = {
  fast: 0.05,
  normal: 0.1,
  slow: 0.2,
  grid: { amount: 0.1, from: 'center' },
} as const;

// 视差滚动配置
export const PARALLAX_CONFIGS = {
  subtle: { y: -50, ease: 'none' },
  medium: { y: -100, ease: 'none' },
  strong: { y: -200, ease: 'none' },
} as const;

// 页面切换动画配置
export const PAGE_TRANSITION_CONFIGS = {
  default: {
    duration: 1.5,
    ease: 'power2.inOut',
  },
  fast: {
    duration: 1.0,
    ease: 'power2.out',
  },
  slow: {
    duration: 2.0,
    ease: 'power1.inOut',
  },
} as const;
