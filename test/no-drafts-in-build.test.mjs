// CON-10: a production build contains no draft text and no review page. Runs only against a build directory:
//   VERCEL_ENV=production npx next build && CHECK_BUILD_DIR=.next npx vitest run test/no-drafts-in-build.test.mjs
// (a non-production build must fail it: it carries the review page, which proves the check can see drafts).
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import * as content from '@/content';

const BUILD = process.env.CHECK_BUILD_DIR;

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (name === 'cache') return [];
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

describe.skipIf(!BUILD)('production build output', () => {
  test('no draft line and no review page in the build', async () => {
    expect(existsSync(BUILD), `${BUILD} exists`).toBe(true);
    const { ALL_DRAFTS } = await import('@/content/drafts');
    // Lines that only a draft contains (a draft may quote live copy, which is allowed to be in the build).
    const shipped = JSON.stringify(content);
    const needles = [
      ...new Set(
        ALL_DRAFTS.flatMap((draft) => [draft.body.en, draft.body.zh ?? ''].flatMap((text) => text.split('\n')))
          .map((line) => line.replace(/^- /, '').trim())
          .filter((line) => line.length >= 24 && !shipped.includes(line)),
      ),
    ];
    expect(needles.length).toBeGreaterThan(20);
    const files = walk(BUILD).filter((file) => /\.(html|js|rsc|body|json|txt|meta)$/.test(file));
    const found = [];
    for (const file of files) {
      const text = readFileSync(file, 'utf8');
      for (const needle of needles) {
        if (text.includes(needle) || text.includes(JSON.stringify(needle).slice(1, -1)))
          found.push(`${needle.slice(0, 60)} in ${file}`);
      }
    }
    const reviewRoutes = files.filter((file) => /content-review/.test(file));
    expect({ found: found.slice(0, 10), reviewRoutes: reviewRoutes.slice(0, 10) }).toEqual({ found: [], reviewRoutes: [] });
  });
});
