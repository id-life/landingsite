// The fund's written profile: the English text of /llms.txt and the hidden summaries that quote it, plus the
// Chinese summary. English follows the official English profile (Immortal_Dragons_Wikipedia_EN, 2026-10-22), the
// counterpart of the 不朽真龙介绍 article (src/content/articles/immortal-dragons-news-and-updates.md); citation markers
// are dropped and nothing is added. Key facts, themes and sponsorships are generated from their records
// (./fund.ts, ./themes.ts, ./grants.ts), so llms.txt, the JSON-LD and the About page cannot disagree.
import { live } from './approval';
import { FUND, FUND_ADDRESS_LINE } from './fund';
import { PROFILE_GRANTS } from './grants';
import { personBySlug } from './people';
import { Copy, defineContent } from './schema';
import { THEMES } from './themes';
import { z } from 'zod';

const PROFILE_TEXT = defineContent('content/profile.ts', z.array(Copy), [
  {
    id: 'intro',
    text: {
      en: [
        'Immortal Dragons (不朽真龙) is a US$40 million purpose-driven longevity and radical life extension fund headquartered in Singapore, founded by Boyang Wang (朢舶洋). The fund backs underfunded moonshot projects: breakthroughs whose economic returns are not yet clear and that are overlooked by mainstream capital, but that hold long-term value. Its main investment themes include organ replacement strategy, 3D bioprinting and artificial womb, among others.',
        'The fund has made 15+ investments ranging from pre-seed to Series A, and is geographically agnostic. Beyond conventional capital investment, Immortal Dragons engages in book translation and publishing, delivers talks and produces podcasts, sponsors events and initiatives, and collaborates on research projects, in order to support anti-aging research and advocate for longevity.',
      ].join('\n'),
      zh: [
        '不朽真龙基金（Immortal Dragons）是一家总部位于新加坡、投资激进延寿领域、规模4000万美元的使命驱动基金，由朢舶洋（Boyang Wang）创立。基金致力于支持经济回报尚不明确，被主流资本所忽视，但具备长期价值的突破性项目，主要投资方向包括器官替换策略，3D生物打印，人造子宫等。',
        '基金已完成15余项投资，投资阶段覆盖前种子轮至A轮，不限地域。投资之外，不朽真龙出版翻译书籍，资助行业会议和学术机构，制作播客和媒体内容，从而支持抗衰科学研究，布道长寿理念信仰。',
      ].join('\n'),
    },
    approval: live(),
  },
  {
    // The About page's two-sentence summary: the home page description and the second sentence of the intro above,
    // both live at the baseline, joined. No new wording; it leaves out the facts that wait on a ruling.
    id: 'about-summary',
    text: {
      en: 'Immortal Dragons is a purpose-driven longevity fund headquartered in Singapore. The fund backs underfunded moonshot projects: breakthroughs whose economic returns are not yet clear and that are overlooked by mainstream capital, but that hold long-term value.',
    },
    approval: live(),
  },
  {
    id: 'investment-areas',
    text: {
      en: 'Specific investment areas include organ replacement strategy, 3D bioprinting, gene therapy and artificial womb, and the fund also invests as an LP in other longbio funds.',
    },
    approval: live(),
  },
  {
    id: 'replacement-strategy',
    text: {
      en: 'The Replacement Strategy rests on the fund\'s view that aging is the systemic wear of the body\'s "hardware": damage that is still reversible can be repaired, but irreversible damage can only be addressed by replacing tissues or organs with new ones. This area covers xenotransplantation, 3D bioprinting, tissue engineering and cryopreservation.',
    },
    approval: live(),
  },
  {
    id: 'criteria',
    text: {
      en: 'The fund treats scientific validity as the first threshold, requiring reproducible animal data and well-designed early-stage human studies. It prioritizes areas with clear regulatory pathways, sufficient technical validation and irreplaceable clinical need, rather than chasing trends. Because it views aging as a simultaneous imbalance across multiple pathways, organs and levels, it favors safe, multi-target combination interventions.',
    },
    approval: live(),
  },
  {
    id: 'advocacy',
    text: {
      en: [
        'Talks and podcasts: investor fireside chat at Vitalist Bay, founder interview on Beyond Tomorrow, panel discussion at Founders Longevity Forum in Singapore, investor keynote at LW3 in Singapore, keynote at Longevity Biotech Exchange in Shenzhen, among others.',
        'Book translation and publishing: The Case Against Death by Swedish philosopher Ingemar Patrick Linden, Chinese edition 《死亡批判》; Better With Age, Chinese edition 《乐龄：健康老龄化的积极心理学》; The Network State by former Coinbase CTO Balaji Srinivasan, Chinese online translation 《网络国家》; the Bio/Acc Manifesto; and Chapter 14 of Frontiers of Longevity Science, Vol. 3, published by Springer Nature.',
        'Translation of talks by longevity leaders: e.g. Aubrey de Grey (President of the LEV Foundation) and Brian Kennedy (head of the Healthy Longevity Translational Research Programme at the National University of Singapore).',
        'Chinese longevity podcast: a Chinese-language longevity podcast published on Xiaoyuzhou, Bilibili, Spotify and other platforms.',
      ].join('\n'),
    },
    approval: live(),
  },
  {
    id: 'media-coverage',
    text: {
      en: 'Immortal Dragons and Boyang Wang have been covered or quoted by the Financial Times (Tech Tonic), MIT Technology Review, New York Post, BioWorld, Longevity.Technology, BioSpectrum Asia, pharmaphorum, Inside Precision Medicine, Labiotech, Drug Discovery World, 36Kr (36氪), 21st Century Business Herald (21世纪经济报道), Yicai (第一财经) and others.',
    },
    approval: live(),
  },
  {
    // Page descriptions quoted verbatim from each page's metadata description at the baseline.
    id: 'pages',
    text: {
      en: [
        '- [Home](https://www.id.life/): Immortal Dragons is a purpose-driven longevity fund headquartered in Singapore.',
        "- [Portfolio](https://www.id.life/portfolio): Immortal Dragons' purpose-driven investment portfolio supporting moonshot and radical life extension technologies. Backing technologies like wholebody replacement, 3D bioprinting, gene therapy, artificial womb technology and more.",
        "- [Spectrum](https://www.id.life/spectrum): Explore Immortal Dragons' variety of longevity initiatives on insight sharing, sponsorships, literature translation and publication, podcast channel, digital twin and clinical intelligence.",
        '- [Disease Management](https://www.id.life/spectrum/disease-management): 可治疗与可控制疾病列表 A list of curable and manageable diseases',
        '- [Influence Network](https://www.id.life/spectrum/influence-network): 长寿领域人物影响力与关系图 Longevity influencer network and relationship map',
        '- [Digital Twin](https://www.id.life/digitaltwin): Medical digital twin and clinical intelligence built for comprehensive biomarker analysis and preliminary diagnostic suggestions.',
        "- [Presence](https://www.id.life/presence): A global map of Immortal Dragons' presence --bridging East and West to advance longevity through events, partnerships, and community.",
        '- [Insights](https://www.id.life/insights): Immortal Dragons Insights: news, talks, features, and podcasts spotlighting longevity progress across our ecosystem.',
        "- [News](https://www.id.life/news): Explore the latest news and coverage on Immortal Dragons' longevity investments, partnerships, insights and sharing.",
        '- [Podcast](https://www.id.life/podcast): 不朽真龙 Immortal Dragons Podcast and [龙门阵 Long Talk Podcast](https://www.id.life/podcast?c=lt)',
        "- [Connect](https://www.id.life/connect): Immortal Dragons' connect and commitment to global longevity awareness, east/west longevity access, moonshot ventures and radical life extension.",
        '- [不朽真龙介绍](https://www.id.life/news/immortal-dragons-news-and-updates): 介绍不朽真龙基金的投资主题、投资组合、行业赞助和行业点评。',
        '- [Immortal Dragons: Milestones and Portfolio](https://www.id.life/news/immortal-dragons-milestones-and-portfolio): 不朽真龙的重要事件与投资组合概览，涵盖基金发布、产业投资和行业参与。',
      ].join('\n'),
    },
    approval: live(),
  },
]);

