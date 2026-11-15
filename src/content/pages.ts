// Each route's metadata topic and meta description (SEO-06 rules in src/lib/seo/metadata.ts). The layouts pass these
// to buildMetadata and their JSON-LD, and llms.txt's Pages list quotes the same descriptions, so the copies cannot
// drift. Every description is the page's live meta description at the baseline, with two punctuation corrections
// (CON-20): the fund's possessive on Spectrum (the apostrophe sat before the s) and the comma on Presence (it read
// "presence --bridging"). The podcast shows keep their own metadata (src/app/podcast/_components/constant.ts).
import { live } from './approval';
import { FUND } from './fund';
import type { PageMeta } from './schema';

export const PAGES: PageMeta[] = [
  {
    // The home title is the brand alone; the description is the fund's one-sentence statement.
    id: 'home',
    path: '/',
    title: FUND.name.en,
    description: FUND.statement.text.en,
    llmsLabel: 'Home',
    approval: live(),
  },
  {
    id: 'about',
    path: '/about',
    title: 'About',
    description: FUND.statement.text.en,
    approval: live(),
  },
  {
    id: 'portfolio',
    path: '/portfolio',
    title: 'Portfolio',
    description:
      "Immortal Dragons' purpose-driven investment portfolio supporting moonshot and radical life extension technologies. Backing technologies like wholebody replacement, 3D bioprinting, gene therapy, artificial womb technology and more.",
    llmsLabel: 'Portfolio',
    approval: live(),
  },
  {
    id: 'spectrum',
    path: '/spectrum',
    title: 'Spectrum',
    description:
      "Explore Immortal Dragons' variety of longevity initiatives on insight sharing, sponsorships, literature translation and publication, podcast channel, digital twin and clinical intelligence.",
    llmsLabel: 'Spectrum',
    approval: live(),
  },
  {
    id: 'disease-management',
    path: '/spectrum/disease-management',
    title: 'Disease Management & Cure Status',
    description: '可治疗与可控制疾病列表 A list of curable and manageable diseases',
    llmsLabel: 'Disease Management',
    approval: live(),
  },
  {
    id: 'influence-network',
    path: '/spectrum/influence-network',
    title: 'Influence Network',
    description: '长寿领域人物影响力与关系图 Longevity influencer network and relationship map',
    llmsLabel: 'Influence Network',
    approval: live(),
  },
  {
    id: 'digitaltwin',
    path: '/digitaltwin',
    title: 'Digital Twin',
    description:
      'Medical digital twin and clinical intelligence built for comprehensive biomarker analysis and preliminary diagnostic suggestions.',
    llmsLabel: 'Digital Twin',
    approval: live(),
  },
  {
    id: 'presence',
    path: '/presence',
    title: 'Presence',
    description:
      "A global map of Immortal Dragons' presence, bridging East and West to advance longevity through events, partnerships, and community.",
    llmsLabel: 'Presence',
    approval: live(),
  },
  {
    id: 'insights',
    path: '/insights',
    title: 'Insights',
    description:
      'Immortal Dragons Insights: news, talks, features, and podcasts spotlighting longevity progress across our ecosystem.',
    llmsLabel: 'Insights',
    approval: live(),
  },
  {
    id: 'news',
    path: '/news',
    title: 'News',
    description:
      "Explore the latest news and coverage on Immortal Dragons' longevity investments, partnerships, insights and sharing.",
    llmsLabel: 'News',
    approval: live(),
  },
  {
    id: 'connect',
    path: '/connect',
    title: 'Connect',
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
    description: '介绍不朽真龙基金的投资主题、投资组合、行业赞助和行业点评。',
    llmsLabel: '不朽真龙介绍',
    approval: live(),
  },
  {
    id: 'article-milestones',
    path: '/news/immortal-dragons-milestones-and-portfolio',
    title: '不朽真龙公司资讯',
    description: '不朽真龙的重要事件与投资组合概览，涵盖基金发布、产业投资和行业参与。',
    llmsLabel: 'Immortal Dragons: Milestones and Portfolio',
    approval: live(),
  },
];

/** One route's path, title topic and description, ready for buildMetadata. */
export function pageMeta(id: string) {
  const page = PAGES.find((item) => item.id === id);
  if (!page) throw new Error(`content/pages.ts: no page "${id}"`);
  return { path: page.path, title: page.title, description: page.description };
}
