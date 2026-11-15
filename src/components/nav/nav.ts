export type NavItem = {
  id: string;
  title: string;
  href: string;
};

/** The seven sections of the experience, by the id of their element. */
export type SectionId =
  | 'vision_page'
  | 'portfolio_page'
  | 'insights_page'
  | 'spectrum_page'
  | 'engagement_page'
  | 'twin_page'
  | 'connect_page';

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

/**
 * The sections by id. Use NAV.engagement_page, never NAV_LIST[4]: positions change when the sections are
 * reordered. Insights moved to index 2 on 2026-01-08 and every positional lookup written before that
 * pointed one section too early (Presence deep links landed on Spectrum). An ESLint rule bans
 * NAV_LIST[<number>] outside this file.
 */
export const NAV = Object.fromEntries(NAV_LIST.map((item) => [item.id, item])) as Record<SectionId, NavItem>;

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
