import type { SectionId } from '@/components/nav/nav';

export type SpectrumDotType = 'book' | 'sponsor' | 'meeting';

export type SpectrumHashRoute = {
  /** The hash: /presence#<key>. */
  key: string;
  /** The section the link opens. */
  section: SectionId;
  /**
   * The map dot to open, by its index in WORLD_MAP_DOTS (meeting), MAP_BOOK_DOTS (book) or MAP_SPONSOR_DOTS
   * (sponsor), and a piece of text that dot shows, so a test catches an index that drifted after the dots
   * were reordered (test/spectrum-routes.test.mjs).
   */
  dot?: { type: SpectrumDotType; index: number; shows: string };
  /** Address of the link when it is not /presence#<key>. */
  pathname?: string;
  useHash?: boolean;
};

/**
 * Shareable Spectrum and Presence links (/presence#the-network-state ...). Links shared since mid-2025 use
 * these keys, so they stay. Corrected on 2026-11-15: every section was positional (NAV_LIST[3] and
 * NAV_LIST[4]) and pointed one section early after Insights moved to index 2; the Oxford forum pointed at
 * the San Francisco dot, the two Lifespan keys at a fourth sponsor dot that no longer exists, and the
 * EthPanda and BiohackerDAO dots have left the map, so their keys open the section without a dot.
 */
export const SPECTRUM_HASH_ROUTES: SpectrumHashRoute[] = [
  // meeting
  {
    key: 'founders-forum-global',
    section: 'engagement_page',
    dot: { type: 'meeting', index: 5, shows: 'Founders Forum Global' },
  },
  { key: 'founders-longevity-forum-london', section: 'engagement_page', dot: { type: 'meeting', index: 5, shows: 'London' } },
  {
    key: 'founders-longevity-forum-singapore',
    section: 'engagement_page',
    dot: { type: 'meeting', index: 2, shows: 'Founders Longevity Forum Singapore' },
  },
  { key: 'vitalist-bay-summit', section: 'engagement_page', dot: { type: 'meeting', index: 4, shows: 'Vitalist Bay Summit' } },
  { key: 'timepie-longevity-forum', section: 'engagement_page', dot: { type: 'meeting', index: 0, shows: 'TIMEPIE' } },
  { key: 'edge-city-lanna', section: 'engagement_page', dot: { type: 'meeting', index: 1, shows: 'Edge City Lanna' } },
  {
    key: 'oxford-future-innovation-forum',
    section: 'engagement_page',
    dot: { type: 'sponsor', index: 0, shows: 'Oxford Future Innovation Forum' },
  },
  // book
  { key: 'the-network-state', section: 'engagement_page', dot: { type: 'book', index: 0, shows: 'The Network State' } },
  { key: 'better-with-age', section: 'engagement_page', dot: { type: 'book', index: 1, shows: 'Better With Age' } },
  // sponsor
  {
    key: 'vitalist-bay-summit-grant',
    section: 'engagement_page',
    dot: { type: 'meeting', index: 4, shows: 'Vitalist Bay Summit' },
  },
  { key: 'ardd-2025', section: 'engagement_page', dot: { type: 'meeting', index: 6, shows: 'ARDD' } },
  {
    key: '2060-longevity-forum',
    section: 'engagement_page',
    dot: { type: 'meeting', index: 7, shows: '2060 Longevity Forum' },
  },
  {
    key: 'lifespan-research-institute',
    section: 'engagement_page',
    dot: { type: 'sponsor', index: 1, shows: 'Lifespan Research Institute' },
  },
  {
    key: 'public-longevity-group',
    section: 'engagement_page',
    dot: { type: 'sponsor', index: 1, shows: 'Public Longevity Group' },
  },
  { key: 'biohacker-dao', section: 'engagement_page' },
  { key: 'eth-panda', section: 'engagement_page' },
  { key: 'revive-me-2025', section: 'engagement_page', dot: { type: 'sponsor', index: 2, shows: 'REVIVE ME' } },
  {
    key: 'healthy-longevity-medicine-conference',
    section: 'engagement_page',
    dot: { type: 'meeting', index: 2, shows: 'Healthy Longevity Medicine Conference' },
  },
  // digital twin
  { key: 'digital-twin', section: 'twin_page', pathname: '/digitaltwin', useHash: false },
];
