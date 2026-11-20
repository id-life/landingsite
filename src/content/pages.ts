// Each route's metadata topic, tab title and meta description. The layouts pass these to buildMetadata and their
// JSON-LD and server summaries. (llms.txt keeps its own Pages list, as the owner's file has it: src/content/profile.ts.) Every description is the one the owner's site serves for that page, word for word and uncut
// (2026-11-18: a description his site serves is text he put on his website, so it stays as it is).
import { live } from './approval';
import { byOrigin } from './origin';
import { FUND } from './fund';
import type { PageMeta } from './schema';

export const PAGES: PageMeta[] = byOrigin('content/pages.ts', [
  {
    id: 'home',
    path: '/',
    title: FUND.name.en,
    tabTitle: 'Immortal Dragons 不朽真龙',
    // His site's own description, word for word (question 12g: the focus text stays as his site serves it).
    description: FUND.description.text.en,
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
    llmsLabel: 'Portfolio',
    approval: live(),
  },
  {
    id: 'spectrum',
    path: '/spectrum',
    title: 'Spectrum',
    tabTitle: 'Spectrum 谱系',
    description:
      "Explore Immortal Dragon's variety of longevity initiatives on insight sharing, sponsorships, literature translation and publication, podcast channel, digital twin and clinical intelligence.",
    llmsLabel: 'Spectrum',
    approval: live(),
  },
  {
    id: 'disease-management',
    path: '/spectrum/disease-management',
    title: 'Disease Management & Cure Status',
    tabTitle: 'Disease Management & Cure Status | Immortal Dragons',
    description: '可治疗与可控制疾病列表 A list of curable and manageable diseases',
    keywords: [
      'curable diseases',
      'manageable diseases',
      'disease management status',
      'disease cure status',
      'disease wikipedia',
      '疾病百科',
      '可治愈疾病列表',
      '可控制疾病列表',
    ],
    llmsLabel: 'Disease Management',
    approval: live(),
  },
  {
    id: 'influence-network',
    path: '/spectrum/influence-network',
    title: 'Influence Network',
    tabTitle: 'Influence Network | Immortal Dragons',
    description: '长寿领域人物影响力与关系图 Longevity influencer network and relationship map',
    keywords: [
      '长寿',
      '长寿影响力',
      '长寿领域领军人物',
      '长寿领域人物关系',
      '长寿领域核心人物',
      'longevity',
      'longevity influencer',
      'longevity mentor',
      'longevity leaders',
      'longevity key opinion leaders',
      'longevity key people',
    ],
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
      "A global map of Immortal Dragons' presence --bridging East and West to advance longevity through events, partnerships, and community.",
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
    keywords: ['Longevity', 'Health', 'Science', 'Tech', 'Investment', 'Biotech', '长寿', '健康', '科技', '投资', '生物科技'],
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
    keywords: [
      'Behind the Scenes',
      'Rabbit Hole',
      'Random Thoughts',
      'General Knowledge',
      'Team Chat',
      '幕后故事',
      '兔子洞',
      '奇思妙想',
      '知识分享',
      '团队闲聊',
    ],
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
    description: '介绍不朽真龙基金的投资主题、投资组合、行业赞助和行业点评。',
    llmsLabel: '不朽真龙介绍',
    approval: live(),
  },
  {
    id: 'article-milestones',
    path: '/news/immortal-dragons-milestones-and-portfolio',
    title: '不朽真龙公司资讯',
    tabTitle: 'Immortal Dragons: Milestones and Portfolio',
    description: '不朽真龙的重要事件与投资组合概览，涵盖基金发布、产业投资和行业参与。',
    llmsLabel: 'Immortal Dragons: Milestones and Portfolio',
    approval: live(),
  },
]);

/** The meta description a page carries: its description, whole, as the owner's site serves it. llms.txt quotes this. */
export const metaDescription = (page: Pick<PageMeta, 'description'>) => page.description;

/** One route's path, title topic, tab title and description, ready for buildMetadata. */
export function pageMeta(id: string) {
  const page = PAGES.find((item) => item.id === id);
  if (!page) throw new Error(`content/pages.ts: no page "${id}"`);
  return {
    path: page.path,
    title: page.title,
    tabTitle: page.tabTitle,
    description: page.description,
    keywords: page.keywords,
  };
}
