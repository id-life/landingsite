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
// The site header (NAV-04) comes first on the 404: the logo, the nine navigation items and
// About.
const HEADER = [
  '/',
  '/',
  '/portfolio',
  '/insights',
  '/spectrum',
  '/presence',
  '/digitaltwin',
  '/connect',
  '/news',
  '/podcast',
  '/about',
];
const afterHeader = (html) => {
  const all = hrefs(html);
  expect(all.slice(0, HEADER.length)).toEqual(HEADER);
  return all.slice(HEADER.length);
};

describe('error pages', () => {
  test('the 404 keeps its 11 links and its heading, under the site header', () => {
    const html = renderToStaticMarkup(createElement(NotFound));
    expect(html).toContain('<h1');
    expect(html).toContain('Page not found');
    expect(afterHeader(html)).toEqual([
      '/',
      '/',
      '/portfolio',
      '/insights',
      '/spectrum',
      '/presence',
      '/digitaltwin',
      '/connect',
      '/news',
      '/podcast',
    ]);
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
