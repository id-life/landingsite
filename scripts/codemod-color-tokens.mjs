#!/usr/bin/env node
// VIS-02 codemod: rewrite colour literals and Tailwind palette utilities in src to the tokens of
// src/styles/tokens.ts. Idempotent: run it again after merging a branch that added colours
//   node scripts/codemod-color-tokens.mjs            rewrite files, print what changed and what it could not map
//   node scripts/codemod-color-tokens.mjs --dry-run  print only
// What it rewrites:
//   - palette utilities (text-red-600, hover:bg-gray-800/50, fill-orange ...) to token utilities (text-accent ...)
//   - arbitrary colour utilities (bg-[#F6F8FB], text-[#222], bg-[#121212CC]) to token utilities
//   - hex literals in CSS to var(--color-<token>) (8-digit ones to color-mix with the same alpha)
//   - hex string literals in TS/TSX ('#C11111', fill="#BB1212") to color.<token>, adding the import
// Anything it cannot map is listed and left alone: add the colour to tokens.ts (or map it to an existing token
// here), then run it again. Files that only hold tokens (src/styles/tokens.*) are skipped.
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DRY = process.argv.includes('--dry-run');

/** Hex value (lower case, 6 digits) -> token. Near-duplicates merge on purpose (see docs/design-tokens.md). */
const HEX = {
  ffffff: 'white',
  '000000': 'black',
  c11111: 'accent',
  bb1212: 'accent',
  ff1717: 'accent',
  b41010: 'accent-hover',
  '1f1e1b': 'ink',
  f6f8fb: 'tone-50',
  f7f8fb: 'tone-50',
  f3f4f6: 'tone-75',
  f0f0f0: 'tone-100',
  b8b8b8: 'tone-250',
  cccccc: 'tone-300',
  999999: 'tone-350',
  979797: 'tone-380',
  '9c979d': 'tone-400',
  '7b7b7d': 'tone-500',
  666666: 'tone-550',
  747374: 'tone-600',
  '57595c': 'tone-650',
  '2e2f31': 'tone-750',
  222222: 'tone-800',
  121212: 'tone-950',
  101010: 'tone-960',
  '0f0f0f': 'tone-970',
  ffe500: 'data-yellow',
  ff613a: 'data-orange',
  '1edb8c': 'data-green',
  '22c55e': 'data-ok',
  '148d02': 'data-leaf',
  '062c1c': 'data-pine',
  '00ddff': 'data-cyan',
  '43bbff': 'data-sky',
  '00329a': 'data-navy',
  ce3aff: 'data-purple',
  d9b8be: 'data-rose',
  fde047: 'data-draft',
  e5ebf5: 'scene-sky',
  cbd6ea: 'scene-haze',
  '1e0000': 'scene-blood',
  d7bac4: 'twin-rose',
  b0b6c1: 'twin-steel',
  ffeaea: 'twin-blush',
  ffaeae: 'twin-light',
  '3300ff': 'fluid-ink',
  '070410': 'fluid-night',
  '0d47a1': 'sparkle-blue',
  ff4d4f: 'loader-red',
  '1f2328': 'md-fg',
  '59636e': 'md-fg-muted',
  '818b98': 'md-fg-subtle',
  f6f8fa: 'md-canvas-subtle',
  d1d9e0: 'md-border',
  '0969da': 'md-accent',
  '0550ae': 'md-accent-emphasis',
  '9a6700': 'md-attention',
  fff8c5: 'md-attention-subtle',
  '1a7f37': 'md-success',
  116329: 'md-success-emphasis',
  dafbe1: 'md-success-subtle',
  d1242f: 'md-danger',
  cf222e: 'md-danger-emphasis',
  '82071e': 'md-danger-deep',
  ffebe9: 'md-danger-subtle',
  '8250df': 'md-done',
  '6639ba': 'md-done-emphasis',
  953800: 'md-severe',
  ffd8b5: 'md-severe-subtle',
  '0a3069': 'md-string',
  '3b2300': 'md-attention-deep',
};

/** Palette utility colour (as written after the prefix) -> token. */
const PALETTE = {
  'red-500': 'accent',
  'red-600': 'accent',
  'red-700': 'accent-hover',
  'red-800': 'accent',
  'gray-100': 'tone-75',
  'gray-250': 'tone-250',
  'gray-350': 'tone-350',
  'gray-400': 'tone-400',
  'gray-500': 'tone-500',
  'gray-550': 'tone-550',
  'gray-750': 'tone-750',
  'gray-800': 'tone-800',
  'gray-950': 'tone-950',
  orange: 'data-yellow',
  'orange-600': 'data-orange',
  green: 'data-green',
  'green-500': 'data-ok',
  'yellow-300': 'data-draft',
  cyan: 'data-cyan',
  blue: 'data-sky',
  purple: 'data-purple',
};

const expand3 = (h) => (h.length === 3 ? [...h].map((c) => c + c).join('') : h);
const PREFIX =
  '(?:text|bg|border(?:-[trblxy])?|fill|stroke|from|to|via|ring|outline|decoration|divide|placeholder|caret|shadow|accent)';
const paletteRe = new RegExp(
  `(?<![\\w\\[-])(${PREFIX})-(${Object.keys(PALETTE)
    .sort((a, b) => b.length - a.length)
    .join('|')})(?![\\w-])`,
  'g',
);
const arbitraryRe = new RegExp(
  `(?<![\\w-])(${PREFIX})-\\[#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\\](/[\\d.]+)?(?![\\w-])`,
  'g',
);

