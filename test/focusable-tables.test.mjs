// ENG-03: a markdown table is a keyboard stop, so the phone's sideways-scrolling article tables can be reached and
// scrolled from the keyboard (axe scrollable-region-focusable).
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Markdown from 'react-markdown';
import { describe, expect, test } from 'vitest';
import { markdownRehypePlugins, markdownRemarkPlugins } from '@/utils/markdown';

const render = (md) =>
  renderToStaticMarkup(
    createElement(Markdown, { remarkPlugins: markdownRemarkPlugins, rehypePlugins: markdownRehypePlugins }, md),
  );

describe('markdown tables', () => {
  test('a table gets tabindex 0', () => {
    expect(render('| a | b |\n|--|--|\n| 1 | 2 |')).toMatch(/<table tabindex="0">/);
  });
});
