import { NAV_LIST, type NavItem } from '@/components/nav/nav';

/** A page of the site that is not a section of the experience. */
export type PageLink = { id: 'news' | 'podcast'; title: string; href: string };

// Labels as the phone menu has shown them since wave 0; the owner's IA decision (CON) may rename or regroup them.
export const NEWS_LINK: PageLink = { id: 'news', title: 'news 新闻', href: '/news' };
export const PODCAST_LINK: PageLink = { id: 'podcast', title: 'podcast 播客', href: '/podcast' };

/**
 * The site's primary navigation (NAV-04), the same on every route: the seven sections of the experience, then
 * News and Podcast. The header, the phone menu and the footer all render this list.
 */
export type SiteNavItem = NavItem | PageLink;
export const SITE_NAV: ReadonlyArray<SiteNavItem> = [...NAV_LIST, NEWS_LINK, PODCAST_LINK];

export function isSection(item: NavItem | PageLink): item is NavItem {
  return NAV_LIST.some((section) => section.id === item.id);
}

/** The content page a pathname belongs to (/news/123 is News, /podcast/long-talk is Podcast), or null. */
export function pageOfPath(pathname: string | null): PageLink['id'] | null {
  if (!pathname) return null;
  for (const link of [NEWS_LINK, PODCAST_LINK]) {
    if (pathname === link.href || pathname.startsWith(`${link.href}/`)) return link.id;
  }
  return null;
}

/** Plain left clicks only: Cmd/Ctrl/Shift/Alt-click and other buttons stay the browser's (new tab, new window). */
export function isPlainClick(event: {
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  button: number;
}) {
  return !(event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0);
}