const unmapped = [];
const changed = [];

function tokenFor(hex6, where) {
  const t = HEX[hex6.toLowerCase()];
  if (!t) unmapped.push(`${where}: #${hex6}`);
  return t;
}

function rewriteClasses(text, where) {
  let out = text.replace(paletteRe, (_m, prefix, c) => `${prefix}-${PALETTE[c]}`);
  out = out.replace(arbitraryRe, (m, prefix, hex, alpha) => {
    const h = expand3(hex);
    const t = tokenFor(h.slice(0, 6), where);
    if (!t) return m;
    if (h.length === 8) {
      if (alpha) return m;
      const pct = Math.round((Number.parseInt(h.slice(6), 16) / 255) * 100);
      return `${prefix}-${t}/${pct}`;
    }
    return `${prefix}-${t}${alpha ?? ''}`;
  });
  return out;
}

function rewriteCss(text, where) {
  let out = rewriteClasses(text, where);
  out = out.replace(/(^|[^\w&-])#([0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})(?![\w-])/g, (m, pre, hex) => {
    // Skip ids in selectors: a hex literal is only rewritten in a declaration value (after a colon on its line).
    const h = expand3(hex);
    const t = tokenFor(h.slice(0, 6), where);
    if (!t) return m;
    if (h.length === 8) {
      const pct = Math.round((Number.parseInt(h.slice(6), 16) / 255) * 1000) / 10;
      return `${pre}color-mix(in srgb, var(--color-${t}) ${pct}%, transparent)`;
    }
    return `${pre}var(--color-${t})`;
  });
  return out;
}

// The import is `color`, or `colorToken` in a file that already has its own `color` (a prop, a variable).
let NAME = 'color';
const key = (t) => (/^[a-z]+$/.test(t) ? `${NAME}.${t}` : `${NAME}['${t}']`);

function rewriteTs(text, where) {
  const hasOwnColor = /\bcolor\b/.test(text.replace(/import \{[^}]*\} from '@\/styles\/tokens';/g, ''));
  NAME = hasOwnColor ? 'colorToken' : 'color';
  const spec = hasOwnColor ? 'color as colorToken' : 'color';
  let out = rewriteClasses(text, where);
  let used = false;
  // JSX attribute: fill="#BB1212" -> fill={color.accent}
  out = out.replace(/(\s[\w-]+)="#([0-9a-fA-F]{6})"/g, (m, attr, hex) => {
    const t = tokenFor(hex, where);
    if (!t) return m;
    used = true;
    return `${attr}={${key(t)}}`;
  });
  // Whole string literal: '#C11111' or "#c11111" -> color.accent
  out = out.replace(/(['"])#([0-9a-fA-F]{6})\1/g, (m, _q, hex) => {
    const t = tokenFor(hex, where);
    if (!t) return m;
    used = true;
    return key(t);
  });
  // Inside a longer string ('linear-gradient(..., #FF1717 50%, ...)'): turn the literal into a template.
  out = out.replace(/'([^'\n]*#[0-9a-fA-F]{6}\b[^'\n]*)'/g, (m, body) => {
    let ok = true;
    const tpl = body.replace(/#([0-9a-fA-F]{6})\b/g, (mm, hex) => {
      const t = tokenFor(hex, where);
      if (!t) {
        ok = false;
        return mm;
      }
      return `\${${key(t)}}`;
    });
    if (!ok) return m;
    used = true;
    return `\`${tpl}\``;
  });
  if (used && !/from '@\/styles\/tokens'/.test(out)) {
    // After the last import statement (multi-line imports included).
    const imports = [...out.matchAll(/^import[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm)];
    const at = imports.length ? imports.at(-1).index + imports.at(-1)[0].length : 0;
    const directive = /^(['"])use client\1;?\s*\n/.exec(out);
    const pos = imports.length ? at : directive ? directive[0].length : 0;
    out = `${out.slice(0, pos)}${imports.length ? '\n' : ''}import { ${spec} } from '@/styles/tokens';\n${out.slice(pos)}`;
  } else if (used && !new RegExp(`\\b${NAME}\\b[^;]*from '@/styles/tokens'`).test(out)) {
    out = out.replace(
      /import \{([^}]*)\} from '@\/styles\/tokens';/,
      (m, names) => `import { ${spec},${names}} from '@/styles/tokens';`,
    );
  }
  return out;
}

const walk = (d) => readdirSync(d).flatMap((n) => (statSync(join(d, n)).isDirectory() ? walk(join(d, n)) : [join(d, n)]));
for (const file of walk(join(ROOT, 'src'))) {
  const rel = relative(ROOT, file);
  if (/(^|\/)tokens\.(ts|css)$/.test(rel)) continue;
  let next;
  const text = readFileSync(file, 'utf8');
  if (/\.(css|scss)$/.test(file)) next = rewriteCss(text, rel);
  else if (/\.(tsx?|jsx?|mjs)$/.test(file)) next = rewriteTs(text, rel);
  else continue;
  if (next !== text) {
    changed.push(rel);
    if (!DRY) writeFileSync(file, next);
  }
}
process.stdout.write(
  `${DRY ? 'would change' : 'changed'} ${changed.length} files\n${changed.map((f) => `  ${f}`).join('\n')}\n`,
);
if (unmapped.length)
  process.stdout.write(`unmapped (left as is):\n${[...new Set(unmapped)].map((u) => `  ${u}`).join('\n')}\n`);
