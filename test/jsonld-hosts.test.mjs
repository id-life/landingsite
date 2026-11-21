// SEO-08 A2, the host clause: every structured datum in the built pages names the site on its one host: no string in
// any JSON-LD block uses the bare id.life host or a preview or local host (localhost, 127.0.0.1, *.vercel.app, a UAT
// host). Other sites' addresses (the news items' own @id, pictures on resources.id.life and cdn.id.life, sameAs
// profiles) are his data as his site serves it (A2's other clauses are overruled by rule a) and are left alone.
// Reads the prerendered HTML of the last `next build` (.next/server/app); skipped when there is none, so it runs in CI
// after the build step and locally after any build.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = '.next/server/app';
const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : name.endsWith('.html') ? [path] : [];
  });
const pages = existsSync(ROOT) ? walk(ROOT).filter((f) => !/content-review|_global-error|_not-found/.test(f)) : [];

const blocks = (html) =>
  [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
function strings(value, key = '', out = []) {
  if (typeof value === 'string') out.push([key, value]);
  else if (Array.isArray(value)) value.forEach((v) => strings(v, key, out));
  else if (value && typeof value === 'object') Object.entries(value).forEach(([k, v]) => strings(v, k, out));
  return out;
}
const WRONG_HOST = /https?:\/\/(id\.life|localhost|127\.0\.0\.1|[^/"]*\.vercel\.app|[^/"]*uat[^/"]*)(?=[/:"]|$)/i;

describe.skipIf(pages.length === 0)('structured data hosts (built pages)', () => {
  test('no JSON-LD string names a bare, preview or local host of the site', () => {
    const problems = [];
    let count = 0;
    for (const file of pages) {
      for (const block of blocks(readFileSync(file, 'utf8'))) {
        count += 1;
        for (const [key, value] of strings(block)) {
          if (WRONG_HOST.test(value)) problems.push(`${file}: ${key} ${value}`);
        }
      }
    }
    expect(count).toBeGreaterThan(0);
    expect(problems).toEqual([]);
  });
});

describe('the host rule itself', () => {
  test('catches the bare, preview and local hosts, and leaves the site and other sites alone', () => {
    for (const bad of [
      'https://id.life/news',
      'http://localhost:3000/',
      'http://127.0.0.1:4581/x',
      'https://landingsite-git-x.vercel.app/',
    ]) {
      expect(WRONG_HOST.test(bad), bad).toBe(true);
    }
    for (const good of [
      'https://www.id.life/news',
      'https://resources.id.life/id-life-cover-2.webp',
      'https://cdn.id.life/a.webp',
      'https://36kr.com/p/1',
    ]) {
      expect(WRONG_HOST.test(good), good).toBe(false);
    }
  });
});
