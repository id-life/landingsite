import { PODCAST_NAV_LIST } from '@/app/podcast/_components/constant';
import { NAV_LIST } from '@/components/nav/nav';
import { SPECTRUM_GROUPS } from '@/content/initiatives';
import { SLOGANS } from '@/content/slogans';

/**
 * Chinese display strings (VIS-07): the closed list of Chinese text set in the brand roles (`.bilingual-font`,
 * `.bilingual-font-poppins`, `font-brand`), whose Chinese comes from the Source Han Sans CN subset in
 * src/styles/fonts/cjk-display-*.woff2. Every character here must be in that subset, so a label is drawn by one
 * Chinese face. `test/cjk-display.test.mjs` fails when a character is missing; regenerate the subset with
 * `node scripts/build-cjk-subset.mjs`.
 *
 * Text that is not on this list (CMS titles, articles, transcripts, cards) must not use a brand role: it is set in
 * `font-text` / `font-display`, whose Chinese comes from the system faces only.
 */

/** Chinese labels written directly in components (FixedConnect, MobileSpectrumSponsorPage). */
export const CONNECT_EVANGELISM_CN = '布道者';
export const CONNECT_BRIDGE_CN = '桥梁';

export const DISPLAY_STRINGS: readonly string[] = [
  // Experience navigation (PCNav, the phone menu) and the podcast header tabs.
  ...NAV_LIST.map((item) => item.title),
  ...PODCAST_NAV_LIST.map((item) => item.title),
  // Spectrum group titles (SpectrumItem, SpectrumInitiatives, MobileSpectrumSponsorPage).
  ...SPECTRUM_GROUPS.map((group) => group.text.zh ?? ''),
  // Connect's Chinese headings.
  CONNECT_EVANGELISM_CN,
  CONNECT_BRIDGE_CN,
  // Slogans (the Chinese ones render on the Insights and phone screens).
  ...SLOGANS.filter((slogan) => slogan.locale === 'zh').map((slogan) => slogan.text),
  // The brand name, so the wordmark line can be set in the brand role.
  '不朽真龙',
];
