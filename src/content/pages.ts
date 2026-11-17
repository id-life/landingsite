// Each route's metadata topic and meta description (SEO-06 rules in src/lib/seo/metadata.ts). The layouts pass these
// to buildMetadata and their JSON-LD, and llms.txt's Pages list quotes the same descriptions through metaDescription(),
// the cut buildMetadata applies, so the two cannot drift (CON-16). Every description is the page's live meta
// description at the baseline, with two punctuation corrections (CON-20): the fund's possessive on Spectrum (the
// apostrophe sat before the s) and a missing comma before "bridging" on Presence. Where the baseline description is
// under SEO-06's floor (35 Chinese or 70 Latin characters), it continues with text the same page already publishes
// (named beside each record; test/content-parity.test.mjs checks it word for word), never with new copy.
import { live } from './approval';
import { FUND } from './fund';
import type { PageMeta } from './schema';
import { snippet } from '@/lib/seo/metadata';

/**
 * The opening paragraph of each long article (src/content/articles/*.md), as published there: the article's own words
 * continue its summary, which alone is 29 and 34 characters.
 */
export const ARTICLE_OPENINGS = {
  profile:
    '不朽真龙基金（Immortal Dragons）是一家总部位于新加坡、投资激进延寿领域、规模4000万美元的使命驱动基金，由朢舶洋（Boyang Wang）创立。',
  milestones: '不朽真龙宣布设立 4000 万美元首期基金，投向生命延长（life extension）相关技术。',
} as const;

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
    description:
      "Explore Immortal Dragons' variety of longevity initiatives on insight sharing, sponsorships, literature translation and publication, podcast channel, digital twin and clinical intelligence.",
    llmsLabel: 'Spectrum',
    approval: live(),
  },
  {
    id: 'disease-management',
    path: '/spectrum/disease-management',
    title: 'Disease Management & Cure Status',
    tabTitle: 'Disease Management & Cure Status | Immortal Dragons',
    // Continues with the page's two table headings.
    description: `可治疗与可控制疾病列表 A list of curable and manageable diseases. ${DISEASE_MANAGEMENT_HEADINGS.join(' ')}`,
    llmsLabel: 'Disease Management',
    approval: live(),
  },
  {
    id: 'influence-network',
    path: '/spectrum/influence-network',
    title: 'Influence Network',
    tabTitle: 'Influence Network | Immortal Dragons',
    description: '长寿领域人物影响力与关系图 Longevity influencer network and relationship map',
    llmsLabel: 'Influence Network',
    approval: live(),
  },
  {
    id: 'digitaltwin',
    path: '/digitaltwin',
    title: 'Digital Twin',
    tabTitle: 'DigitalTwin 孪生',
    description:
      'Medical digital twin and clinical intelligence built for comprehensive biomarker analysis and preliminary diagnostic suggestions.',
    llmsLabel: 'Digital Twin',
    approval: live(),
  },
  {
    id: 'presence',
    path: '/presence',
    title: 'Presence',
    tabTitle: 'Presence 印记',
    description:
      "A global map of Immortal Dragons' presence, bridging East and West to advance longevity through events, partnerships, and community.",
    llmsLabel: 'Presence',
    approval: live(),
  },
  {
    id: 'insights',
    path: '/insights',
    title: 'Insights',
    tabTitle: 'Insights 洞见',
    description:
      'Immortal Dragons Insights: news, talks, features, and podcasts spotlighting longevity progress across our ecosystem.',
    llmsLabel: 'Insights',
    approval: live(),
  },
  {
    id: 'news',
    path: '/news',
    title: 'News',
    tabTitle: 'News 新闻 | Immortal Dragons',
    description:
      "Explore the latest news and coverage on Immortal Dragons' longevity investments, partnerships, insights and sharing.",
    llmsLabel: 'News',
    approval: live(),
  },
  {
    // The two podcast shows (they used to keep their own metadata in src/app/podcast/_components/constant.ts).
    id: 'podcast',
    path: '/podcast',
    title: '播客',
    tabTitle: 'Podcast 播客 | Immortal Dragons 不朽真龙',
    description:
      '解码长寿革命。聚焦前沿科技，洞察投资先机。Decoding the longevity revolution. A deep dive into breakthrough science, tech, and investments.',
    llmsLabel: 'Podcast',
    approval: live(),
  },
  {
    id: 'podcast-long-talk',
    path: '/podcast/long-talk',
    title: '龙门阵',
    tabTitle: '龙门阵 Long Talk Podcast | Immortal Dragons',
    description:
      '包罗万象的随性漫谈。记录不朽真龙团队在茶水间的灵感碎片！A casual conversation exploring everything. Join the Immortal Dragons team as we chase our curiosity down the rabbit hole.',
    llmsLabel: 'Long Talk Podcast',
    approval: live(),
  },
  {
    id: 'connect',
    path: '/connect',
    title: 'Connect',
    tabTitle: 'CONNECT 联结',
    description:
      "Immortal Dragons' connect and commitment to global longevity awareness, east/west longevity access, moonshot ventures and radical life extension.",
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
    description: `介绍不朽真龙基金的投资主题、投资组合、行业赞助和行业点评。${ARTICLE_OPENINGS.profile}`,
    llmsLabel: '不朽真龙介绍',
    approval: live(),
  },
  {
    id: 'article-milestones',
    path: '/news/immortal-dragons-milestones-and-portfolio',
    title: '不朽真龙公司资讯',
    tabTitle: 'Immortal Dragons: Milestones and Portfolio',
    // Continues with the article's opening paragraph.
    description: `不朽真龙的重要事件与投资组合概览，涵盖基金发布、产业投资和行业参与。${ARTICLE_OPENINGS.milestones}`,
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
