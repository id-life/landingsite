// CON-14 on the Influence Network (the lead's reading of 2026-11-21): the page's fixed text is in its server HTML (the
// legend's four labels and the form's button, both wordings, chosen by CSS); the graph's names are not (they are
// fetched at run time and stay client-only).
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test, vi } from 'vitest';

vi.mock('next/dynamic', () => ({ default: () => () => null }));

describe('influence network fixed text', () => {
  test('legend labels and the button render on the server', async () => {
    const { default: Page } = await import('@/app/(content)/spectrum/influence-network/page');
    const html = renderToStaticMarkup(createElement(Page));
    for (const label of ['User', 'Person who inspired them', 'First impression is mixed', 'First impression is good']) {
      expect(html).toContain(`>${label}<`);
    }
    expect(html).toMatch(
      /<span class="mobile:hidden">BE PART OF IT \+<\/span><span class="hidden mobile:inline">JOIN \+<\/span>/,
    );
  });
});
