import { NavItem } from '@/components/nav/nav';

/**
 * The browser tab title of each experience section, as its route's metadata gives it (src/content/pages.ts,
 * `tabTitle`, which each layout passes to buildMetadata): the owner's own titles (question 5i, 2026-11-18). The
 * content layer stays out of the browser bundle, so the client keeps this short list and
 * test/section-titles.test.mjs keeps it equal: GA4 reads document.title for each section's page_view (DATA-05), so it
 * must equal the route's own <title>.
 */
export const SECTION_TITLES: Record<string, string> = {
  vision_page: 'Immortal Dragons 不朽真龙',
  portfolio_page: 'Portfolio 投资',
  insights_page: 'Insights 洞见',
  spectrum_page: 'Spectrum 谱系',
  engagement_page: 'Presence 印记',
  twin_page: 'DigitalTwin 孪生',
  connect_page: 'CONNECT 联结',
};

/** document.title per section: the section route's own tab title. */
export const sectionTitle = (item: NavItem) => SECTION_TITLES[item.id] ?? SECTION_TITLES.vision_page;