/** One profile text by id. */
export function profileText(id: string) {
  const entry = PROFILE_TEXT.find((item) => item.id === id);
  if (!entry) throw new Error(`content/profile.ts: no text "${id}"`);
  return entry.text;
}

export const LLMS_SECTIONS = {
  keyFacts: 'Key facts',
  themes: 'Investment themes',
  advocacy: 'Advocacy',
  sponsorships: 'Sponsorships & grants',
} as const;

const founder = personBySlug(FUND.founder);

/** The key facts as "Label: value" lines, in the order llms.txt has always listed them. */
export const keyFactLines = () => [
  `Name: ${FUND.name.en} (Chinese: ${FUND.name.zh})`,
  `Founder: ${founder.name.en} (${founder.name.zh}), who received his education from the ${founder.alumniOf.join(' and ')}`,
  `Headquarters: ${FUND.address.area}, ${FUND.address.addressLocality} (${FUND_ADDRESS_LINE})`,
  `${FUND.fundSize.label.en}: ${FUND.fundSize.value.en}`,
  `${FUND.statedInvestments.label.en}: ${FUND.statedInvestments.value.en}`,
  `${FUND.stage.label.en}: ${FUND.stage.value.en}, ${FUND.geography.value.en}`,
  FUND.lpPositions.value.en,
  `Website: ${FUND.website}`,
  `Contact: ${FUND.email}`,
];

