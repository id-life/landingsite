// SEO-02: the first screen's h1 carries text, his site's own h1 on / ("Immortal Dragons 不朽真龙"), read once (the
// wordmark pictures are hidden from assistive technology) and with no hover tooltip (no SVG <title>, no title
// attribute).
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test, vi } from 'vitest';

vi.mock('next/navigation', () => ({ usePathname: () => '/' }));
vi.mock('@/../public/svgs/logo-en.svg?component', () => ({ default: () => null }));
vi.mock('@/../public/svgs/main-description.svg?component', () => ({ default: () => null }));

describe('hero heading', () => {
  test('the h1 on / has his text, once, and makes no tooltip', async () => {
    const { default: HeroPoster } = await import('@/components/gl/HeroPoster');
    const html = renderToStaticMarkup(createElement(HeroPoster));
    const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    expect(h1).not.toBeNull();
    expect(h1[1].replace(/<[^>]+>/g, '')).toBe('Immortal Dragons 不朽真龙');
    expect(html).not.toMatch(/<title>|\stitle="/);
    expect((html.match(/<svg[^>]*aria-hidden="true"/g) ?? []).length).toBe(2);
    expect(html).not.toContain('aria-label="Immortal Dragons');
  });
});
