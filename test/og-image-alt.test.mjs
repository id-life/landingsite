// SEO-07, og:image:alt (the lead's ruling of 2026-11-21): words the page already shows, from the source the page draws
// them from. The site cover: his h1 on / (HOME_HEADING, which the hero poster renders); the show pictures: the show's
// words as its page draws them; an episode's own picture: its title (episode page, checked in source).
import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import { HOME_HEADING } from '@/constants/home-heading';
import { buildMetadata, DEFAULT_OG_IMAGE } from '@/lib/seo/metadata';
import { PODCAST_COVER, podcastShowWords } from '@/app/podcast/_components/constant';

describe('og:image:alt', () => {
  test('the site cover carries his h1, the same string the hero poster draws', () => {
    expect(DEFAULT_OG_IMAGE.alt).toBe(HOME_HEADING);
    const meta = buildMetadata({ path: '/x', title: 'X', description: 'd' });
    expect(meta.openGraph.images[0].alt).toBe(HOME_HEADING);
    expect(readFileSync('src/components/gl/HeroPoster.tsx', 'utf8')).toContain('{HOME_HEADING}</span>');
  });

  test('a show picture carries the show words its page draws', () => {
    expect(podcastShowWords('id')).toBe(`${PODCAST_COVER.id.title} ${PODCAST_COVER.id.enTitle}`);
    expect(podcastShowWords('lt')).toBe('龙门阵 Long Talk');
    expect(readFileSync('src/app/podcast/_components/PodcastCover.tsx', 'utf8')).toMatch(
      /\{data\.title\}[\s\S]*\{data\.enTitle\}/,
    );
  });

  test('an episode picture carries the title its h1 draws, or the show words with the show picture', () => {
    const page = readFileSync('src/app/podcast/[id]/page.tsx', 'utf8');
    expect(page).toMatch(/alt: data\.title/);
    expect(page).toMatch(/alt: podcastShowWords\(categoryOf\(data\)\)/);
    expect(page).toMatch(/<h1[^>]*>\{data\.title\}<\/h1>/);
  });
});
