// CON-11: the fund facts that appear in several places must agree. Today's disagreements wait for the
// owner's ruling and are listed in PENDING_OWNER_RULING; any other divergence fails, and so does a pending
// entry that has been resolved (remove it from the list then). Nothing here decides a fact.
import { readFileSync } from 'node:fs';
import { describe, expect, test, vi } from 'vitest';
import { LLMS_CHINESE_SUMMARY, LLMS_HEADER, LLMS_SECTIONS, llmsSection } from '@/app/llms.txt/content';
import { getPortfolioJsonLd, portfolio, portfolioMarkdownLines } from '@/app/portfolio/_components/portfolioData';
import { spectrumBaseData } from '@/app/spectrum/_components/spectrumData';

// spectrumData draws section icons from the SVG barrel (svgr imports); the test only reads the names.
vi.mock('@/components/svg', () => {
  const Stub = () => null;
  return { BookSVG: Stub, DigitalTwinSVG: Stub, RelationSVG: Stub, ResearchSVG: Stub, SponsorSVG: Stub };
});

/** Owner asks recorded 2026-11-15 (CON-11). Empty each list once the owner has ruled and the copy agrees. */
const PENDING_OWNER_RULING = {
  // The Chinese profile's portfolio table lists 15 companies; the portfolio has 16.
  portfolioMissingFromProfileTable: ['EONARK'],
  // Spectrum's "Proudly Supporting" list (20) and the profile's sponsorship list (21, llms.txt and the article).
  sponsorsOnlyOnSpectrum: ['BioHackerDAO'],
  sponsorsOnlyInProfile: ['American Alzheimer Association', 'China Alzheimer Association'],
};

/** Different spellings of the same name across the copies (also an owner ask: pick one). */
const SAME_NAME = {
  'Kind Biotechnology（KindBio）': 'KindBio',
};

const key = (name) =>
  (SAME_NAME[name] ?? name)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[\s.]+/g, '')
    .toLowerCase();

const profile = readFileSync('src/content/articles/immortal-dragons-news-and-updates.md', 'utf8');

/** Column `col` of the markdown table under the `## heading` of the profile article. */
function tableColumn(heading, col) {
  const lines = profile.slice(profile.indexOf(heading)).split('\n');
  const first = lines.findIndex((line) => line.startsWith('|'));
  const length = lines.slice(first).findIndex((line) => !line.startsWith('|'));
  return lines
    .slice(first + 2, length === -1 ? undefined : first + length) // skip the header row and the --- row
    .map((line) => line.split('|')[col + 1]?.trim())
    .filter(Boolean);
}

const diff = (a, b) => a.filter((x) => !b.map(key).includes(key(x)));

describe('portfolio', () => {
  const titles = portfolio.map((item) => item.title);
  const table = tableColumn('## 二、投资组合', 1);

  test('every company in the profile table is in the portfolio', () => {
    expect(diff(table, titles)).toEqual([]);
  });

  test('the portfolio companies missing from the profile table are exactly the pending ones', () => {
    expect(diff(titles, table)).toEqual(PENDING_OWNER_RULING.portfolioMissingFromProfileTable);
  });

  test('the portfolio JSON-LD and the llms.txt list come from the same data', () => {
    const jsonLd = getPortfolioJsonLd();
    expect(jsonLd.numberOfItems).toBe(portfolio.length);
    expect(jsonLd.itemListElement.map((entry) => entry.item.name)).toEqual(titles);
    expect(portfolioMarkdownLines()).toHaveLength(portfolio.length);
  });

  // The owner, 2026-11-18 (question 12f): where a count is stated, it is 16, the portfolio.
  test('every stated investment count is the portfolio count', () => {
    const text = `${LLMS_HEADER}\n${LLMS_CHINESE_SUMMARY}\n${profile}`;
    const stated = [...text.matchAll(/(\d+)\s*(?:\+|余项|项投资|项\s*\|)/g)].map((m) => Number(m[1]));
    expect(stated.length).toBeGreaterThan(0);
    for (const n of stated) expect(n).toBe(portfolio.length);
    expect(text).not.toMatch(/15\s*(?:\+|余项)/);
  });
});

describe("llms.txt's Chinese summary", () => {
  test("is the article's own 概述 paragraphs, word for word", async () => {
    const { ARTICLE_SUMMARY_ZH } = await import('@/content/profile');
    for (const paragraph of ARTICLE_SUMMARY_ZH) expect(profile).toContain(paragraph);
    for (const paragraph of ARTICLE_SUMMARY_ZH) expect(LLMS_CHINESE_SUMMARY).toContain(paragraph);
  });
});

describe('sponsored bodies', () => {
  const spectrum = spectrumBaseData.find((section) => section.title === 'Proudly Supporting').links.map((link) => link.label);
  const llms = [...llmsSection(LLMS_SECTIONS.sponsorships).matchAll(/^- \*\*(.+?)\*\*/gm)].map((m) => m[1]);
  const table = tableColumn('## 三、行业赞助', 0);

  test('llms.txt and the profile article list the same bodies', () => {
    expect(diff(llms, table)).toEqual([]);
    expect(diff(table, llms)).toEqual([]);
  });

  test('Spectrum and the profile differ only by the pending entries', () => {
    expect(diff(spectrum, llms)).toEqual(PENDING_OWNER_RULING.sponsorsOnlyOnSpectrum);
    expect(diff(llms, spectrum)).toEqual(PENDING_OWNER_RULING.sponsorsOnlyInProfile);
  });
});

// CON-16 / SEO-06: llms.txt's Pages list quotes each page's meta description; every description is the owner's own,
// as his site serves it (2026-11-18), word for word.
describe('page descriptions', async () => {
  const { PAGES, metaDescription } = await import('@/content/pages');
  const HIS = {
    portfolio:
      "Immortal Dragons' purpose-driven investment portfolio supporting moonshot and radical life extension technologies. Backing technologies like wholebody replacement, 3D bioprinting, gene therapy, artificial womb technology and more.",
    spectrum:
      "Explore Immortal Dragon's variety of longevity initiatives on insight sharing, sponsorships, literature translation and publication, podcast channel, digital twin and clinical intelligence.",
    presence:
      "A global map of Immortal Dragons' presence --bridging East and West to advance longevity through events, partnerships, and community.",
    news: "Explore the latest news and coverage on Immortal Dragons' longevity investments, partnerships, insights and sharing.",
    'article-profile': '介绍不朽真龙基金的投资主题、投资组合、行业赞助和行业点评。',
  };

  test("llms.txt's Pages list is the owner's, without /about", () => {
    const lines = [...llmsSection('Pages').matchAll(/^- \[([^\]]+)\]\(https:\/\/www\.id\.life([^)]*)\): (.*)$/gm)];
    expect(lines).toHaveLength(13);
    expect(lines.map((m) => m[2])).not.toContain('/about');
  });

  test("the descriptions are the owner's own, word for word and uncut", () => {
    for (const [id, text] of Object.entries(HIS)) expect(PAGES.find((page) => page.id === id).description, id).toBe(text);
    for (const page of PAGES) expect(metaDescription(page)).toBe(page.description);
  });
});
