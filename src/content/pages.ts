// Each route's metadata topic, tab title and meta description (SEO-06 rules in src/lib/seo/metadata.ts). The layouts
// pass these to buildMetadata and their JSON-LD, and llms.txt's Pages list quotes the same descriptions through
// metaDescription(), the cut buildMetadata applies, so the two cannot drift (CON-16). The owner's answer to question 11
// (2026-11-18): each description is written only from words already shown on the same page, with no adjective or fact
// of our own; test/content-parity.test.mjs checks each against its source. Home and Portfolio keep the owner's own
// descriptions word for word: they state the focus (question 12g).
import { live } from './approval';
import { FUND } from './fund';
import type { PageMeta } from './schema';
import { snippet } from '@/lib/seo/metadata';
import { PODCAST_COVER, PODCAST_NAV_LIST } from '@/app/podcast/_components/constant';
import { SPECTRUM_GROUPS } from './initiatives';
import { SUBSCRIBE_PROMISES } from './subscribe';
import { TWIN } from './twin';

/**
 * The opening paragraph of each long article (src/content/articles/*.md), as published there: the article's own words
 * continue its summary, which alone is 29 and 34 characters.
 */
export const ARTICLE_OPENINGS = {
  profile:
    '不朽真龙基金（Immortal Dragons）是一家总部位于新加坡、投资激进延寿领域、规模4000万美元的使命驱动基金，由朢舶洋（Boyang Wang）创立。',
  milestones: '不朽真龙宣布设立 4000 万美元首期基金，投向生命延长（life extension）相关技术。',
} as const;

/**
 * The events the Presence map's cards name (src/constants/engagement.tsx, title and secondTitle, line breaks as
 * spaces; test/content-parity.test.mjs checks the list against the cards).
 */
export const PRESENCE_EVENTS = [
  'The 6th TIMEPIE LONGEVITY FORUM',
  'The 5th TIMEPIE LONGEVITY FORUM',
  'Edge City Lanna',
  'Founders Longevity Forum Singapore',
  'Vitalia @ Roatan, Honduras',
  'Vitalist Bay Summit',
  'Founders Longevity Forum London',
  'Founders Forum Global',
  'ARDD',
  '2060 Longevity Forum',
];

/** The two sentences the Connect section shows (src/app/connect/FixedConnectPage1.tsx). */
export const CONNECT_LINES = [
  'We Stand with Bold Unorthodox Ideas and Brave Contrarian Founders',
  'Deep Roots in Both East & West, a Conduit that Bridges Markets, Capital, Institutions and More',
];

/** The headings the Disease Management page shows above its two tables (src/constants/disease-management.ts). */
export const DISEASE_MANAGEMENT_HEADINGS = ['How Many Diseases Are Curable?', 'How Many Rare Diseases Are Manageable?'];

