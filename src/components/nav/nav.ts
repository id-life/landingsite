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
    id: 'insights_page',
    title: 'insights 洞见',
    href: '/insights',
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
    id: 'connect_page',
    title: 'CONNECT 联结',
    href: '/connect',
  },
];

// 有小进度条的 (Portfolio, Spectrum, Insights) - 使用 ID 字符串避免索引依赖
export const HAS_INNER_PAGE_LIST = ['portfolio_page', 'spectrum_page', 'insights_page'] as const;
// 深色背景箭头样式不一样 (Portfolio, Spectrum, Presence)
export const BLACK_ARROW_LIST = ['portfolio_page', 'spectrum_page', 'engagement_page'] as const;

// Type-safe helper functions to avoid `as readonly string[]` type assertions
export function hasInnerPage(pageId: string): boolean {
  return (HAS_INNER_PAGE_LIST as readonly string[]).includes(pageId);
}

export function hasBlackArrow(pageId: string): boolean {
  return (BLACK_ARROW_LIST as readonly string[]).includes(pageId);
}
