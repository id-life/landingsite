// The post-build font guard (scripts/next-font-guard.mjs): a page that names a next/font class the stylesheets do not
// define means server and client were built from different font downloads, and every font role falls back.
import { describe, expect, test } from 'vitest';
import { fontClassReport, undefinedFontClasses } from '../scripts/next-font-guard.mjs';

describe('next-font-guard', () => {
  const css = '.__variable_1e07a3{--font-oxanium:"Oxanium"}.__className_1e07a3{font-family:Oxanium}';
  test('passes when every font class the page uses is defined', () => {
    expect(undefinedFontClasses('<body class="__variable_1e07a3 antialiased">', css)).toEqual([]);
  });
  test('reports a class from a different download (the 2026-11-15 case)', () => {
    expect(undefinedFontClasses('<body class="__variable_75844e __variable_1e07a3">', css)).toEqual(['__variable_75844e']);
  });

  // The build is judged from the server output, because the deployment host has no prerendered .html where a local
  // build has it (seven preview builds failed on that on 2026-11-16 while their fonts were consistent).
  const bundle = 'e.exports={className:"__className_1e07a3",variable:"__variable_1e07a3"}';
  test('a build with server bundles and no prerendered page is judged, and passes when consistent', () => {
    expect(
      fontClassReport(
        [
          ['server/chunks/1.js', bundle],
          ['server/chunks/2.js', 'no fonts here'],
        ],
        css,
      ),
    ).toEqual({ blind: false, bad: [], files: 1, classes: 2 });
  });
  test('a server bundle from a different download is reported', () => {
    const stale = bundle.replaceAll('1e07a3', '75844e');
    const r = fontClassReport(
      [
        ['server/chunks/1.js', stale],
        ['server/app/index.html', '<body class="__variable_75844e">'],
      ],
      css,
    );
    expect(r.blind).toBe(false);
    expect(r.bad).toEqual([
      ['server/chunks/1.js', ['__className_75844e', '__variable_75844e']],
      ['server/app/index.html', ['__variable_75844e']],
    ]);
  });
  test('server output that names no font class at all is blind, not consistent', () => {
    expect(fontClassReport([['server/chunks/2.js', 'no fonts here']], css)).toMatchObject({ blind: true, bad: [] });
    expect(fontClassReport([], css)).toMatchObject({ blind: true });
  });
});
