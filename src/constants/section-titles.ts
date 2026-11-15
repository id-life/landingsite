import { NavItem } from '@/components/nav/nav';
import { BRAND, brandTitle } from '@/lib/seo/metadata';

/**
 * The topic of each experience section, as its route's metadata names it (src/content/pages.ts, which each layout
 * passes to buildMetadata). The content layer stays out of the browser bundle, so the client keeps this short list
 * and test/section-titles.test.mjs keeps it equal: GA4 reads document.title for each section's page_view (DATA-05),
 * so it must equal the route's own <title>.
 */
export const SECTION_TOPICS: Record<string, string> = {
  vision_page: BRAND.en,
  portfolio_page: 'Portfolio',
  insights_page: 'Insights',
  spectrum_page: 'Spectrum',
  engagement_page: 'Presence',
  twin_page: 'Digital Twin',
  connect_page: 'Connect',
};

/** document.title per section: "<topic> | Immortal Dragons", the same rule as the route metadata (SEO-06). */
export const sectionTitle = (item: NavItem) => brandTitle(SECTION_TOPICS[item.id] ?? BRAND.en);
