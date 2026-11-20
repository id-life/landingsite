// Item 17: the re-encoded transparent clips. ALPHA_CLIPS_BASE is set (the files are uploaded under v2/); every clip
// the source names maps to a listed path, so nothing can point at a file that was not
// uploaded (the upload covers exactly ALPHA_CLIP_PATHS, both formats).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { ALPHA_CLIPS_BASE } from '@/constants/media';
import { ALPHA_CLIP_PATHS, alphaClipUrl } from '@/lib/alpha-clips';

const SRC = join(import.meta.dirname, '..', 'src');
const walk = (d) => readdirSync(d).flatMap((n) => (statSync(join(d, n)).isDirectory() ? walk(join(d, n)) : [join(d, n)]));
const clipsInSource = [
  ...new Set(
    walk(SRC)
      .filter((f) => /\.(ts|tsx)$/.test(f))
      .flatMap((f) => readFileSync(f, 'utf8').match(/https:\/\/resources\.id\.life\/[\w/.-]+\.webm/g) ?? []),
  ),
].sort();

describe('transparent clips', () => {
  test('the switch is on, at the uploaded v2/ prefix', () => {
    expect(ALPHA_CLIPS_BASE).toBe('https://resources.id.life/v2');
  });

  test('off: every clip keeps its original address', () => {
    for (const url of clipsInSource) {
      expect(alphaClipUrl(url, 'vp9a', null)).toBe(url);
      expect(alphaClipUrl(url, 'hevca', null)).toBe(url);
    }
  });

  test('every clip address in the source is a listed path, and every listed path is used', () => {
    const paths = clipsInSource.map((u) => u.replace('https://resources.id.life/', '').replace(/\.webm$/, ''));
    expect(paths.sort()).toEqual([...ALPHA_CLIP_PATHS].sort());
  });

  test('on: each clip maps to its two re-encoded files under the base', () => {
    const base = 'https://resources.id.life/v2/';
    expect(alphaClipUrl('https://resources.id.life/twin/M0-1.webm', 'vp9a', base)).toBe(
      'https://resources.id.life/v2/twin/M0-1.vp9a.webm',
    );
    expect(alphaClipUrl('https://resources.id.life/engagement/sponsor/sponsor-03.webm', 'hevca', base)).toBe(
      'https://resources.id.life/v2/engagement/sponsor/sponsor-03.hevca.mp4',
    );
    // A browser that draws neither format keeps the original (it shows the still image anyway).
    expect(alphaClipUrl('https://resources.id.life/twin/M0-1.webm', null, base)).toBe(
      'https://resources.id.life/twin/M0-1.webm',
    );
    // An address that is not a listed clip is never rewritten.
    expect(alphaClipUrl('https://resources.id.life/other/x.webm', 'vp9a', base)).toBe('https://resources.id.life/other/x.webm');
  });
});
