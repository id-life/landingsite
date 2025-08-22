export type NavItem = {
  id: string;
  title: string;
  href: string;
};
export const NAV_LIST: NavItem[] = [
  {
    id: 'vision_page',
    title: 'mission 使命',
    href: '/',
  },
  {
    id: 'portfolio_page',
    title: 'portfolio 投资',
    href: '/portfolio',
  },
  {
    id: 'spectrum_page',
    title: 'spectrum 谱系',
    href: '/spectrum',
  },
  {
    id: 'engagement_page',
    title: 'presence 印迹',
    href: '/presence',
  },
  {
    id: 'twin_page',
    title: 'digital twin 孪生',
    href: '/digitaltwin',
  },
  {
    id: 'value_page',
    title: 'value 信念',
    href: '/value',
  },
];

export const HAS_INNER_PAGE_LIST = [NAV_LIST[5].id] as const; // 有小进度条的
export const BLACK_ARROW_LIST = [NAV_LIST[1].id, NAV_LIST[2].id, NAV_LIST[3].id] as const; // 深色背景箭头样式不一样
