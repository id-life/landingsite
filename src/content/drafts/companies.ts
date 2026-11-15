// "Why we invested" outlines for the 16 company pages (CON-08): the public facts about each company and the
// questions only the owner can answer. The reasons themselves must come from him (master-plan CON-10 agent brief).
import { defineDrafts } from './define';

const TABLE = 'src/content/articles/immortal-dragons-news-and-updates.md (二、投资组合 table)';
const MILESTONES = 'src/content/articles/immortal-dragons-milestones-and-portfolio.md';
const QUESTIONS = [
  'Why the fund invested (80 to 150 words, in your words).',
  'Theme, stage at entry, year of investment and current status (with the month it is true for).',
];

const outline = (slug: string, name: string, facts: string[], refs: string[], extra: string[] = []) => ({
  id: `why-${slug}`,
  item: 'CON-08',
  title: `Company page outline: ${name}`,
  body: { en: facts.map((fact) => `- ${fact}`).join('\n') },
  approval: {
    status: 'draft' as const,
    sources: refs.map((ref) => ({ ref })),
    questions: [...QUESTIONS, ...extra],
  },
});

export const COMPANY_DRAFTS = defineDrafts('companies.ts', [
  outline(
    'healthspan-capital',
    'Healthspan Capital',
    ['Longevity biotech venture fund (长寿生物科技风投基金).'],
    [TABLE],
    ['Is this the LP position the profile mentions ("also invests as an LP in other longbio funds")?'],
  ),
  outline(
    'frontier-bio',
    'Frontier Bio',
    [
      'US 3D biofabrication company: bioprinting and vascular tissue engineering for tissue and organ replacement.',
      'Immortal Dragons invested in September 2025 (reported by SynBioBeta and Finsmes).',
      "Its regenerative vascular graft, implanted in a single surgery, won 'Best Paper' at the 50th annual VESS meeting (April 2026).",
      "pharmaphorum (January 2026) called the investment the fund's first step into tissue engineering.",
    ],
    [
      TABLE,
      `${MILESTONES}:11-47`,
      'src/content/press.ts (Yahoo Finance, 2026-04-09)',
      'src/content/articles/immortal-dragons-news-and-updates.md:110',
    ],
  ),
  outline(
    'unlimited-bio',
    'Unlimited Bio',
    [
      'Gene therapy company developing a dual gene therapy for muscle aging.',
      'Immortal Dragons invested in November 2025.',
      'Registered a first-in-class dual gene therapy trial (March 2026).',
    ],
    [TABLE, `${MILESTONES}:49-57`, 'src/content/press.ts (Markets Insider, 2026-03-20)'],
  ),
  outline(
    'r3-bio',
    'R3 Bio',
    [
      "Whole-body replacement (全身替换), per the fund's own profile article.",
      'MIT Technology Review (March 2026) listed Immortal Dragons among its investors.',
    ],
    [TABLE, 'src/content/articles/immortal-dragons-news-and-updates.md:61, :107'],
    ['CON-11 #4: the tile says "Stealth mode biotech". What may the company page disclose?'],
  ),
  outline(
    'immune-bridge',
    'Immune Bridge',
    ['Allogeneic immune cell therapy and expansion platform (异体免疫细胞疗法与扩增平台).'],
    [TABLE],
  ),
  outline(
    'cyclarity-therapeutics',
    'Cyclarity Therapeutics',
    ['Small-molecule therapy that clears arterial plaque (小分子动脉斑块清除疗法).'],
    [TABLE],
  ),
  outline('kindbio', 'KindBio', ['Kind Biotechnology: an integrated organ network (整合性器官网络).'], [TABLE]),
  outline(
    'mito-health',
    'Mito Health',
    ['Consumer blood testing and AI health management platform (消费级血液检测与AI健康管理平台).'],
    [TABLE],
  ),
  outline('kangaroo-biomedical', 'Kangaroo Biomedical', ['Artificial womb technology (人造子宫技术).'], [TABLE]),
  outline(
    'renewal-bio',
    'Renewal Bio',
    ['Synthetic stem-cell embryo and cell therapy platform (合成型干细胞胚胎与细胞疗法平台).'],
    [TABLE],
  ),
  outline('domayn', 'DOMAYN', ['Consumer neuromodulation headset (消费级神经调控头戴设备).'], [TABLE]),
  outline(
    'oisin-biotechnologies',
    'Oisín Biotechnologies',
    ['Non-viral gene therapy delivery platform (非病毒基因疗法递送平台).'],
    [TABLE],
  ),
  outline(
    'etheros-pharmaceuticals',
    'Etheros Pharmaceuticals',
    [
      'Small-molecule drug company developing catalytic antioxidants (small-molecule enzyme mimetics) for aging-related and neurodegenerative diseases, including ALS.',
      'Immortal Dragons invested in November 2025.',
    ],
    [TABLE, `${MILESTONES}:59-65`],
  ),
  outline(
    'longevity-technology',
    'Longevity.Technology',
    ['UK longevity industry media and data platform (英国长寿产业媒体与数据平台).'],
    [TABLE],
  ),
  outline(
    'vitalia',
    'Vitalia',
    ['Longevity biotech special economic zone (长寿生物科技特殊经济区).'],
    [TABLE],
    ['The tile links nowhere (https://vitalia.city/ is switched off in the code). Should the page link it?'],
  ),
  outline(
    'eonark',
    'EONARK',
    ['AI-driven longevity drug discovery (the portfolio tagline).'],
    ['src/content/companies.ts (eonark)'],
    ["CON-11 #6: EONARK is not in the profile article's portfolio table. Add it there?"],
  ),
]);
