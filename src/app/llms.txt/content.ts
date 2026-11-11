// Static sections of /llms.txt.
// - English copy follows the official English profile (Immortal_Dragons_Wikipedia_EN, 2026-10-22), the
//   English counterpart of the 不朽真龙介绍 article (src/app/news/immortal-dragons-news-and-updates/article.md).
//   Citation markers are dropped; nothing else is added.
// - Page descriptions are quoted verbatim from each page's metadata description.
// Keep both in sync when the sources change. The hidden English summaries on /, /portfolio and
// /presence read sections of this header by heading (see LLMS_SECTIONS).

export const LLMS_SECTIONS = {
  keyFacts: 'Key facts',
  themes: 'Investment themes',
  advocacy: 'Advocacy',
  sponsorships: 'Sponsorships & grants',
} as const;

export const LLMS_HEADER = `# Immortal Dragons (不朽真龙)

> Immortal Dragons (不朽真龙) is a US$40 million purpose-driven longevity and radical life extension fund headquartered in Singapore, founded by Boyang Wang (朢舶洋). The fund backs underfunded moonshot projects: breakthroughs whose economic returns are not yet clear and that are overlooked by mainstream capital, but that hold long-term value. Its main investment themes include organ replacement strategy, 3D bioprinting and artificial womb, among others.
>
> The fund has made 15+ investments ranging from pre-seed to Series A, and is geographically agnostic. Beyond conventional capital investment, Immortal Dragons engages in book translation and publishing, delivers talks and produces podcasts, sponsors events and initiatives, and collaborates on research projects, in order to support anti-aging research and advocate for longevity.

## ${LLMS_SECTIONS.keyFacts}

- Name: Immortal Dragons (Chinese: 不朽真龙)
- Founder: Boyang Wang (朢舶洋), who received his education from the National University of Singapore and Yale University
- Headquarters: Biopolis, Singapore (3 Biopolis Dr, #01-15, Singapore 138623)
- Fund I size: approximately US$40 million
- Investments: 15+
- Investment stage: pre-seed to Series A, geographically agnostic
- Also invests as an LP in other longbio funds
- Website: https://www.id.life
- Contact: contact@id.life

## ${LLMS_SECTIONS.themes}

The fund's four investment themes are:

1. Replacement Strategy
2. Neuro & Brain Rejuvenation
3. Cells and Gene Therapy
4. Reproduction Technology

Specific investment areas include organ replacement strategy, 3D bioprinting, gene therapy and artificial womb, and the fund also invests as an LP in other longbio funds.

The Replacement Strategy rests on the fund's view that aging is the systemic wear of the body's "hardware": damage that is still reversible can be repaired, but irreversible damage can only be addressed by replacing tissues or organs with new ones. This area covers xenotransplantation, 3D bioprinting, tissue engineering and cryopreservation.

The fund treats scientific validity as the first threshold, requiring reproducible animal data and well-designed early-stage human studies. It prioritizes areas with clear regulatory pathways, sufficient technical validation and irreplaceable clinical need, rather than chasing trends. Because it views aging as a simultaneous imbalance across multiple pathways, organs and levels, it favors safe, multi-target combination interventions.

## ${LLMS_SECTIONS.advocacy}

- Talks and podcasts: investor fireside chat at Vitalist Bay, founder interview on Beyond Tomorrow, panel discussion at Founders Longevity Forum in Singapore, investor keynote at LW3 in Singapore, keynote at Longevity Biotech Exchange in Shenzhen, among others.
- Book translation and publishing: The Case Against Death by Swedish philosopher Ingemar Patrick Linden, Chinese edition 《死亡批判》; Better With Age, Chinese edition 《乐龄：健康老龄化的积极心理学》; The Network State by former Coinbase CTO Balaji Srinivasan, Chinese online translation 《网络国家》; the Bio/Acc Manifesto; and Chapter 14 of Frontiers of Longevity Science, Vol. 3, published by Springer Nature.
- Translation of talks by longevity leaders: e.g. Aubrey de Grey (President of the LEV Foundation) and Brian Kennedy (head of the Healthy Longevity Translational Research Programme at the National University of Singapore).
- Chinese longevity podcast: a Chinese-language longevity podcast published on Xiaoyuzhou, Bilibili, Spotify and other platforms.

## ${LLMS_SECTIONS.sponsorships}

- **ARDD**: Aging Research and Drug Discovery Meeting, held annually in Copenhagen; Immortal Dragons sponsored ARDD 2025.
- **Nakauchi Lab – Stem Cell Research**: Hiromitsu Nakauchi's stem cell laboratory at Stanford University.
- **XPRIZE**: Prize-competition foundation; Immortal Dragons is a partner of XPRIZE Healthspan and sponsored the 2026 finalist awards ceremony.
- **Lifespan Research Institute**: US longevity nonprofit; Immortal Dragons is one of the inaugural sponsors of its Lifespan Alliance.
- **Public Longevity Group**: A Lifespan Research Institute project studying public attitudes toward longevity science.
- **2060 Longevity Forum**: Longevity forum hosted by France's 2060 Foundation.
- **REVIVE ME**: Longevity and health-tech summit in Abu Dhabi.
- **Healthy Longevity and Medicine Conference**: Healthy longevity and medicine conference co-hosted by the NUS Yong Loo Lin School of Medicine and others.
- **Vitalist Bay Summit**: Longevity pop-up city and summit in Berkeley, California; Immortal Dragons was a founding sponsor.
- **University of Copenhagen Project: Aging Brain Rejuvenation**: Center for Healthy Aging at the University of Copenhagen, developing compounds that clear senescent astrocytes.
- **University of Oxford Project: Heart Aging and Metabolism**: University of Oxford research on the metabolic mechanisms of heart aging and dietary interventions.
- **Stanford University Project: Brain Resilience Mechanism**: Research on brain and neural aging at the Wyss-Coray Lab, Stanford University.
- **Cornerstone Non-profit Foundation**: Policy advocacy supporting New Hampshire's "Right to Try" bill, HB 701.
- **Beyond Tomorrow Podcast**: Podcast on AI and longevity hosted by Julian Issa.
- **HackAging.ai Hackathon**: 2025 global online hackathon on using AI agents to fight aging.
- **Vitalism**: Advocacy organization dedicated to ending aging; organizer of Vitalist Bay.
- **Longevity Science Foundation**: Swiss nonprofit funding early-stage longevity research.
- **Sundial Initiative**: California nonprofit studying aging and resilience genes.
- **TimePie Longevity Forum**: Aging-intervention forum hosted by TimePie in Shanghai.
- **American Alzheimer Association**: The largest nonprofit funder of Alzheimer's research in the United States (Alzheimer's Association).
- **China Alzheimer Association**: China Association for Alzheimer's Disease (CAAD).

## Media coverage (selected)

Immortal Dragons and Boyang Wang have been covered or quoted by the Financial Times (Tech Tonic), MIT Technology Review, New York Post, BioWorld, Longevity.Technology, BioSpectrum Asia, pharmaphorum, Inside Precision Medicine, Labiotech, Drug Discovery World, 36Kr (36氪), 21st Century Business Herald (21世纪经济报道), Yicai (第一财经) and others.

## Pages

- [Home](https://www.id.life/): Immortal Dragons is a purpose-driven longevity fund headquartered in Singapore.
- [Portfolio](https://www.id.life/portfolio): Immortal Dragons' purpose-driven investment portfolio supporting moonshot and radical life extension technologies. Backing technologies like wholebody replacement, 3D bioprinting, gene therapy, artificial womb technology and more.
- [Spectrum](https://www.id.life/spectrum): Explore Immortal Dragon's variety of longevity initiatives on insight sharing, sponsorships, literature translation and publication, podcast channel, digital twin and clinical intelligence.
- [Disease Management](https://www.id.life/spectrum/disease-management): 可治疗与可控制疾病列表 A list of curable and manageable diseases
- [Influence Network](https://www.id.life/spectrum/influence-network): 长寿领域人物影响力与关系图 Longevity influencer network and relationship map
- [Digital Twin](https://www.id.life/digitaltwin): Medical digital twin and clinical intelligence built for comprehensive biomarker analysis and preliminary diagnostic suggestions.
- [Presence](https://www.id.life/presence): A global map of Immortal Dragons' presence --bridging East and West to advance longevity through events, partnerships, and community.
- [Insights](https://www.id.life/insights): Immortal Dragons Insights: news, talks, features, and podcasts spotlighting longevity progress across our ecosystem.
- [News](https://www.id.life/news): Explore the latest news and coverage on Immortal Dragons' longevity investments, partnerships, insights and sharing.
- [Podcast](https://www.id.life/podcast): 不朽真龙 Immortal Dragons Podcast and [龙门阵 Long Talk Podcast](https://www.id.life/podcast?c=lt)
- [Connect](https://www.id.life/connect): Immortal Dragons' connect and commitment to global longevity awareness, east/west longevity access, moonshot ventures and radical life extension.
- [不朽真龙介绍](https://www.id.life/news/immortal-dragons-news-and-updates): 介绍不朽真龙基金的投资主题、投资组合、行业赞助和行业点评。
- [Immortal Dragons: Milestones and Portfolio](https://www.id.life/news/immortal-dragons-milestones-and-portfolio): 不朽真龙的重要事件与投资组合概览，涵盖基金发布、产业投资和行业参与。
`;

export const LLMS_CHINESE_SUMMARY = `## 中文简介

不朽真龙基金（Immortal Dragons）是一家总部位于新加坡、投资激进延寿领域、规模4000万美元的使命驱动基金，由朢舶洋（Boyang Wang）创立。基金致力于支持经济回报尚不明确，被主流资本所忽视，但具备长期价值的突破性项目，主要投资方向包括器官替换策略，3D生物打印，人造子宫等。

基金已完成15余项投资，投资阶段覆盖前种子轮至A轮，不限地域。投资之外，不朽真龙出版翻译书籍，资助行业会议和学术机构，制作播客和媒体内容，从而支持抗衰科学研究，布道长寿理念信仰。
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
