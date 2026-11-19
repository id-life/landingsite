// ENG-07: the 404, the route error page and the global error page share one frame with links back into the
// site; the global one brings its own <html lang>.
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test, vi } from 'vitest';
import RouteError from '@/app/error';
import GlobalError from '@/app/global-error';
import NotFound from '@/app/not-found';

vi.mock('@sentry/nextjs', () => ({ captureException: () => {} }));
// SVGR components of the site header (vitest has no SVGR loader).
vi.mock('@/../public/svgs/menu-close.svg?component', () => ({ default: () => null }));
vi.mock('@/../public/svgs/subscribe-border.svg?component', () => ({ default: () => null }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: () => {} }), usePathname: () => '/missing' }));

const hrefs = (html) => [...html.matchAll(/<a [^>]*href="([^"]+)"/g)].map((m) => m[1]);

// Text of ours the error pages used to draw, which his site never showed.
const REMOVED = ['Something went wrong', '页面加载出错', 'Try again', '重试', 'Site sections', 'Home 首页', 'Page not found'];

describe('error pages', () => {
  // The owner's rule (no text he has not shown): the 404 draws what his site's 404 draws, "404" and "This page could
  // not be found.", under the site header (his logo and SUBSCRIBE: the way home his default page lacked).
  test('the 404 says only what his 404 says, under the site header', async () => {
    const html = renderToStaticMarkup(createElement(NotFound));
    expect(html).toMatch(/<h1[^>]*>404<\/h1>/);
    expect(html).toMatch(/<h2[^>]*>This page could not be found\.<\/h2>/);
    expect(html).toContain('<header');
    for (const text of ['Page not found', 'PAGE NOT FOUND', '页面不存在', 'does not exist or has moved', 'Site sections'])
      expect(html).not.toContain(text);
  });

  // His route error page draws one "Reload" button; ours adds the site header (the way home) and nothing else.
  test('the route error page draws only his Reload, under the site header', () => {
    const html = renderToStaticMarkup(createElement(RouteError, { error: new Error('boom'), reset: () => {} }));
    expect(html).toMatch(/<button[^>]*>Reload<\/button>/);
    // The header is loaded when the page shows (next/dynamic), so a static render does not hold it: check the source.
    expect(readFileSync('src/app/error.tsx', 'utf8')).toMatch(/dynamic\(\(\) => import\('@\/components\/site\/SiteHeader'\)\)/);
    for (const text of REMOVED) expect(html).not.toContain(text);
  });

  // His global error page is the framework's default: one sentence, no title.
  test('the global error page draws only the default sentence, with its own <html lang="en">', () => {
    const html = renderToStaticMarkup(createElement(GlobalError, { error: new Error('boom') }));
    expect(html).toMatch(/^<html lang="en">/);
    expect(html).toContain(
      'Application error: a client-side exception has occurred (see the browser console for more information).',
    );
    expect(html).not.toContain('<title');
    expect(hrefs(html)).toEqual([]);
    for (const text of REMOVED) expect(html).not.toContain(text);
  });
  // The section, chunk and podcast-list failures draw only his "Reload" (his rule: no text he has not shown).
  test('no error state anywhere draws our old sentences or "Try again"', async () => {
    const files = [
      'src/components/common/ErrorState.tsx',
      'src/components/common/ClientChunkBoundary.tsx',
      'src/components/common/SectionLoadError.tsx',
      'src/app/podcast/_components/PodcastList.tsx',
      'src/app/error.tsx',
      'src/app/global-error.tsx',
      'src/app/not-found.tsx',
    ];
    const gone = [...REMOVED, '加载失败', 'Could not load this content', '暂时无法加载', 'could not be loaded right now'];
    for (const file of files)
      for (const text of gone) expect(readFileSync(file, 'utf8'), `${file}: ${text}`).not.toContain(text);
    const { default: SectionLoadError } = await import('@/components/common/SectionLoadError');
    const html = renderToStaticMarkup(createElement(SectionLoadError, { onRetry: () => {} }));
    expect(html.replace(/<[^>]+>/g, '')).toBe('Reload');
  });
});
