// MOT-10 A1: GSAP animates transform and opacity, never a layout property (width, height, left, top, right, bottom),
// which makes the browser lay the page out again on every frame. Lint rejects a layout key in the vars of to, from,
// fromTo and set; the tweens that predate the rule are listed by file in eslint.config.mjs and leave the list as each
// is converted.
import { ESLint } from 'eslint';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { GSAP_LAYOUT_TWEEN_FILES } from '../eslint.config.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const isLayoutRule = (m) => m.ruleId === 'no-restricted-syntax' && /MOT-10/.test(m.message);

describe('no GSAP layout tweens (MOT-10)', () => {
  const eslint = new ESLint({ cwd: root });
  const lint = async (code, filePath = 'src/components/example.ts') =>
    (await eslint.lintText(code, { filePath })).flatMap((r) => r.messages).filter(isLayoutRule);

  test('each layout key in to, from, fromTo and set is reported', async () => {
    const code = [
      "import gsap from 'gsap';",
      'export const a = (tl: gsap.core.Timeline) => {',
      "  gsap.to('.x', { width: 10, height: 10 });",
      "  gsap.from('.x', { left: 0 });",
      "  gsap.fromTo('.x', { top: 0 }, { bottom: 0 });",
      "  gsap.set('.x', { right: 0 });",
      "  tl.to('.x', { 'height': '100%' });",
      '};',
      '',
    ].join('\n');
    expect(await lint(code)).toHaveLength(7);
  }, 30_000);

  test('transform, opacity and clip-path are allowed, and so is a quickTo of x', async () => {
    const code = [
      "import gsap from 'gsap';",
      'export const a = () => {',
      "  gsap.to('.x', { x: 10, y: 10, scale: 2, scaleY: 0.5, opacity: 0, clipPath: 'inset(0%)' });",
      "  gsap.set('.x', { xPercent: -50, autoAlpha: 1 });",
      "  gsap.quickTo('.x', 'x');",
      '  Array.from({ length: 3 });',
      '};',
      '',
    ].join('\n');
    expect(await lint(code)).toHaveLength(0);
  }, 30_000);

  test('a quickTo or quickSetter of a layout property is reported', async () => {
    const code =
      "import gsap from 'gsap';\nexport const a = () => [gsap.quickTo('.x', 'width'), gsap.quickSetter('.x', 'top', 'px')];\n";
    expect(await lint(code)).toHaveLength(2);
  }, 30_000);

  test('every listed file still has a layout tween (a converted file leaves the list)', async () => {
    for (const file of GSAP_LAYOUT_TWEEN_FILES) {
      const code = readFileSync(`${root}/${file}`, 'utf8');
      const strict = new ESLint({
        cwd: root,
        overrideConfigFile: true,
        overrideConfig: {
          files: ['**/*.ts', '**/*.tsx'],
          languageOptions: {
            parser: (await import('@typescript-eslint/parser')).default,
            parserOptions: { ecmaFeatures: { jsx: true } },
          },
          rules: { 'no-restricted-syntax': ['error', ...(await import('../eslint.config.mjs')).GSAP_LAYOUT_RULES] },
        },
      });
      const messages = (await strict.lintText(code, { filePath: file })).flatMap((r) => r.messages);
      expect(
        messages.filter((m) => m.fatal),
        file,
      ).toEqual([]);
      const hits = messages.filter(isLayoutRule);
      expect(hits.length, file).toBeGreaterThan(0);
    }
  }, 60_000);
});
