#!/usr/bin/env node
// Guard against next/font class names that differ between the server and the client build.
//
// next/font names each font's CSS class (__variable_<hash>, __className_<hash>) after a hash of its CSS, which for
// next/font/google includes the font files it downloaded from Google at build time. Google does not always serve the
// same bytes for the same font (seen 2026-11-15: two Oxanium latin files, 12,336 and 12,340 bytes, a few minutes
// apart). webpack's persistent cache (.next/cache/webpack/{client,server}-production) keeps each compiler's font
// module result separately and does not treat the download as an input, so when one compiler's entry is reused and
// the other's is rebuilt from a new download, the server-rendered HTML names classes that the client stylesheet never
// defines: every font role falls back to the browser default on every page. Restoring only .next/cache (as Vercel
// does between deployments) is enough to trigger it (reproduced; see docs/design-tokens.md, "Fonts and the build").
//
//   node scripts/next-font-guard.mjs --before   remove .next/cache/webpack, so both compilers start from the same
//                                               downloads in this build (costs about 25 s of compile time)
//   node scripts/next-font-guard.mjs --after    fail if any prerendered page uses a font class no stylesheet defines
// `npm run build` runs both around `next build`.
import { existsSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const NEXT = join(ROOT, '.next');

/** Font classes used by an HTML document and not defined by any of the stylesheets. */
export function undefinedFontClasses(html, css) {
  const used = new Set(html.match(/__(?:variable|className)_[0-9a-f]{6}\b/g) ?? []);
  const defined = new Set([...css.matchAll(/\.(__(?:variable|className)_[0-9a-f]{6})\b/g)].map((m) => m[1]));
  return [...used].filter((c) => !defined.has(c));
}

const walk = (d) =>
  existsSync(d) ? readdirSync(d).flatMap((n) => (statSync(join(d, n)).isDirectory() ? walk(join(d, n)) : [join(d, n)])) : [];

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  if (process.argv.includes('--before')) {
    rmSync(join(NEXT, 'cache', 'webpack'), { recursive: true, force: true });
    process.stdout.write('next-font-guard: cleared .next/cache/webpack\n');
  } else if (process.argv.includes('--after')) {
    const css = walk(join(NEXT, 'static', 'css'))
      .filter((f) => f.endsWith('.css'))
      .map((f) => readFileSync(f, 'utf8'))
      .join('\n');
    const pages = walk(join(NEXT, 'server', 'app')).filter((f) => f.endsWith('.html'));
    const bad = pages
      .map((f) => [f.slice(NEXT.length + 1), undefinedFontClasses(readFileSync(f, 'utf8'), css)])
      .filter(([, missing]) => missing.length);
    if (!pages.length) throw new Error('next-font-guard: no prerendered HTML under .next/server/app');
    if (bad.length) {
      console.error(
        `next-font-guard: ${bad.length} of ${pages.length} pages use next/font classes no stylesheet defines ` +
          `(server and client built from different font downloads). Delete .next/cache and build again.\n` +
          bad.map(([f, m]) => `  ${f}: ${m.join(' ')}`).join('\n'),
      );
      process.exit(1);
    }
    process.stdout.write(`next-font-guard: font classes consistent on ${pages.length} prerendered pages\n`);
  } else {
    console.error('usage: next-font-guard.mjs --before | --after');
    process.exit(2);
  }
}
