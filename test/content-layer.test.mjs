// CON-16: the content layer. Records validate when they load (so `next build` fails on bad content), fund facts are
// typed in one place, and every output that repeats them (llms.txt, the JSON-LD, the portfolio list) agrees with it.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, test, vi } from 'vitest';
import { z } from 'zod';
import * as content from '@/content';
import { Company, FundFacts, ShippableApproval, defineContent } from '@/content/schema';
import { ORGANIZATION } from '@/constants/entity';
import { getPortfolioJsonLd, portfolio, portfolioGetSourceImgInfos } from '@/app/portfolio/_components/portfolioData';

vi.mock('@/components/svg', () => {
  const Stub = () => null;
  return { BookSVG: Stub, DigitalTwinSVG: Stub, RelationSVG: Stub, ResearchSVG: Stub, SponsorSVG: Stub };
});

const { COMPANIES, FUND, LLMS_HEADER, PEOPLE, THEMES, keyFactLines } = content;

describe('validation', () => {
  const company = {
    slug: 'example-bio',
    name: 'Example Bio',
    tagline: { en: 'Example tagline' },
    logo: '/imgs/investments/example.webp',
    logoAlt: 'Example Bio logo',
    approval: { status: 'legacy', liveAt: 'test' },
  };

  test('a complete record passes', () => {
    expect(defineContent('fixture', Company, company).slug).toBe('example-bio');
  });

  test('a record missing a required field throws and names the file and the field', () => {
    const { logo, ...withoutLogo } = company;
    expect(() => defineContent('fixture.ts', Company, withoutLogo)).toThrow(/Invalid content in fixture\.ts:\n {2}logo:/);
  });

  test('presentation does not validate as content (no JSX, no class names in a slug)', () => {
    expect(() => defineContent('fixture', Company, { ...company, slug: 'w-19.5 mobile:h-full' })).toThrow(/slug/);
  });

  test('a shippable record cannot carry a draft approval', () => {
    const draft = { status: 'draft', sources: [{ ref: 'src/app/llms.txt/content.ts:18' }] };
    expect(ShippableApproval.safeParse(draft).success).toBe(false);
    expect(() => defineContent('fixture', Company, { ...company, approval: draft })).toThrow(/approval/);
  });

  test('a shippable record cannot claim approval without who and when', () => {
    expect(ShippableApproval.safeParse({ status: 'approved' }).success).toBe(false);
    expect(ShippableApproval.safeParse({ status: 'approved', approvedBy: 'Owner', approvedAt: '2026-11-20' }).success).toBe(
      true,
    );
  });

  test('the fund record re-validates', () => {
    expect(FundFacts.safeParse(FUND).success).toBe(true);
  });
});

// The same literals the plan's acceptance greps for (CON-16): outside src/content they may appear only as imports.
const FACT_LITERALS = /15\+|15余|US\$40|4000万|3 Biopolis|contact@id\.life/;

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

describe('one source per fact', () => {
  test('fund fact literals appear only under src/content', () => {
    const hits = walk('src')
      .filter((file) => !relative('src', file).startsWith('content/'))
      .filter((file) => /\.(tsx?|mjs|md|json)$/.test(file))
      .flatMap((file) =>
        readFileSync(file, 'utf8')
          .split('\n')
          .map((line, i) => (FACT_LITERALS.test(line) ? `${file}:${i + 1}` : null))
          .filter(Boolean),
      );
    expect(hits).toEqual([]);
  });

  test('llms.txt lists every key fact from the fund record', () => {
    for (const line of keyFactLines()) expect(LLMS_HEADER).toContain(`- ${line}\n`);
    expect(LLMS_HEADER).toContain(`- ${FUND.fundSize.label.en}: ${FUND.fundSize.value.en}`);
  });

  test('the Organization JSON-LD repeats the fund record', () => {
    const founder = PEOPLE.find((person) => person.slug === FUND.founder);
    expect(ORGANIZATION.email).toBe(FUND.email);
    expect(ORGANIZATION.legalName).toBe(FUND.legalName.value.en);
    expect(ORGANIZATION.founder).toMatchObject({ name: founder.name.en, alternateName: founder.name.zh });
    expect(ORGANIZATION.knowsAbout).toEqual(THEMES.map((theme) => theme.name.en));
    expect(ORGANIZATION.address).toMatchObject({
      streetAddress: FUND.address.streetAddress,
      postalCode: FUND.address.postalCode,
    });
  });

  test('the themes named in llms.txt are the theme records, and the prose count matches', () => {
    expect(LLMS_HEADER).toContain(`The fund's four investment themes are:`);
    expect(THEMES).toHaveLength(4);
    for (const theme of THEMES) expect(LLMS_HEADER).toContain(`${theme.order}. ${theme.name.en}\n`);
  });

  test('bilingual records carry both languages', () => {
    for (const theme of THEMES) expect(theme.name.zh).toBeTruthy();
    for (const value of content.CONNECT_VALUES) expect([value.title?.zh, value.text.zh].every(Boolean)).toBe(true);
    expect(content.CONNECT_CRITERIA.items.every((item) => item.zh)).toBe(true);
    for (const grant of content.PROFILE_GRANTS) expect(grant.description?.zh).toBeTruthy();
  });
});

describe('portfolio', () => {
  test('every company has a tile, a JSON-LD entry and a particle image, in order', () => {
    expect(portfolio.map((item) => item.slug)).toEqual(COMPANIES.map((company) => company.slug));
    expect(getPortfolioJsonLd().numberOfItems).toBe(COMPANIES.length);
    for (const mobile of [false, true]) {
      const particles = portfolioGetSourceImgInfos(mobile);
      // Index 0 is the idle shape; tile i shows particle i + 1.
      expect(particles).toHaveLength(COMPANIES.length + 1);
      expect(particles.every((particle) => typeof particle?.url === 'string')).toBe(true);
    }
  });

  test('no apex-domain URL in the portfolio JSON-LD', () => {
    expect(JSON.stringify(getPortfolioJsonLd())).not.toMatch(/https:\/\/id\.life/);
  });

  test('the portfolio count is computed from the records', () => {
    expect(content.PORTFOLIO_COUNT).toBe(COMPANIES.length);
  });

  test('slugs are unique in every collection', () => {
    for (const list of [COMPANIES, content.GRANTS, content.BOOKS, content.LABS, content.PAPERS, THEMES, PEOPLE]) {
      const slugs = list.map((entry) => entry.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
    expect(z.array(Company).safeParse(COMPANIES).success).toBe(true);
  });
});
