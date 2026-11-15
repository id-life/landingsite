// The post-build font guard (scripts/next-font-guard.mjs): a page that names a next/font class the stylesheets do not
// define means server and client were built from different font downloads, and every font role falls back.
import { describe, expect, test } from 'vitest';
import { undefinedFontClasses } from '../scripts/next-font-guard.mjs';

describe('next-font-guard', () => {
  const css = '.__variable_1e07a3{--font-oxanium:"Oxanium"}.__className_1e07a3{font-family:Oxanium}';
  test('passes when every font class the page uses is defined', () => {
    expect(undefinedFontClasses('<body class="__variable_1e07a3 antialiased">', css)).toEqual([]);
  });
  test('reports a class from a different download (the 2026-11-15 case)', () => {
    expect(undefinedFontClasses('<body class="__variable_75844e __variable_1e07a3">', css)).toEqual(['__variable_75844e']);
  });
});
