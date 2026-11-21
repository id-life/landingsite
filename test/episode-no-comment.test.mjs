// The episode page's hidden comments tab holds his "No comment" in the server HTML until it is opened, as his site
// serves it (episode pages are not prerendered, so the holding test cannot read them from the build).
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test, vi } from 'vitest';

vi.mock('next/dynamic', () => ({ default: () => () => null }));

describe('episode comments tab', () => {
  test('the server render holds the empty list, hidden', async () => {
    const { default: Tabs } = await import('@/app/podcast/[id]/_components/PodcastContentTab');
    const html = renderToStaticMarkup(createElement(Tabs, { id: '6' }, 'transcript'));
    expect(html).toMatch(/<div class="hidden"><div class="grid gap-7 mobile:gap-5"><div class="py-15">[\s\S]*No comment<\/p>/);
  });
});
