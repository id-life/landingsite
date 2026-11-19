// SEO-06: the owner's tab titles (og:title the same), his keywords, and his descriptions served whole.
import { describe, expect, test } from 'vitest';
import { buildMetadata } from '@/lib/seo/metadata';

// The owner's tab titles (question 5i, 2026-11-18), as his site (the original production build) titles each page.
const HIS_TITLES = {
  home: 'Immortal Dragons 不朽真龙',
  portfolio: 'Portfolio 投资',
  insights: 'Insights 洞见',
  spectrum: 'Spectrum 谱系',
  presence: 'Presence 印记',
  digitaltwin: 'DigitalTwin 孪生',
  connect: 'CONNECT 联结',
  news: 'News 新闻 | Immortal Dragons',
  podcast: 'Podcast 播客 | Immortal Dragons 不朽真龙',
  'podcast-long-talk': '龙门阵 Long Talk Podcast | Immortal Dragons',
  'disease-management': 'Disease Management & Cure Status | Immortal Dragons',
  'influence-network': 'Influence Network | Immortal Dragons',
  'article-profile': 'Immortal Dragons News and Updates',
  'article-milestones': 'Immortal Dragons: Milestones and Portfolio',
};

describe('titles', () => {
  test("every page's tab title and og:title are the owner's own", async () => {
    const { PAGES, pageMeta } = await import('@/content/pages');
    expect(Object.keys(HIS_TITLES).sort()).toEqual(PAGES.map((page) => page.id).sort());
    for (const [id, title] of Object.entries(HIS_TITLES)) {
      const m = buildMetadata(pageMeta(id));
      expect(m.title, id).toEqual({ absolute: title });
      expect(m.openGraph?.title, id).toBe(title);
    }
  });

  test('a page without a tab title of its own is "<topic> | Immortal Dragons" (an episode, on his site)', () => {
    const m = buildMetadata({ path: '/podcast/54', title: 'E19 避孕药', description: 'x'.repeat(40) });
    expect(m.title).toEqual({ absolute: 'E19 避孕药 | Immortal Dragons' });
    expect(m.openGraph?.title).toBe('E19 避孕药 | Immortal Dragons');
  });
});

describe('keywords', () => {
  test("a page's own keywords are served as given; without them the site's list (root layout) applies", async () => {
    const { pageMeta } = await import('@/content/pages');
    expect(buildMetadata(pageMeta('podcast')).keywords).toEqual([
      'Longevity',
      'Health',
      'Science',
      'Tech',
      'Investment',
      'Biotech',
      '长寿',
      '健康',
      '科技',
      '投资',
      '生物科技',
    ]);
    expect(buildMetadata(pageMeta('portfolio'))).not.toHaveProperty('keywords');
  });
});

describe('descriptions', () => {
  test('a description is served whole, never cut', () => {
    const long = `${"One sentence of the owner's own description. ".repeat(10)}`.trim();
    const m = buildMetadata({ path: '/x', title: 'X', description: long });
    expect(m.description).toBe(long);
    expect(m.openGraph?.description).toBe(long);
  });
});

describe('metadata', () => {
  const m = buildMetadata({
    path: '/portfolio',
    title: 'Portfolio',
    description: 'A short description of the page that is long enough to be a description.',
  });

  test('absolute title, canonical, og:title the same as the title, site name; no keywords of its own unless given', () => {
    expect(m.title).toEqual({ absolute: 'Portfolio | Immortal Dragons' });
    expect(m.alternates).toEqual({ canonical: '/portfolio' });
    expect(m.openGraph).toMatchObject({
      title: 'Portfolio | Immortal Dragons',
      siteName: 'Immortal Dragons',
      url: '/portfolio',
    });
    expect(m).not.toHaveProperty('keywords');
  });
});
