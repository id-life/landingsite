export type NavItem = {
  id: string;
  title: string;
};
export const NAV_LIST: NavItem[] = [
  {
    id: 'vision_page',
    title: 'mission 使命',
  },
  {
    id: 'portfolio_page',
    title: 'portfolio 投资',
  },
  {
    id: 'spectrum_page',
    title: 'spectrum 谱系',
  },
  {
    id: 'engagement_page',
    title: 'presence 印迹',
  },
  {
    id: 'twin_page',
    title: 'digital twin 孪生',
  },
  {
    id: 'value_page',
    title: 'value 信念',
  },
];

export const HAS_INNER_PAGE_LIST = [NAV_LIST[5].id] as const; // 有小进度条的
export const BLACK_ARROW_LIST = [NAV_LIST[1].id, NAV_LIST[3].id] as const; // 深色背景箭头样式不一样
