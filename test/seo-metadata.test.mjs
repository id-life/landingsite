// SEO-06: one title rule (topic | brand in the page's language), og:title without the brand, no keywords, and
// descriptions cut at a sentence end. The seo-wire-check probe applies the same rules to the built HTML.
import { describe, expect, test } from 'vitest';
import { brandTitle, buildMetadata, localeOf, snippet } from '@/lib/seo/metadata';

// The rule of the seo-wire-check probe: a bilingual label (an English word or phrase next to its Chinese
// translation) or a brand suffix in the other script. Latin proper names inside a Chinese title are allowed.
const mixesScripts = (title) => {
  const [topic, brand] = title.split(' | ');
  const label = /^[A-Za-z][A-Za-z &]*\s+[一-鿿]+$/.test(topic) || /^[一-鿿]+\s+[A-Za-z][A-Za-z &]*$/.test(topic);
  const brandMismatch = brand !== undefined && localeOf(brand) !== localeOf(topic);
  const bilingualBrand = /Immortal Dragons/.test(title) && /不朽真龙/.test(title);
  return label || brandMismatch || bilingualBrand;
};

describe('titles', () => {
  test('English topics carry the English brand, Chinese topics the Chinese one', () => {
    expect(brandTitle('Portfolio')).toBe('Portfolio | Immortal Dragons');
    expect(brandTitle('播客')).toBe('播客 | 不朽真龙');
    expect(brandTitle('E17 所谓的“延寿”可能只是假象 Brian Kennedy')).toBe(
      'E17 所谓的“延寿”可能只是假象 Brian Kennedy | 不朽真龙',
    );
  });

  test('a topic that names the brand is not suffixed twice', () => {
    expect(brandTitle('不朽真龙介绍')).toBe('不朽真龙介绍');
    expect(brandTitle('Immortal Dragons')).toBe('Immortal Dragons');
  });

  test('the rule the wire check uses passes the new titles and flags the old ones', () => {
    for (const t of ['Portfolio | Immortal Dragons', '龙门阵 | 不朽真龙', 'E15 攻克衰老 Aubrey de Grey: 损伤修复 | 不朽真龙'])
      expect(mixesScripts(t), t).toBe(false);
    for (const t of [
      'Portfolio 投资 | Immortal Dragons 不朽真龙',
      'CONNECT 联结',
      '龙门阵 Long Talk Podcast | Immortal Dragons',
    ])
      expect(mixesScripts(t), t).toBe(true);
  });
});

describe('metadata', () => {
  const m = buildMetadata({
    path: '/portfolio',
    title: 'Portfolio',
    description: 'A short description of the page that is long enough to be a description.',
  });

  test('absolute title, canonical, og:title without the brand, site name, no keywords', () => {
    expect(m.title).toEqual({ absolute: 'Portfolio | Immortal Dragons' });
    expect(m.alternates).toEqual({ canonical: '/portfolio' });
    expect(m.openGraph).toMatchObject({ title: 'Portfolio', siteName: 'Immortal Dragons', url: '/portfolio' });
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
