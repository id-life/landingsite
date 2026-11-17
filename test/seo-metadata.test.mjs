// SEO-06: the owner's tab titles (og:title the same), no keywords, and descriptions cut at a sentence end.
import { describe, expect, test } from 'vitest';
import { buildMetadata, snippet } from '@/lib/seo/metadata';

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

describe('metadata', () => {
  const m = buildMetadata({
    path: '/portfolio',
    title: 'Portfolio',
    description: 'A short description of the page that is long enough to be a description.',
  });

  test('absolute title, canonical, og:title the same as the title, site name, no keywords', () => {
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

describe('snippet', () => {
  test('a description that fits is kept whole', () => {
    expect(snippet('Immortal Dragons is a purpose-driven longevity fund headquartered in Singapore.')).toBe(
      'Immortal Dragons is a purpose-driven longevity fund headquartered in Singapore.',
    );
  });

  test('English is cut at the last sentence end within 160 characters', () => {
    const text = `${'One sentence that says something about the page and goes on for a while. '.repeat(3)}Last.`;
    const out = snippet(text);
    expect(out.length).toBeLessThanOrEqual(160);
    expect(out.endsWith('.')).toBe(true);
    expect(out.length).toBeGreaterThanOrEqual(110);
  });

  test('Chinese is cut within 70 to 80 characters, at a sentence end when there is one there', () => {
    const one =
      '我们常把长命百岁作为一句真挚的祝福，但如果有人告诉你，当今在世的人群中将有相当一部分人活过一百岁，你会作何感想？这一期我们聊聊长寿科学的真实进展。后半部分我们还会谈到监管、资本和伦理三方面的争议与分歧。';
    expect(snippet(one)).toBe(
      '我们常把长命百岁作为一句真挚的祝福，但如果有人告诉你，当今在世的人群中将有相当一部分人活过一百岁，你会作何感想？这一期我们聊聊长寿科学的真实进展。',
    );
    const text =
      '抗衰老领域正处于一个爆发期，我们有了越来越多的干预手段（钥匙）和生物标志物（锁），但最大的尴尬在于：我们还不知道哪把钥匙能开哪把锁。在本期节目中，Brian Kennedy 教授以一种非常接地气的方式，梳理了该领域面临的几大核心挑战。';
    const out = snippet(text);
    expect(out.length).toBeGreaterThanOrEqual(70);
    expect(out.length).toBeLessThanOrEqual(80);
    expect(out.endsWith('…')).toBe(true);
  });

  test('without a sentence end, it is cut at a clause or word with an ellipsis', () => {
    const out = snippet(`Explore ${'many longevity initiatives, '.repeat(8)}and more`);
    expect(out.length).toBeLessThanOrEqual(160);
    expect(out.endsWith('…')).toBe(true);
  });
});

describe('snippet, bilingual and short-clause text', () => {
  test('a mostly-Latin bilingual description is cut by the Latin limit, so it is kept whole here', () => {
    const show =
      '解码长寿革命。聚焦前沿科技，洞察投资先机。Decoding the longevity revolution. A deep dive into breakthrough science, tech, and investments.';
    expect(snippet(show)).toBe(show);
  });

  test('Chinese without a clause end after 70 characters is cut at an earlier clause, not inside a word', () => {
    const text = `${'不朽真龙的重要事件与投资组合概览，涵盖基金发布、产业投资和行业参与。'}不朽真龙宣布设立 4000 万美元首期基金，投向生命延长（life extension）相关技术。`;
    const out = snippet(text);
    expect(out.endsWith('首期基金…')).toBe(true);
    expect(out.length).toBeGreaterThanOrEqual(35);
  });
});