const bullets = (lines: string[]) => lines.map((line) => `- ${line}`).join('\n');
const quote = (text: string) =>
  text
    .split('\n')
    .map((line) => `> ${line}`)
    .join('\n>\n');

export const LLMS_HEADER = `# ${FUND.name.en} (${FUND.name.zh})

${quote(profileText('intro').en)}

## ${LLMS_SECTIONS.keyFacts}

${bullets(keyFactLines())}

## ${LLMS_SECTIONS.themes}

The fund's four investment themes are:

${THEMES.map((theme) => `${theme.order}. ${theme.name.en}`).join('\n')}

${profileText('investment-areas').en}

${profileText('replacement-strategy').en}

${profileText('criteria').en}

## ${LLMS_SECTIONS.advocacy}

${bullets(profileText('advocacy').en.split('\n'))}

## ${LLMS_SECTIONS.sponsorships}

${PROFILE_GRANTS.map((grant) => `- **${grant.name}**: ${grant.description?.en ?? ''}`).join('\n')}

## Media coverage (selected)

${profileText('media-coverage').en}

## Pages

${profileText('pages').en}
`;

export const LLMS_CHINESE_SUMMARY = `## 中文简介

${(profileText('intro').zh ?? '').split('\n').join('\n\n')}
`;

/** One `## heading` section of LLMS_HEADER (heading included), up to the next `## `. */
export function llmsSection(heading: string) {
  const start = LLMS_HEADER.indexOf(`## ${heading}\n`);
  if (start === -1) return '';
  const next = LLMS_HEADER.indexOf('\n## ', start + 3);
  return LLMS_HEADER.slice(start, next === -1 ? undefined : next).trim();
}

/** The introductory blockquote of LLMS_HEADER as plain paragraphs. */
export function llmsIntro() {
  return LLMS_HEADER.split('\n')
    .filter((line) => line.startsWith('>'))
    .map((line) => line.replace(/^>\s?/, ''))
    .join('\n');
}
