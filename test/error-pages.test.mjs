// ENG-07: the 404, the route error page and the global error page share one frame with links back into the
// site; the global one brings its own <html lang>.
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

  test('the route error page has one sentence, Try again and links to Home, News, Podcast and Connect', () => {
    const html = renderToStaticMarkup(createElement(RouteError, { error: new Error('boom'), reset: () => {} }));
    expect(html).toContain('Something went wrong');
    expect(html).toMatch(/<button[^>]*>Try again/);
    // No site header here: the route error boundary is part of every route's bundle (PERF-10).
    expect(hrefs(html)).toEqual(['/', '/', '/news', '/podcast', '/connect']);
  });

  test('the global error page renders its own <html lang="en"> with the same frame', () => {
    const html = renderToStaticMarkup(createElement(GlobalError, { error: new Error('boom') }));
    expect(html).toMatch(/^<html lang="en">/);
    expect(html).toContain('<body style=');
    expect(html).toContain('Something went wrong');
    expect(hrefs(html)).toEqual(['/', '/', '/news', '/podcast', '/connect']);
  });
});
