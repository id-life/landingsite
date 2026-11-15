// VIS-02: src/styles/tokens.ts is the one source of colours, font roles, type roles and grid values. tokens.css is
// generated from it (scripts/build-tokens.mjs); these tests keep the two equal, keep colour literals out of the rest
// of src, and pin the contrast and type-scale promises the token comments make.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { bodyVariables, color, cssVariables, typeRoles } from '@/styles/tokens';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const css = readFileSync(join(ROOT, 'src/styles/tokens.css'), 'utf8');

/** WCAG 2.x relative luminance and contrast ratio. */
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5]
    .map((i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

describe('tokens.css mirrors tokens.ts', () => {
  test('every custom property of tokens.ts is in tokens.css with the same value, and nothing else is', () => {
    const declared = [...css.matchAll(/^\s*(--[\w-]+):\s*(.+);$/gm)].map((m) => [m[1], m[2]]);
    expect(declared).toEqual([...cssVariables(), ...bodyVariables()]);
  });

  test('the committed tokens.css is what scripts/build-tokens.mjs writes (run it after editing tokens.ts)', async () => {
    const { renderTokensCss } = await import('../scripts/build-tokens.mjs');
    expect(css).toBe(renderTokensCss(cssVariables(), bodyVariables()));
  });
});

describe('no colour literal outside the token files', () => {
  const walk = (d) => readdirSync(d).flatMap((n) => (statSync(join(d, n)).isDirectory() ? walk(join(d, n)) : [join(d, n)]));
  const files = walk(join(ROOT, 'src')).filter((f) => /\.(tsx?|jsx?|css)$/.test(f) && !/(^|\/)tokens\.(ts|css)$/.test(f));

  test('no six-digit hex colour in src outside src/styles/tokens.{ts,css}', () => {
    const hits = files.flatMap((f) =>
      readFileSync(f, 'utf8')
        .split('\n')
        .map((line, i) => ({ line, at: `${relative(ROOT, f)}:${i + 1}` }))
        .filter(({ line }) => /#[0-9a-fA-F]{6}\b/.test(line) && !/^\s*(\/\/|\*)/.test(line))
        .map(({ at }) => at),
    );
    expect(hits).toEqual([]);
  });

  test('no Tailwind palette utility (theme.colors replaces the palette, so it would render nothing)', () => {
    const re =
      /\b(?:text|bg|border|fill|stroke|from|to|via|ring|outline|decoration|divide|placeholder|accent|caret|shadow)-(?:red|gray|grey|orange|yellow|green|cyan|blue|purple|slate|zinc|neutral|stone)-\d{2,3}\b/;
    const hits = files.filter((f) => re.test(readFileSync(f, 'utf8'))).map((f) => relative(ROOT, f));
    expect(hits).toEqual([]);
  });
});

test('the font roles are declared on body, where next/font sets the face variables they use', () => {
  const body = css.slice(css.indexOf('body {'));
  expect(body).toContain('--font-role-text: var(--font-poppins)');
  expect(css.slice(0, css.indexOf('body {'))).not.toContain('--font-role-');
  const layout = readFileSync(join(ROOT, 'src/app/layout.tsx'), 'utf8');
  expect(layout).toMatch(/<body[\s\S]*?poppins\.variable/);
});

describe('the promises in the token comments hold', () => {
  test.each([
    ['ink', 'surface', 4.5],
    ['ink-muted', 'surface', 4.5],
    ['ink-muted', 'sunken', 4.5],
    ['accent', 'surface', 4.5],
    ['ink-muted', 'tone-100', 4.5],
    ['panel-ink', 'panel', 4.5],
    ['panel-ink-muted', 'panel', 4.5],
    ['panel-ink-muted', 'black', 4.5],
    ['panel-accent', 'panel', 4.5],
  ])('%s on %s is at least %s:1', (fg, bg, bar) => {
    expect(contrast(color[fg], color[bg])).toBeGreaterThanOrEqual(bar);
  });

  test('there are nine type roles, and every fluid one tops out at no more than 2.5x its floor (RWD-01)', () => {
    expect(Object.keys(typeRoles)).toHaveLength(9);
    for (const [name, [size]] of Object.entries(typeRoles)) {
      const m = /^clamp\(([\d.]+)rem,.*,\s*([\d.]+)rem\)$/.exec(size);
      if (!m) continue; // derived from --read-body (bounded 1rem..1.375rem)
      expect(Number(m[2]) / Number(m[1]), name).toBeLessThanOrEqual(2.5);
    }
  });
});
