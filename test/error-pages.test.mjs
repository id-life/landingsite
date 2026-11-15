// ENG-07: the 404, the route error page and the global error page share one frame with links back into the
// site; the global one brings its own <html lang>.
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test, vi } from 'vitest';
import RouteError from '@/app/error';
import GlobalError from '@/app/global-error';
import NotFound from '@/app/not-found';

vi.mock('@sentry/nextjs', () => ({ captureException: () => {} }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: () => {} }) }));

const hrefs = (html) => [...html.matchAll(/<a [^>]*href="([^"]+)"/g)].map((m) => m[1]);

describe('error pages', () => {
  test('the 404 keeps its 11 links and its heading', () => {
    const html = renderToStaticMarkup(createElement(NotFound));
    expect(html).toContain('<h1');
    expect(html).toContain('Page not found');
    expect(hrefs(html)).toEqual([
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
