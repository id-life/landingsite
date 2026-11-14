import { NavItem } from '@/components/nav/nav';

const BRAND = 'Immortal Dragons 不朽真龙';

/** document.title per section, matching each route's metadata title (root template: "%s | brand"). */
export const SECTION_TITLES: Record<string, string> = {
  vision_page: BRAND,
  portfolio_page: `Portfolio 投资 | ${BRAND}`,
  insights_page: `Insights 洞见 | ${BRAND}`,
  spectrum_page: `Spectrum 谱系 | ${BRAND}`,
  engagement_page: `Presence 印迹 | ${BRAND}`,
  twin_page: `Digital Twin 孪生 | ${BRAND}`,
  connect_page: `Connect 联结 | ${BRAND}`,
};

export const sectionTitle = (item: NavItem) => SECTION_TITLES[item.id] ?? BRAND;
