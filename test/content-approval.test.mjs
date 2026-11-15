// CON-10: nothing unapproved ships. Each rule of docs/content-approval.md is proven here with a fixture or a scan.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import * as content from '@/content';
import { isConfirmed } from '@/content/approval';
import { DraftRecord, ShippableApproval } from '@/content/schema';

vi.mock('@/app/(home)/_components/HomeStatementFrame', () => ({
  default: ({ children }) => children,
  StatementDoors: () => null,
}));

/** Every record (anything with an `approval`) reachable from the content index. */
function records(value, seen = new Set()) {
  if (!value || typeof value !== 'object' || seen.has(value)) return [];
  seen.add(value);
  const own = 'approval' in value ? [value] : [];
  return [...own, ...Object.values(value).flatMap((child) => records(child, seen))];
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

describe('shippable content', () => {
  const all = records(content);

  test('the content index exposes records, all of them shippable (legacy or approved)', () => {
    expect(all.length).toBeGreaterThan(80);
    const bad = all.filter((record) => !ShippableApproval.safeParse(record.approval).success);
    expect(bad).toEqual([]);
  });

  test('an approved record must name who approved it and when', () => {
    expect(ShippableApproval.safeParse({ status: 'approved', approvedBy: 'Owner' }).success).toBe(false);
    expect(ShippableApproval.safeParse({ status: 'approved', approvedAt: '2026-11-20' }).success).toBe(false);
  });

  test('a record awaiting a ruling is not confirmed for new placements', () => {
    expect(isConfirmed(content.FUND.stage)).toBe(false);
    expect(isConfirmed(content.FUND.fundSize)).toBe(true);
    expect(isConfirmed({ approval: { status: 'approved', approvedBy: 'Owner', approvedAt: '2026-11-20' } })).toBe(true);
  });
});

describe('drafts never reach production', () => {
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_DEPLOY_ENV;
    vi.resetModules();
  });

  test('every draft validates and cites at least one source', async () => {
    const { ALL_DRAFTS } = await import('@/content/drafts');
    expect(ALL_DRAFTS.length).toBeGreaterThan(30);
    for (const draft of ALL_DRAFTS) {
      expect(DraftRecord.safeParse(draft).success).toBe(true);
      expect(draft.approval.sources.length).toBeGreaterThan(0);
    }
    const ids = ALL_DRAFTS.map((draft) => draft.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('importing a draft in a production build throws (fixture: the production deploy env)', async () => {
    process.env.NEXT_PUBLIC_DEPLOY_ENV = 'production';
    vi.resetModules();
    await expect(import('@/content/drafts')).rejects.toThrow(/Drafts never ship/);
    await expect(import('@/content/drafts/about')).rejects.toThrow(/Drafts never ship/);
  });

  test('outside the review page and the drafts folder, no source file imports a draft', () => {
    const offenders = walk('src')
      .filter((file) => /\.(tsx?|mjs|jsx?)$/.test(file))
      .filter(
        (file) =>
          !relative('src', file).startsWith('content/drafts/') && !relative('src', file).startsWith('app/content-review/'),
      )
      .filter((file) => /from ['"][^'"]*content\/drafts/.test(readFileSync(file, 'utf8')));
    expect(offenders).toEqual([]);
  });

  test('the review page is a route only in non-production builds', async () => {
    const extensions = async (env) => {
      vi.resetModules();
      const saved = process.env.VERCEL_ENV;
      process.env.VERCEL_ENV = env;
      try {
        const { default: config } = await import('../next.config.mjs');
        return config.pageExtensions;
      } finally {
        if (saved === undefined) delete process.env.VERCEL_ENV;
        else process.env.VERCEL_ENV = saved;
      }
    };
    expect(await extensions('production')).not.toContain('preview.tsx');
    expect(await extensions('preview')).toContain('preview.tsx');
  });
});

describe('new placements show only confirmed facts', () => {
  // The facts that wait on a ruling, as they would render (the founder line, the stated count, the stage, the legal
  // name, the founding year). "Boyang Wang" alone may appear: the media line says he has been quoted, not who founded.
  const PENDING_TEXT = ['founded by', 'Founder</dt>', '朢舶洋', '15+', 'pre-seed', 'PRIVATE LIMITED', '>Founded<', '>2024<'];

  test('the About page renders the confirmed facts and none that wait on a ruling', async () => {
    const { default: AboutView } = await import('@/app/about/_components/AboutView');
    const html = renderToStaticMarkup(createElement(AboutView));
    expect(html).toContain('approximately US$40 million');
    expect(html).toContain(`${content.PORTFOLIO_COUNT} companies in the portfolio`);
    expect(html).toContain(content.FUND.email);
    expect(html.match(/<h1/g)).toHaveLength(1);
    for (const text of PENDING_TEXT) expect(html, `pending fact "${text}" on /about`).not.toContain(text);
  });

  test('the About page with its drafts (review page) contains the pending facts, marked as drafts', async () => {
    const { default: AboutView } = await import('@/app/about/_components/AboutView');
    const { ABOUT_DRAFTS } = await import('@/content/drafts');
    const html = renderToStaticMarkup(createElement(AboutView, { drafts: ABOUT_DRAFTS }));
    expect(html).toContain('Boyang Wang (朢舶洋) is the founder');
    expect(html).toContain('Draft, not in production');
  });

  test('the home statement is one h1 naming the fund, with confirmed facts only', async () => {
    const { default: HomeStatement } = await import('@/app/(home)/_components/HomeStatement');
    const html = renderToStaticMarkup(createElement(HomeStatement));
    expect(html.match(/<h1/g)).toHaveLength(1);
    expect(html).toMatch(/<h1[^>]*>Immortal Dragons is a purpose-driven longevity fund/);
    expect(html).toContain('approximately US$40 million');
    for (const text of PENDING_TEXT) expect(html, `pending fact "${text}" on the home statement`).not.toContain(text);
  });
});
