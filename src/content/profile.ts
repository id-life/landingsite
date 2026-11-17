// The fund's written profile: the text of /llms.txt. The owner's rule (2026-11-18, question 12b): "if I never put it
// in the website, then you shouldn't put it in", hidden data included. So llms.txt says only what the site shows: the
// names, the Chinese summary of the 不朽真龙介绍 article (src/content/articles/immortal-dragons-news-and-updates.md,
// shown on that page), the sponsored bodies as that article's table names them, and the pages. The investment themes
// stay as they were: on the focus the owner ruled "Don't change the text regarding this" (question 12g).
import { live } from './approval';
import { FUND } from './fund';
import { PROFILE_GRANTS } from './grants';
import { PAGES, metaDescription } from './pages';
import type { Copy } from './schema';
import { THEMES } from './themes';

/**
 * The two paragraphs under 概述 of the 不朽真龙介绍 article, word for word as the article page shows them
 * (test/content-parity.test.mjs checks it). llms.txt's Chinese summary.
 */
export const ARTICLE_SUMMARY_ZH = [
  '不朽真龙基金（Immortal Dragons）是一家总部位于新加坡、投资激进延寿领域、规模4000万美元的使命驱动基金，由朢舶洋（Boyang Wang）创立。基金致力于支持经济回报尚不明确，被主流资本所忽视，但具备长期价值的突破性项目，主要投资方向包括器官替换策略，3D生物打印，人造子宫等。',
  '基金已完成16项投资，不限地域。投资之外，不朽真龙出版翻译书籍，资助行业会议和学术机构，制作播客和媒体内容，从而支持抗衰科学研究，布道长寿理念信仰。',
];

/** The investment themes' English text (question 12g: unchanged). */
export const PROFILE_TEXT: Copy[] = [
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
];

/** One profile text by id. */
function profileText(id: string) {
  const entry = PROFILE_TEXT.find((item) => item.id === id);
  if (!entry) throw new Error(`content/profile.ts: no text "${id}"`);
  return entry.text;
}

export const LLMS_SECTIONS = {
  themes: 'Investment themes',
  sponsorships: 'Sponsorships & grants',
} as const;

/**
 * llms.txt's Pages list: every route with an llms label, in ./pages.ts order, each followed by that page's meta
 * description exactly (metaDescription), so the list and the pages say the same thing.
 */
function llmsPageLines() {
  return PAGES.filter((page) => page.llmsLabel).map(
    (page) => `- [${page.llmsLabel}](${FUND.website}${page.path}): ${metaDescription(page)}`,
  );
}

export const LLMS_HEADER = `# ${FUND.name.en} (${FUND.name.zh})

## ${LLMS_SECTIONS.themes}

The fund's four investment themes are:

${THEMES.map((theme) => `${theme.order}. ${theme.name.en}`).join('\n')}

${profileText('investment-areas').en}

${profileText('replacement-strategy').en}

${profileText('criteria').en}

## ${LLMS_SECTIONS.sponsorships}

${PROFILE_GRANTS.map((grant) => `- **${grant.name}**`).join('\n')}

## Pages

${llmsPageLines().join('\n')}
`;

export const LLMS_CHINESE_SUMMARY = `## 中文简介

${ARTICLE_SUMMARY_ZH.join('\n\n')}
`;

/** One `## heading` section of LLMS_HEADER (heading included), up to the next `## `. */
export function llmsSection(heading: string) {
  const start = LLMS_HEADER.indexOf(`## ${heading}\n`);
  if (start === -1) return '';
  const next = LLMS_HEADER.indexOf('\n## ', start + 3);
  return LLMS_HEADER.slice(start, next === -1 ? undefined : next).trim();
}
