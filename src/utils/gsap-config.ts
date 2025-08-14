// 动画默认配置
export const ANIMATION_DEFAULTS = {
  duration: 0.3,
  ease: 'power2.out',
  stagger: 0.1,
} as const;

// ScrollTrigger 通用配置
export const SCROLL_TRIGGER_DEFAULTS = {
  start: 'top top',
  end: '+=300%',
  scrub: true,
  pin: true,
} as const;

// 常用动画预设
export const ANIMATION_PRESETS = {
  entrance: {
    from: { opacity: 0, y: 50, rotateX: 45, rotateY: 15 },
    to: { opacity: 1, y: 0, rotateX: 0, rotateY: 0 },
    duration: 0.6,
    ease: 'power2.out',
  },
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: 0.4,
  },
  scaleHover: {
    in: { scale: 1.1, duration: 0.3, ease: 'power2.out' },
    out: { scale: 1, duration: 0.3, ease: 'power2.out' },
  },
  slideUp: {
    from: { y: '100%', opacity: 0 },
    to: { y: '0%', opacity: 1 },
    duration: 0.5,
    ease: 'power2.out',
  },
} as const;

// 主题色彩变换配置
export const THEME_TRANSITIONS = {
  vision: {
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
  },
  spectrum: {
    '--gradient-via': '#C1111111',
    '--gradient-to': '#C111114C',
    '--gradient-via-percent': '80%',
    '--gradient-rotate': '300deg',
    '--subscribe-border': '#57595C80',
    '--subscribe-bg': '#00000033',
  },
  engagement: {
    '--gradient-from': '#000000',
    '--gradient-via': '#000000',
    '--gradient-via-percent': '50%',
    '--gradient-to': '#000000',
    '--background': '#000000',
    '--foreground': '#FFFFFF',
    '--subscribe-border': '#57595C80',
    '--subscribe-bg': '#00000033',
  },
  twin: {
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
  },
} as const;

// ScrollSmoother 默认配置
export const SCROLL_SMOOTHER_DEFAULTS = {
  wrapper: '#wrapper',
  content: '#content',
  smooth: 1,
  effects: false,
  smoothTouch: 0.1,
} as const;