export const PAGES: PageMeta[] = [
  {
    // The description is the one the owner's site serves for its home page, word for word and uncut: it states the
    // focus, which stays as it is (question 12g, 2026-11-18).
    id: 'home',
    path: '/',
    title: FUND.name.en,
    tabTitle: 'Immortal Dragons 不朽真龙',
    description: FUND.description.text.en,
    whole: true,
    llmsLabel: 'Home',
    approval: live(),
  },
  {
    id: 'portfolio',
    path: '/portfolio',
    title: 'Portfolio',
    tabTitle: 'Portfolio 投资',
    description:
      "Immortal Dragons' purpose-driven investment portfolio supporting moonshot and radical life extension technologies. Backing technologies like wholebody replacement, 3D bioprinting, gene therapy, artificial womb technology and more.",
    // The owner's own description, served whole as his site does: it states the focus (question 12g).
    whole: true,
    llmsLabel: 'Portfolio',
    approval: live(),
  },
  {
    id: 'spectrum',
    path: '/spectrum',
    title: 'Spectrum',
    tabTitle: 'Spectrum 谱系',
    // The section's five group headings, as it shows them (question 11, 2026-11-18: only words the page shows).
    description: SPECTRUM_GROUPS.map((group) => `${group.text.en} ${group.text.zh}`).join(', '),
    llmsLabel: 'Spectrum',
    approval: live(),
  },
  {
    id: 'disease-management',
    path: '/spectrum/disease-management',
    title: 'Disease Management & Cure Status',
    tabTitle: 'Disease Management & Cure Status | Immortal Dragons',
    // Continues with the page's two table headings.
    // The page's two table headings (question 11: only words the page shows).
    description: DISEASE_MANAGEMENT_HEADINGS.join(' '),
    llmsLabel: 'Disease Management',
    approval: live(),
  },
  {
    id: 'influence-network',
    path: '/spectrum/influence-network',
    title: 'Influence Network',
    tabTitle: 'Influence Network | Immortal Dragons',
    // The page's own note under the network (question 11: only words the page shows).
    description:
      'This page is a derived work from https://agingbiotech.info/people/. For more comprehensive information, please visit the original website.',
    llmsLabel: 'Influence Network',
    approval: live(),
  },
  {
    id: 'digitaltwin',
    path: '/digitaltwin',
    title: 'Digital Twin',
    tabTitle: 'DigitalTwin 孪生',
    // The section's four features and its line under the avatar (question 11: only words the page shows).
    description: `${TWIN.features.map((feature) => feature.en).join(', ')}. ${TWIN.ontology.text.en}`,
    llmsLabel: 'Digital Twin',
    approval: live(),
  },
  {
    id: 'presence',
    path: '/presence',
    title: 'Presence',
    tabTitle: 'Presence 印记',
    // The events the map's cards name (question 11: only words the page shows).
    description: PRESENCE_EVENTS.join(', '),
    llmsLabel: 'Presence',
    approval: live(),
  },
  {
    id: 'insights',
    path: '/insights',
    title: 'Insights',
    tabTitle: 'Insights 洞见',
    // The section's three headings (question 11: only words the page shows).
    description: 'NEWS & TALKS, PODCAST, 长生周报',
    llmsLabel: 'Insights',
    approval: live(),
  },
  {
    id: 'news',
    path: '/news',
    title: 'News',
    tabTitle: 'News 新闻 | Immortal Dragons',
    // The page's own line above its subscribe button (question 11: only words the page shows).
    description: SUBSCRIBE_PROMISES[0].text.en,
    llmsLabel: 'News',
    approval: live(),
  },
  {
    // The two podcast shows (they used to keep their own metadata in src/app/podcast/_components/constant.ts).
    id: 'podcast',
    path: '/podcast',
    title: '播客',
    tabTitle: 'Podcast 播客 | Immortal Dragons 不朽真龙',
    // The show's own description, as the page shows it under its name (question 11).
    description: PODCAST_COVER[PODCAST_NAV_LIST[0].id].description,
    llmsLabel: 'Podcast',
    approval: live(),
  },
  {
    id: 'podcast-long-talk',
    path: '/podcast/long-talk',
    title: '龙门阵',
    tabTitle: '龙门阵 Long Talk Podcast | Immortal Dragons',
    // The show's own description, as the page shows it under its name (question 11).
    description: PODCAST_COVER[PODCAST_NAV_LIST[1].id].description,
    llmsLabel: 'Long Talk Podcast',
    approval: live(),
  },
  {
    id: 'connect',
    path: '/connect',
    title: 'Connect',
    tabTitle: 'CONNECT 联结',
    // The section's two lines under MOONSHOT VENTURES and EAST & WEST ACCESS (src/app/connect/FixedConnectPage1.tsx),
    // the only sentences it shows: its values and criteria are not on screen on the owner's site (question 11).
    description: CONNECT_LINES.join('. '),
    llmsLabel: 'Connect',
    approval: live(),
  },
  {
    // The articles' titles are their own headings, in their language.
    id: 'article-profile',
    path: '/news/immortal-dragons-news-and-updates',
    title: '不朽真龙介绍',
    tabTitle: 'Immortal Dragons News and Updates',
    // Continues with the article's opening paragraph.
    // The article's opening paragraph (question 11: only words the page shows).
    description: ARTICLE_OPENINGS.profile,
    llmsLabel: '不朽真龙介绍',
    approval: live(),
  },
  {
    id: 'article-milestones',
    path: '/news/immortal-dragons-milestones-and-portfolio',
    title: '不朽真龙公司资讯',
    tabTitle: 'Immortal Dragons: Milestones and Portfolio',
    // Continues with the article's opening paragraph.
    // The article's opening paragraph (question 11: only words the page shows).
    description: ARTICLE_OPENINGS.milestones,
    llmsLabel: 'Immortal Dragons: Milestones and Portfolio',
    approval: live(),
  },
];

/** The meta description a page carries: its description as buildMetadata cuts it. llms.txt quotes this. */
export const metaDescription = (page: Pick<PageMeta, 'description' | 'whole'>) =>
  page.whole ? page.description : snippet(page.description);

/** One route's path, title topic, tab title and description, ready for buildMetadata. */
export function pageMeta(id: string) {
  const page = PAGES.find((item) => item.id === id);
  if (!page) throw new Error(`content/pages.ts: no page "${id}"`);
  return { path: page.path, title: page.title, tabTitle: page.tabTitle, description: page.description, whole: page.whole };
}
