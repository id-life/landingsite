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
  'Healthy Longevity and Medicine Conference': 'Health Longevity and Medicine Conference',
};

const key = (name) =>
  (SAME_NAME[name] ?? name)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[\s.]+/g, '')
    .toLowerCase();

const profile = readFileSync('src/app/news/immortal-dragons-news-and-updates/article.md', 'utf8');

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

  test('every stated investment count is a lower bound the portfolio meets', () => {
    const stated = [...`${LLMS_HEADER}\n${LLMS_CHINESE_SUMMARY}\n${profile}`.matchAll(/(\d+)\s*(?:\+|余项)/g)].map((m) =>
      Number(m[1]),
    );
    expect(stated.length).toBeGreaterThan(0);
    for (const n of stated) expect(n).toBeLessThanOrEqual(portfolio.length);
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
