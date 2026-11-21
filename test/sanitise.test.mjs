// ENG-06: CMS content cannot inject markup. JSON-LD escapes '<', the markdown pipeline sanitises raw HTML,
// podcast timeline markers are built as tree nodes, and API URLs pass through safeHref.
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Markdown from 'react-markdown';
import { describe, expect, test } from 'vitest';
import JsonLd from '@/components/seo/JsonLd';
import { serializeJsonLd } from '@/utils/json-ld';
import { markdownRehypePlugins, markdownRemarkPlugins, remarkTimeline } from '@/utils/markdown';
import { safeHref } from '@/utils/safe-href';

const TITLE = '</script><script>window.__x=1</script>';
const BODY = [
  '# Heading',
  '',
  'Text with **bold** and a [link](https://example.com/a) and | a | table |',
  '',
  '| a | b |',
  '|:--|--:|',
  '| 1 | 2 |',
  '',
  '<script>window.__y=1</script>',
  '<img src=x onerror=window.__z=1>',
  '<a href="javascript:window.__w=1">click</a>',
  '<div onclick="window.__v=1" style="color:red">div</div>',
  '<iframe src="https://evil.example/embed"></iframe>',
  '<iframe src="https://www.youtube.com/embed/abc123" title="video"></iframe>',
  '<meta http-equiv="refresh" content="0;url=https://evil.example">',
  '<svg><script>window.__u=1</script></svg>',
  'line<br>break',
].join('\n');

/** Attribute names of every tag, with the attribute values removed first (a value may contain any text). */
const attributeNames = (html) =>
  [...html.replace(/="[^"]*"/g, '').matchAll(/<[a-z][a-z0-9]*((?:\s+[^\s>]+)*)\s*\/?>/gi)].flatMap((m) =>
    m[1].trim().split(/\s+/).filter(Boolean),
  );

const render = (markdown, remarkPlugins = markdownRemarkPlugins) =>
  renderToStaticMarkup(createElement(Markdown, { remarkPlugins, rehypePlugins: markdownRehypePlugins }, markdown));

describe('JSON-LD', () => {
  test("serialises every '<' as \\u003c and stays parseable", () => {
    const data = { '@type': 'NewsArticle', headline: TITLE };
    const out = serializeJsonLd(data);
    expect(out).not.toContain('<');
    expect(JSON.parse(out)).toEqual(data);
  });

  test('the JsonLd component cannot be closed by a title', () => {
    const html = renderToStaticMarkup(createElement(JsonLd, { data: [{ headline: TITLE }, { name: '<!-- x' }] }));
    expect(html.match(/<script/g)).toHaveLength(1);
    expect(html.match(/<\/script>/g)).toHaveLength(1);
    const body = html.replace(/^<script type="application\/ld\+json">/, '').replace(/<\/script>$/, '');
    expect(JSON.parse(body)[0].headline).toBe(TITLE);
  });
});

describe('markdown pipeline', () => {
  const html = render(BODY);

  test('drops scripts, event handlers, inline styles and javascript: URLs', () => {
    expect(html).not.toMatch(/<script/i);
    expect(html).not.toMatch(/window\.__/);
    expect(attributeNames(html).filter((name) => /^on/i.test(name))).toEqual([]);
    expect(html).not.toMatch(/javascript:/i);
    expect(html).not.toMatch(/<meta/i);
    // The only styles left are the ones react-markdown writes for aligned table cells.
    expect(
      (html.match(/style="[^"]*"/g) ?? []).filter((style) => !/^style="text-align:(left|right|center)"$/.test(style)),
    ).toEqual([]);
  });

  test('keeps YouTube embeds and nothing else framed', () => {
    expect(html).toContain('src="https://www.youtube.com/embed/abc123"');
    expect(html).not.toContain('evil.example');
    // The refused frame is dropped, not left as an empty box.
    expect(html.match(/<iframe/g)).toHaveLength(1);
  });

  test('keeps ordinary markdown: headings, emphasis, links, aligned tables, line breaks', () => {
    expect(html).toContain('<h1>Heading</h1>');
    expect(html).toContain('<strong>bold</strong>');
    expect(html).toContain('<a href="https://example.com/a">link</a>');
    expect(html).toContain('<th style="text-align:left">a</th>');
    expect(html).toContain('<td style="text-align:right">2</td>');
    expect(html).toContain('line<br/>break');
  });
});

describe('podcast timeline markers', () => {
  const transcript = (md) => render(md, [...markdownRemarkPlugins, remarkTimeline]);

  // ENG-03: each marker is also a button for assistive technology and a Tab stop (role button, tabindex 0).
  test('@[timeline](mm:ss) becomes a clickable span with its two data attributes, a button and a Tab stop', () => {
    const html = transcript('Intro @[timeline](01:07) and **@[timeline](12:34)**');
    expect(html).toContain(
      '<span class="custom-timeline" data-custom-type="timeline" data-custom-param="01:07" role="button" tabindex="0">01:07</span>',
    );
    expect(html).toContain(
      '<strong><span class="custom-timeline" data-custom-type="timeline" data-custom-param="12:34" role="button" tabindex="0">12:34</span></strong>',
    );
    expect(html).not.toContain('@');
  });

  test('a crafted marker cannot add attributes or markup', () => {
    const html = transcript('@[timeline](x" onmouseover="window.__t=1) @[timeline](<img src=x onerror=window.__s=1>)');
    // The payloads survive only as text and as quoted, escaped attribute values.
    expect(attributeNames(html).filter((name) => /^on/i.test(name))).toEqual([]);
    expect(html).not.toMatch(/<img/i);
    expect([...new Set(attributeNames(html))].sort()).toEqual([
      'class',
      'data-custom-param',
      'data-custom-type',
      'role',
      'tabindex',
    ]);
  });
});

describe('safeHref', () => {
  test.each([
    ['https://example.com/a?b=1#c', 'https://example.com/a?b=1#c'],
    ['http://example.com', 'http://example.com'],
    ['/news/123', '/news/123'],
    ['  /podcast/56  ', '/podcast/56'],
  ])('accepts %j', (input, expected) => expect(safeHref(input)).toBe(expected));

  test.each([
    'javascript:alert(1)',
    ' JaVaScRiPt:alert(1)',
    'java\tscript:alert(1)',
    'java\nscript:alert(1)',
    '\u0001javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
    '//evil.example/path',
    '/\\evil.example',
    '/\t/evil.example',
    '#',
    '',
    'news/123',
    undefined,
    null,
    42,
  ])('rejects %j', (input) => expect(safeHref(input)).toBeUndefined());
});
